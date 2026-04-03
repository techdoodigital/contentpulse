import { db } from "@/lib/db";
import { fetchPagePerformance } from "@/lib/gsc";
import { format, subDays } from "date-fns";

export interface DecayResult {
  pageId: string;
  url: string;
  decayScore: number;
  clicksChange: number;
  impressionsChange: number;
  positionChange: number;
  ctrChange: number;
  severity: "low" | "medium" | "high" | "critical";
  recentClicks: number;
  previousClicks: number;
  recentImpressions: number;
  previousImpressions: number;
  recentPosition: number;
  previousPosition: number;
}

function calculateDecayScore(
  clicksChange: number,
  impressionsChange: number,
  positionChange: number,
  ctrChange: number
): number {
  // Weighted decay score: 0 = no decay, 100 = severe decay
  // Negative changes mean decline (bad)
  const clicksWeight = 0.4;
  const impressionsWeight = 0.3;
  const positionWeight = 0.2;
  const ctrWeight = 0.1;

  // Normalize changes to 0-100 scale
  const clicksScore = Math.min(100, Math.max(0, -clicksChange));
  const impressionsScore = Math.min(100, Math.max(0, -impressionsChange));
  // Position going up (higher number) is bad
  const positionScore = Math.min(100, Math.max(0, positionChange * 10));
  const ctrScore = Math.min(100, Math.max(0, -ctrChange * 100));

  return Math.round(
    clicksScore * clicksWeight +
    impressionsScore * impressionsWeight +
    positionScore * positionWeight +
    ctrScore * ctrWeight
  );
}

function getSeverity(decayScore: number): "low" | "medium" | "high" | "critical" {
  if (decayScore >= 70) return "critical";
  if (decayScore >= 50) return "high";
  if (decayScore >= 30) return "medium";
  return "low";
}

export async function syncSiteData(userId: string, siteId: string): Promise<void> {
  const site = await db.site.findUnique({
    where: { id: siteId },
    include: { user: true },
  });

  if (!site || site.userId !== userId) {
    throw new Error("Site not found or access denied.");
  }

  const today = new Date();
  // GSC data has a ~3 day delay
  const endDate = format(subDays(today, 3), "yyyy-MM-dd");
  // Fetch last 90 days
  const startDate = format(subDays(today, 93), "yyyy-MM-dd");

  const pageData = await fetchPagePerformance(
    userId,
    site.siteUrl,
    startDate,
    endDate,
    1000
  );

  // Upsert pages and create snapshots
  for (const pd of pageData) {
    const page = await db.page.upsert({
      where: {
        siteId_url: { siteId, url: pd.page },
      },
      update: { updatedAt: new Date() },
      create: {
        siteId,
        url: pd.page,
      },
    });

    // Store as a single snapshot for this sync period
    await db.snapshot.upsert({
      where: {
        pageId_date: { pageId: page.id, date: endDate },
      },
      update: {
        clicks: pd.clicks,
        impressions: pd.impressions,
        ctr: pd.ctr,
        position: pd.position,
      },
      create: {
        pageId: page.id,
        date: endDate,
        clicks: pd.clicks,
        impressions: pd.impressions,
        ctr: pd.ctr,
        position: pd.position,
      },
    });
  }

  await db.site.update({
    where: { id: siteId },
    data: { lastSyncedAt: new Date() },
  });
}

export async function detectDecay(siteId: string): Promise<DecayResult[]> {
  const pages = await db.page.findMany({
    where: { siteId },
    include: {
      snapshots: {
        orderBy: { date: "desc" },
        take: 60,
      },
    },
  });

  const results: DecayResult[] = [];

  for (const page of pages) {
    if (page.snapshots.length < 2) continue;

    const snapshots = page.snapshots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Compare recent period vs previous period
    const midpoint = Math.floor(snapshots.length / 2);
    const recentSnapshots = snapshots.slice(midpoint);
    const previousSnapshots = snapshots.slice(0, midpoint);

    const avg = (arr: { clicks: number; impressions: number; ctr: number; position: number }[]) => {
      if (arr.length === 0) return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      return {
        clicks: arr.reduce((s, a) => s + a.clicks, 0) / arr.length,
        impressions: arr.reduce((s, a) => s + a.impressions, 0) / arr.length,
        ctr: arr.reduce((s, a) => s + a.ctr, 0) / arr.length,
        position: arr.reduce((s, a) => s + a.position, 0) / arr.length,
      };
    };

    const recent = avg(recentSnapshots);
    const previous = avg(previousSnapshots);

    // Calculate percentage changes
    const clicksChange = previous.clicks > 0
      ? ((recent.clicks - previous.clicks) / previous.clicks) * 100
      : 0;
    const impressionsChange = previous.impressions > 0
      ? ((recent.impressions - previous.impressions) / previous.impressions) * 100
      : 0;
    const positionChange = recent.position - previous.position;
    const ctrChange = recent.ctr - previous.ctr;

    const decayScore = calculateDecayScore(
      clicksChange,
      impressionsChange,
      positionChange,
      ctrChange
    );

    // Only include pages with meaningful decay (score > 15)
    if (decayScore > 15) {
      results.push({
        pageId: page.id,
        url: page.url,
        decayScore,
        clicksChange: Math.round(clicksChange),
        impressionsChange: Math.round(impressionsChange),
        positionChange: Math.round(positionChange * 10) / 10,
        ctrChange: Math.round(ctrChange * 10000) / 100,
        severity: getSeverity(decayScore),
        recentClicks: Math.round(recent.clicks),
        previousClicks: Math.round(previous.clicks),
        recentImpressions: Math.round(recent.impressions),
        previousImpressions: Math.round(previous.impressions),
        recentPosition: Math.round(recent.position * 10) / 10,
        previousPosition: Math.round(previous.position * 10) / 10,
      });
    }
  }

  // Sort by decay score (worst first)
  results.sort((a, b) => b.decayScore - a.decayScore);

  // Create alerts for high/critical decay
  for (const result of results) {
    if (result.severity === "high" || result.severity === "critical") {
      const existingAlert = await db.alert.findFirst({
        where: {
          pageId: result.pageId,
          type: "decay",
          createdAt: { gte: subDays(new Date(), 7) },
        },
      });

      if (!existingAlert) {
        await db.alert.create({
          data: {
            pageId: result.pageId,
            type: "decay",
            severity: result.severity,
            message: `Traffic declined ${Math.abs(result.clicksChange)}% with position shifting by ${result.positionChange > 0 ? "+" : ""}${result.positionChange}. This page needs attention.`,
          },
        });
      }
    }
  }

  return results;
}
