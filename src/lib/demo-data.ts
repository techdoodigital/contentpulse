import { db } from "@/lib/db";

export const DEMO_MODE = process.env.DEMO_MODE === "true";

export const DEMO_GSC_SITES = [
  { siteUrl: "https://doodigital.co/", permissionLevel: "siteOwner" },
  { siteUrl: "https://oranemedia.com/", permissionLevel: "siteOwner" },
  { siteUrl: "sc-domain:esaleswiz.com", permissionLevel: "siteOwner" },
];

// Realistic demo pages for each site
const DEMO_PAGES: Record<string, { url: string; title: string }[]> = {
  "https://doodigital.co/": [
    { url: "https://doodigital.co/blog/seo-strategies-2025", title: "Top SEO Strategies for 2025" },
    { url: "https://doodigital.co/blog/content-marketing-guide", title: "The Ultimate Content Marketing Guide" },
    { url: "https://doodigital.co/services/web-design", title: "Web Design Services" },
    { url: "https://doodigital.co/blog/local-seo-tips", title: "Local SEO Tips for Small Businesses" },
    { url: "https://doodigital.co/case-studies/ecommerce-growth", title: "Case Study: 300% E-commerce Growth" },
    { url: "https://doodigital.co/blog/google-ads-mistakes", title: "7 Google Ads Mistakes to Avoid" },
    { url: "https://doodigital.co/about", title: "About DooDigital" },
    { url: "https://doodigital.co/blog/ai-marketing-tools", title: "Best AI Marketing Tools in 2025" },
  ],
  "https://oranemedia.com/": [
    { url: "https://oranemedia.com/blog/video-marketing-roi", title: "Measuring Video Marketing ROI" },
    { url: "https://oranemedia.com/services/social-media", title: "Social Media Management" },
    { url: "https://oranemedia.com/blog/instagram-reels-guide", title: "Instagram Reels: Complete Guide" },
    { url: "https://oranemedia.com/blog/brand-storytelling", title: "The Power of Brand Storytelling" },
    { url: "https://oranemedia.com/portfolio", title: "Our Portfolio" },
    { url: "https://oranemedia.com/blog/tiktok-for-business", title: "TikTok for Business: Getting Started" },
  ],
  "sc-domain:esaleswiz.com": [
    { url: "https://esaleswiz.com/blog/cold-email-templates", title: "10 Cold Email Templates That Convert" },
    { url: "https://esaleswiz.com/blog/sales-automation-tools", title: "Best Sales Automation Tools" },
    { url: "https://esaleswiz.com/features", title: "Features" },
    { url: "https://esaleswiz.com/blog/crm-comparison", title: "CRM Comparison: HubSpot vs Salesforce vs Pipedrive" },
    { url: "https://esaleswiz.com/blog/lead-scoring-guide", title: "Lead Scoring: A Complete Guide" },
  ],
};

// Generate realistic snapshot data with decay patterns
function generateSnapshots(pageIndex: number, daysBack: number = 30) {
  const snapshots: { date: string; clicks: number; impressions: number; ctr: number; position: number }[] = [];
  const now = new Date();

  // Different decay patterns per page
  const patterns = [
    { baseClicks: 45, baseImpressions: 800, basePosition: 4.2, decay: "declining" },
    { baseClicks: 120, baseImpressions: 2200, basePosition: 2.1, decay: "stable" },
    { baseClicks: 30, baseImpressions: 500, basePosition: 8.5, decay: "sharp_decline" },
    { baseClicks: 80, baseImpressions: 1500, basePosition: 3.8, decay: "recovering" },
    { baseClicks: 15, baseImpressions: 300, basePosition: 12.3, decay: "declining" },
    { baseClicks: 200, baseImpressions: 4000, basePosition: 1.5, decay: "stable" },
    { baseClicks: 55, baseImpressions: 900, basePosition: 6.1, decay: "sharp_decline" },
    { baseClicks: 35, baseImpressions: 600, basePosition: 9.4, decay: "recovering" },
  ];

  const pattern = patterns[pageIndex % patterns.length];

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const progress = (daysBack - i) / daysBack; // 0 to 1

    let clickMultiplier = 1;
    let positionShift = 0;

    switch (pattern.decay) {
      case "declining":
        clickMultiplier = 1 - progress * 0.5;
        positionShift = progress * 4;
        break;
      case "sharp_decline":
        clickMultiplier = progress > 0.6 ? 1 - (progress - 0.6) * 2.2 : 1;
        positionShift = progress > 0.6 ? (progress - 0.6) * 12 : 0;
        break;
      case "stable":
        clickMultiplier = 0.9 + Math.random() * 0.2;
        positionShift = (Math.random() - 0.5) * 0.8;
        break;
      case "recovering":
        clickMultiplier = progress < 0.4 ? 1 - progress * 0.8 : 0.6 + (progress - 0.4) * 1.2;
        positionShift = progress < 0.4 ? progress * 6 : 2.4 - (progress - 0.4) * 4;
        break;
    }

    // Add some daily noise
    const noise = 0.8 + Math.random() * 0.4;
    const clicks = Math.max(1, Math.round(pattern.baseClicks * clickMultiplier * noise));
    const impressions = Math.max(clicks, Math.round(pattern.baseImpressions * clickMultiplier * noise));
    const position = Math.max(1, Number((pattern.basePosition + positionShift + (Math.random() - 0.5)).toFixed(1)));
    const ctr = Number((clicks / impressions).toFixed(4));

    snapshots.push({ date: dateStr, clicks, impressions, ctr, position });
  }

  return snapshots;
}

