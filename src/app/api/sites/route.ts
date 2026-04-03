import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDevUser, isDevMode } from "@/lib/dev-user";
import { DEMO_MODE, seedDemoDataForSite } from "@/lib/demo-data";
import { listSites } from "@/lib/gsc";

async function getCurrentUser() {
  if (isDevMode()) {
    return getDevUser();
  }
  const session = await auth();
  if (!session?.user?.email) return null;
  return db.user.findUnique({ where: { email: session.user.email } });
}

// GET /api/sites - list user's connected sites
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sites = await db.site.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { pages: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sites });
  } catch (error) {
    console.error("Error fetching sites:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch sites", detail: message },
      { status: 500 }
    );
  }
}

// POST /api/sites - add a site from GSC
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { siteUrl } = await request.json();
    if (!siteUrl) {
      return NextResponse.json(
        { error: "siteUrl is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this site in GSC (skip in dev/demo mode)
    if (!isDevMode() && !DEMO_MODE) {
      const gscSites = await listSites(user.id);
      const hasAccess = gscSites.some((s) => s.siteUrl === siteUrl);
      if (!hasAccess) {
        return NextResponse.json(
          { error: "You do not have access to this site in Google Search Console." },
          { status: 403 }
        );
      }
    }

    const site = await db.site.upsert({
      where: {
        userId_siteUrl: { userId: user.id, siteUrl },
      },
      update: {},
      create: {
        userId: user.id,
        siteUrl,
        displayName: new URL(siteUrl.replace("sc-domain:", "https://")).hostname,
      },
    });

    // Seed demo data (pages, snapshots, alerts, analyses) in demo mode
    if (DEMO_MODE) {
      await seedDemoDataForSite(site.id, siteUrl);
    }

    return NextResponse.json({ site });
  } catch (error) {
    console.error("Error adding site:", error);
    return NextResponse.json(
      { error: "Failed to add site" },
      { status: 500 }
    );
  }
}
