import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getDevUser, isDevMode } from "@/lib/dev-user";

export async function POST() {
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

    const subscription = await db.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