// Generate alerts for decaying pages
function generateAlerts(decayType: string) {
  const alerts: { type: string; severity: string; message: string }[] = [];

  if (decayType === "declining") {
    alerts.push({
      type: "position_drop",
      severity: "warning",
      message: "Average position dropped by 3.2 over the last 14 days",
    });
    alerts.push({
      type: "clicks_drop",
      severity: "warning",
      message: "Clicks decreased by 42% compared to previous period",
    });
  } else if (decayType === "sharp_decline") {
    alerts.push({
      type: "position_drop",
      severity: "critical",
      message: "Average position dropped from 6.1 to 14.8 in the last 10 days",
    });
    alerts.push({
      type: "clicks_drop",
      severity: "critical",
      message: "Clicks plummeted by 78% - immediate attention needed",
    });
    alerts.push({
      type: "impressions_drop",
      severity: "warning",
      message: "Impressions dropped by 55% - possible indexing issue",
    });
  }

  return alerts;
}

// Generate AI analysis for pages
function generateAnalysis(pageTitle: string, decayType: string) {
  const analyses: Record<string, { decayScore: number; summary: string; recommendations: string }> = {
    declining: {
      decayScore: 65,
      summary: `"${pageTitle}" is showing a gradual decline in rankings and traffic over the past 30 days. The page has lost approximately 3 positions in average ranking, leading to a 40% drop in organic clicks.`,
      recommendations: JSON.stringify([
        "Update the content with fresh statistics and examples from 2025",
        "Add new sections covering recent developments in the topic",
        "Improve internal linking from higher-authority pages on your site",
        "Review and optimize meta title and description for better CTR",
        "Check for new competing content that may have overtaken this page",
      ]),
    },
    sharp_decline: {
      decayScore: 89,
      summary: `"${pageTitle}" has experienced a severe traffic drop in the last 10 days. The page lost significant ranking positions rapidly, suggesting a potential algorithmic penalty or a strong new competitor.`,
      recommendations: JSON.stringify([
        "Audit the page for thin content or keyword stuffing issues",
        "Check Google Search Console for any manual actions or security issues",
        "Analyze new SERP competitors to identify what content they are ranking with",
        "Consider a comprehensive content refresh with updated data and media",
        "Verify all external links are still working and relevant",
        "Check if the page was affected by a recent Google algorithm update",
      ]),
    },
    stable: {
      decayScore: 15,
      summary: `"${pageTitle}" is performing consistently with stable rankings and traffic. No significant decay detected.`,
      recommendations: JSON.stringify([
        "Continue monitoring for any changes in ranking trends",
        "Consider adding schema markup to enhance SERP appearance",
        "Look for opportunities to capture featured snippets",
      ]),
    },
    recovering: {
      decayScore: 42,
      summary: `"${pageTitle}" experienced a dip in performance but is showing signs of recovery. Rankings are starting to improve after a mid-period decline.`,
      recommendations: JSON.stringify([
        "Continue the recovery by adding more comprehensive content",
        "Build additional backlinks to reinforce authority",
        "Monitor closely over the next 2 weeks to confirm the upward trend",
        "Optimize page speed and Core Web Vitals for better user experience",
      ]),
    },
  };

  return analyses[decayType] || analyses.stable;
}

const DECAY_PATTERNS = ["declining", "stable", "sharp_decline", "recovering", "declining", "stable", "sharp_decline", "recovering"];

export async function seedDemoDataForSite(siteId: string, siteUrl: string) {
  const pages = DEMO_PAGES[siteUrl];
  if (!pages) return;

  for (let i = 0; i < pages.length; i++) {
    const pageData = pages[i];
    const decayType = DECAY_PATTERNS[i % DECAY_PATTERNS.length];

    // Create the page
    const page = await db.page.upsert({
      where: {
        siteId_url: { siteId, url: pageData.url },
      },
      update: {},
      create: {
        siteId,
        url: pageData.url,
        title: pageData.title,
      },
    });

    // Generate and insert snapshots
    const snapshots = generateSnapshots(i);
    for (const snap of snapshots) {
      await db.snapshot.upsert({
        where: {
          pageId_date: { pageId: page.id, date: snap.date },
        },
        update: {
          clicks: snap.clicks,
          impressions: snap.impressions,
          ctr: snap.ctr,
          position: snap.position,
        },
        create: {
          pageId: page.id,
          date: snap.date,
          clicks: snap.clicks,
          impressions: snap.impressions,
          ctr: snap.ctr,
          position: snap.position,
        },
      });
    }

    // Generate alerts for decaying pages
    const alerts = generateAlerts(decayType);
    for (const alert of alerts) {
      await db.alert.create({
        data: {
          pageId: page.id,
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
        },
      });
    }

    // Generate AI analysis
    const analysis = generateAnalysis(pageData.title, decayType);
    await db.analysis.create({
      data: {
        pageId: page.id,
        decayScore: analysis.decayScore,
        summary: analysis.summary,
        recommendations: analysis.recommendations,
      },
    });
  }

  // Update site's lastSyncedAt
  await db.site.update({
    where: { id: siteId },
    data: { lastSyncedAt: new Date() },
  });
}
