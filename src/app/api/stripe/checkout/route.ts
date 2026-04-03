import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { PLANS } from "@/lib/plans";
import { getDevUser, isDevMode } from "@/lib/dev-user";

export async function POST(request: Request) {
  try {
    let user;
    if (isDevMode()) {
      user = await getDevUser();
    } else {
      const session = await auth();
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { subscription: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();
    const planConfig = PLANS[plan];

    if (!planConfig || !planConfig.stripePriceId) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const subscription = await db.subscription.findUnique({
      where: { userId: user.id },
    });

    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      if (subscription) {
        await db.subscription.update({
          where: { userId: user.id },
          data: { stripeCustomerId: customerId },
        });
      }
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.stripePriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
