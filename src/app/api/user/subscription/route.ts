import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDevUser, isDevMode } from "@/lib/dev-user";

export async function GET() {
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
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await db.subscription.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      plan: subscription?.plan || "free",
      sitesUsed: subscription?.sitesUsed || 0,
      sitesLimit: subscription?.sitesLimit || 1,
      pagesUsed: subscription?.pagesUsed || 0,
      pagesLimit: subscription?.pagesLimit || 50,
      analysesUsed: subscription?.analysesUsed || 0,
      analysesLimit: subscription?.analysesLimit || 5,
      stripeCustomerId: subscription?.stripeCustomerId || null,
      currentPeriodEnd: subscription?.stripeCurrentPeriodEnd || null,
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
