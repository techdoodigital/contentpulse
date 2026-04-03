import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { PLANS, getPlanByPriceId } from "@/lib/plans";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          const planConfig = PLANS[plan];
          if (planConfig) {
            await db.subscription.upsert({
              where: { userId },
              update: {
                plan: plan,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                stripePriceId: planConfig.stripePriceId,
                sitesLimit: planConfig.limits.sites,
                pagesLimit: planConfig.limits.pages,
                analysesLimit: planConfig.limits.analyses,
                analysesUsed: 0,
              },
              create: {
                userId,
                plan: plan,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                stripePriceId: planConfig.stripePriceId,
                sitesLimit: planConfig.limits.sites,
                pagesLimit: planConfig.limits.pages,
                analysesLimit: planConfig.limits.analyses,
              },
            });
          }
        }
        break;
      }

      case "invoice.paid": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const subscriptionId = (typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id ?? null) as string | null;

        if (subscriptionId) {
          // Reset monthly usage on invoice payment
          const sub = await db.subscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
          });
          if (sub) {
            await db.subscription.update({
              where: { id: sub.id },
              data: {
                analysesUsed: 0,
                stripeCurrentPeriodEnd: invoice.lines.data[0]?.period?.end
                  ? new Date(invoice.lines.data[0].period.end * 1000)
                  : undefined,
              },
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        const priceId = subscription.items.data[0]?.price?.id;

        if (priceId) {
          const planConfig = getPlanByPriceId(priceId);
          const sub = await db.subscription.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (sub && planConfig) {
            await db.subscription.update({
              where: { id: sub.id },
              data: {
                plan: planConfig.slug,
                stripePriceId: priceId,
                sitesLimit: planConfig.limits.sites,
                pagesLimit: planConfig.limits.pages,
                analysesLimit: planConfig.limits.analyses,
                stripeCurrentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
              },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        const sub = await db.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (sub) {
          const freePlan = PLANS.free;
          await db.subscription.update({
            where: { id: sub.id },
            data: {
              plan: "free",
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
              sitesLimit: freePlan.limits.sites,
              pagesLimit: freePlan.limits.pages,
              analysesLimit: freePlan.limits.analyses,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
