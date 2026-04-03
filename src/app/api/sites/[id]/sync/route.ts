import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDevUser, isDevMode } from "@/lib/dev-user";
import { syncSiteData, detectDecay } from "@/lib/decay-engine";
import { generateBulkInsights } from "@/lib/ai-analysis";
import { sendDecayAlertEmail } from "@/lib/email";

async function getCurrentUser() {
  if (isDevMode()) {
    return getDevUser();
  }
  const session = await auth();
  if (!session?.user?.email) return null;
  return db.user.findUnique({ where: { email: session.user.email } });
}

// POST /api/sites/[id]/sync - sync GSC data and detect decay
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

    const site = await db.site.findUnique({ where: { id } });
    if (!site || site.userId !== user.id) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    // Step 1: Sync data from GSC
    await syncSiteData(user.id, id);

    // Step 2: Detect decay patterns
    const decayResults = await detectDecay(id);

    // Step 3: Generate AI insights if there are decaying pages
    let insights = "";
    if (decayResults.length > 0) {
      try {
        insights = await generateBulkInsights(site.siteUrl, decayResults);
      } catch (aiError) {
        console.error("Failed to generate AI insights:", aiError);
        insights = "AI insights temporarily unavailable.";
      }
    }

    // Step 4: Send email notification if user has alerts enabled
    if (decayResults.length > 0 && user.emailAlerts && user.email) {
      const severityOrder = ["critical", "high", "medium", "low"];
      const thresholdIndex = severityOrder.indexOf(user.alertThreshold);
      const qualifyingAlerts = decayResults
        .filter((r) => severityOrder.indexOf(r.severity) <= thresholdIndex)
        .map((r) => ({
          severity: r.severity,
          message: `Decay score ${r.decayScore}: clicks ${r.clicksChange}%, impressions ${r.impressionsChange}%`,
          pageUrl: r.url,
        }));

      if (qualifyingAlerts.length > 0) {
        // Send asynchronously without blocking the response
        sendDecayAlertEmail(
          user.email,
          user.name,
          site.displayName || site.siteUrl,
          site.id,
          qualifyingAlerts
        ).catch((err) => console.error("Failed to send alert email:", err));
      }
    }

    return NextResponse.json({
      synced: true,
      pagesFound: decayResults.length,
      decayResults,
      insights,
    });
  } catch (error) {
    console.error("Error syncing site:", error);
    const message = error instanceof Error ? error.message : "Failed to sync site";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
