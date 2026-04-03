import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDevUser, isDevMode } from "@/lib/dev-user";
import { generateDecayAnalysis } from "@/lib/ai-analysis";
import type { DecayResult } from "@/lib/decay-engine";

async function getCurrentUser() {
  if (isDevMode()) {
    return getDevUser();
  }
  const session = await auth();
  if (!session?.user?.email) return null;
  return db.user.findUnique({ where: { email: session.user.email } });
}

// POST /api/pages/[id]/analyze - generate AI analysis for a page
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = await db.page.findUnique({
      where: { id },
      include: {
        site: true,
        snapshots: {
          orderBy: { date: "desc" },
          take: 60,
        },
      },
    });

    if (!page || page.site.userId !== user.id) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check plan limits
    const subscription = await db.subscription.findUnique({
      where: { userId: user.id },
    });
    const plan = subscription?.plan ?? "free";
    if (plan === "free") {
      const analysisCount = await db.analysis.count({
        where: {
          page: { site: { userId: user.id } },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      });
      if (analysisCount >= 5) {
        return NextResponse.json(
          { error: "Free plan allows 5 AI analyses per month. Upgrade to get unlimited analyses." },
          { status: 403 }
        );
      }
    }

    // Build decay result from snapshots
    const snapshots = page.snapshots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (snapshots.length < 2) {
      return NextResponse.json(
        { error: "Not enough data to analyze. Try syncing first." },
        { status: 400 }
      );
    }

    const midpoint = Math.floor(snapshots.length / 2);
    const recentSnapshots = snapshots.slice(midpoint);
    const previousSnapshots = snapshots.slice(0, midpoint);

    const avg = (arr: typeof snapshots) => ({
      clicks: arr.reduce((s, a) => s + a.clicks, 0) / arr.length,
      impressions: arr.reduce((s, a) => s + a.impressions, 0) / arr.length,
      ctr: arr.reduce((s, a) => s + a.ctr, 0) / arr.length,
      position: arr.reduce((s, a) => s + a.position, 0) / arr.length,
    });

    const recent = avg(recentSnapshots);
    const previous = avg(previousSnapshots);

    const decayResult: DecayResult = {
      pageId: page.id,
      url: page.url,
      decayScore: 50,
      clicksChange: previous.clicks > 0
        ? Math.round(((recent.clicks - previous.clicks) / previous.clicks) * 100)
        : 0,
      impressionsChange: previous.impressions > 0
        ? Math.round(((recent.impressions - previous.impressions) / previous.impressions) * 100)
        : 0,
      positionChange: Math.round((recent.position - previous.position) * 10) / 10,
      ctrChange: Math.round((recent.ctr - previous.ctr) * 10000) / 100,
      severity: "medium",
      recentClicks: Math.round(recent.clicks),
      previousClicks: Math.round(previous.clicks),
      recentImpressions: Math.round(recent.impressions),
      previousImpressions: Math.round(previous.impressions),
      recentPosition: Math.round(recent.position * 10) / 10,
      previousPosition: Math.round(previous.position * 10) / 10,
    };

    const analysis = await generateDecayAnalysis(page.url, decayResult);

    const saved = await db.analysis.create({
      data: {
        pageId: page.id,
        decayScore: decayResult.decayScore,
        summary: analysis.summary,
        recommendations: JSON.stringify(analysis.recommendations),
      },
    });

    return NextResponse.json({
      analysis: {
        ...saved,
        recommendations: analysis.recommendations,
      },
    });
  } catch (error) {
    console.error("Error analyzing page:", error);
    return NextResponse.json(
      { error: "Failed to analyze page" },
      { status: 500 }
    );
  }
}
