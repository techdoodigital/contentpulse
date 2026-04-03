import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const [
      totalUsers,
      totalSites,
      totalPages,
      totalAlerts,
      newsletterSubs,
      freeCount,
      starterCount,
      proCount,
      recentAlerts,
      recentTickets,
    ] = await Promise.all([
      db.user.count(),
      db.site.count(),
      db.page.count(),
      db.alert.count(),
      db.newsletterSubscriber.count(),
      db.subscription.count({ where: { plan: "free" } }),
      db.subscription.count({ where: { plan: "starter" } }),
      db.subscription.count({ where: { plan: "pro" } }),
      db.alert.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          page: {
            include: {
              site: { select: { siteUrl: true, userId: true } },
            },
          },
        },
      }),
      db.supportTicket.findMany({
        where: { status: "open" },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalSites,
      totalPages,
      totalAlerts,
      newsletterSubs,
      subscriptionsByPlan: {
        free: freeCount,
        starter: starterCount,
        pro: proCount,
      },
      recentAlerts,
      recentTickets,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
