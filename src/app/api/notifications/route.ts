import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDevUser, isDevMode } from "@/lib/dev-user";

async function getCurrentUser() {
  if (isDevMode()) {
    return getDevUser();
  }
  const session = await auth();
  if (!session?.user?.email) return null;
  return db.user.findUnique({ where: { email: session.user.email } });
}

// GET /api/notifications - get recent alerts for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await db.alert.findMany({
      where: {
        page: {
          site: { userId: user.id },
        },
      },
      include: {
        page: {
          select: {
            url: true,
            title: true,
            site: { select: { id: true, displayName: true, siteUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = alerts.filter((a) => !a.read).length;

    return NextResponse.json({
      alerts: alerts.map((a) => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        message: a.message,
        read: a.read,
        createdAt: a.createdAt,
        pageUrl: a.page.url,
        pageTitle: a.page.title,
        siteId: a.page.site.id,
        siteName: a.page.site.displayName || a.page.site.siteUrl,
      })),
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - mark alerts as read
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { alertIds, markAllRead } = body;

    if (markAllRead) {
      // Mark all user's alerts as read
      await db.alert.updateMany({
        where: {
          page: { site: { userId: user.id } },
          read: false,
        },
        data: { read: true },
      });
    } else if (alertIds && Array.isArray(alertIds)) {
      // Mark specific alerts as read
      await db.alert.updateMany({
        where: {
          id: { in: alertIds },
          page: { site: { userId: user.id } },
        },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
