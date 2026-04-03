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

// GET /api/sites/[id]/pages - get all pages with latest snapshots
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const site = await db.site.findUnique({ where: { id } });
    if (!site || site.userId !== user.id) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const pages = await db.page.findMany({
      where: { siteId: id },
      include: {
        snapshots: {
          orderBy: { date: "desc" },
          take: 2,
        },
        alerts: {
          where: { read: false },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}
