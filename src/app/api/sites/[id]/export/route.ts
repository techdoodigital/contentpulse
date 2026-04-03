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

// GET /api/sites/[id]/export - export decay report as CSV
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
            snapshots: { orderBy: { date: "desc" }, take: 60 },
            analyses: { orderBy: { createdAt: "desc" }, take: 1 },
            alerts: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
      },
    });

    if (!site || site.userId !== user.id) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Build CSV rows
    const headers = [
      "Page URL",
      "Page Title",
      "Decay Score",
      "Severity",
      "Clicks Change %",
      "Impressions Change %",
      "Position Change",
      "CTR Change",
      "Recent Avg Clicks",
      "Previous Avg Clicks",
      "Recent Avg Impressions",
      "Previous Avg Impressions",
      "Recent Avg Position",
      "AI Summary",
      "Last Analysis Date",
    ];

    const rows: string[][] = [];

    for (const page of site.pages) {
      if (page.snapshots.length < 2) continue;

      const snapshots = [...page.snapshots].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const midpoint = Math.floor(snapshots.length / 2);
      const recentSnaps = snapshots.slice(midpoint);
      const previousSnaps = snapshots.slice(0, midpoint);

      const avg = (arr: typeof snapshots) => {
        if (arr.length === 0)
          return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
        return {
          clicks: arr.reduce((s, a) => s + a.clicks, 0) / arr.length,
          impressions:
            arr.reduce((s, a) => s + a.impressions, 0) / arr.length,
          ctr: arr.reduce((s, a) => s + a.ctr, 0) / arr.length,
          position: arr.reduce((s, a) => s + a.position, 0) / arr.length,
        };
      };

      const recent = avg(recentSnaps);
      const previous = avg(previousSnaps);

      const clicksChange =
        previous.clicks > 0
          ? ((recent.clicks - previous.clicks) / previous.clicks) * 100
          : 0;
      const impressionsChange =
        previous.impressions > 0
          ? ((recent.impressions - previous.impressions) /
              previous.impressions) *
            100
          : 0;
      const positionChange = recent.position - previous.position;
      const ctrChange = recent.ctr - previous.ctr;

      // Compute decay score
      const analysis = page.analyses[0];
      let decayScore = 0;
      let severity = "healthy";

      if (analysis) {
        decayScore = analysis.decayScore;
      } else {
        const clicksScore = Math.min(100, Math.max(0, -clicksChange));
        const impressionsScore = Math.min(
          100,
          Math.max(0, -impressionsChange)
        );
        const positionScore = Math.min(
          100,
          Math.max(0, positionChange * 10)
        );
        const ctrScore = Math.min(100, Math.max(0, -ctrChange * 100));
        decayScore = Math.round(
          clicksScore * 0.4 +
            impressionsScore * 0.3 +
            positionScore * 0.2 +
            ctrScore * 0.1
        );
      }

      if (decayScore >= 70) severity = "critical";
      else if (decayScore >= 50) severity = "high";
      else if (decayScore >= 30) severity = "medium";
      else if (decayScore > 15) severity = "low";

      const escapeCsv = (val: string) => {
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      rows.push([
        escapeCsv(page.url),
        escapeCsv(page.title || ""),
        String(Math.round(decayScore)),
        severity,
        String(Math.round(clicksChange)),
        String(Math.round(impressionsChange)),
        String(Math.round(positionChange * 10) / 10),
        String(Math.round(ctrChange * 10000) / 100),
        String(Math.round(recent.clicks)),
        String(Math.round(previous.clicks)),
        String(Math.round(recent.impressions)),
        String(Math.round(previous.impressions)),
        String(Math.round(recent.position * 10) / 10),
        escapeCsv(analysis?.summary || "No analysis yet"),
        analysis
          ? new Date(analysis.createdAt).toISOString().split("T")[0]
          : "",
      ]);
    }

    // Sort by decay score descending
    rows.sort(
      (a, b) => parseInt(b[2] || "0") - parseInt(a[2] || "0")
    );

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );

    const siteName =
      site.displayName || site.siteUrl.replace(/https?:\/\//, "").replace(/\/$/, "");
    const date = new Date().toISOString().split("T")[0];
    const filename = `contentpulse-${siteName}-${date}.csv`;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
