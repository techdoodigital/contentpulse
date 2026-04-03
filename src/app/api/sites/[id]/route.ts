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

// GET /api/sites/[id] - get site details with decay summary
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

    const site = await db.site.findUnique({
      where: { id },
      include: {
        pages: {
          include: {
            snapshots: {
              orderBy: { date: "desc" },
              take: 30,
            },
            alerts: {
              where: { read: false },
              orderBy: { createdAt: "desc" },
              take: 3,
            },
            analyses: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
            _count: { select: { analyses: true } },
          },
        },
      },
    });

    if (!site || site.userId !== user.id) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    return NextResponse.json({ site });
  } catch (error) {
    console.error("Error fetching site:", error);
    return NextResponse.json(
      { error: "Failed to fetch site" },
      { status: 500 }
    );
  }
}

// DELETE /api/sites/[id] - remove a site
export async function DELETE(
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

    await db.site.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 }
    );
  }
}
