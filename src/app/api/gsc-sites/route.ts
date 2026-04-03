import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDevUser, isDevMode } from "@/lib/dev-user";
import { DEMO_MODE, DEMO_GSC_SITES } from "@/lib/demo-data";
import { listSites } from "@/lib/gsc";

async function getCurrentUser() {
  if (isDevMode()) {
    return getDevUser();
  }
  const session = await auth();
  if (!session?.user?.email) return null;
  return db.user.findUnique({ where: { email: session.user.email } });
}

// GET /api/gsc-sites - list sites from Google Search Console
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isDevMode() || DEMO_MODE) {
      // Return mock data in dev/demo mode
      return NextResponse.json({
        sites: DEMO_GSC_SITES,
      });
    }

    const sites = await listSites(user.id);
    return NextResponse.json({ sites });
  } catch (error) {
    console.error("Error fetching GSC sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites from Google Search Console. Please reconnect your Google account." },
      { status: 500 }
    );
  }
}
