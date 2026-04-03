import OpenAI from "openai";
import type { DecayResult } from "@/lib/decay-engine";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDecayAnalysis(
  pageUrl: string,
  decayResult: DecayResult
): Promise<{ summary: string; recommendations: string[] }> {
  const prompt = `You are a content strategist and SEO expert. Analyze the following page performance data and provide actionable recommendations to reverse the decline.

Page URL: ${pageUrl}

Performance Data:
- Decay Score: ${decayResult.decayScore}/100 (${decayResult.severity} severity)
- Clicks: ${decayResult.previousClicks}/day (previous) to ${decayResult.recentClicks}/day (recent) = ${decayResult.clicksChange}% change
- Impressions: ${decayResult.previousImpressions}/day (previous) to ${decayResult.recentImpressions}/day (recent) = ${decayResult.impressionsChange}% change
- Average Position: ${decayResult.previousPosition} (previous) to ${decayResult.recentPosition} (recent) = ${decayResult.positionChange > 0 ? "+" : ""}${decayResult.positionChange} change
- CTR Change: ${decayResult.ctrChange > 0 ? "+" : ""}${decayResult.ctrChange}%

Respond in this exact JSON format:
{
  "summary": "A 2-3 sentence plain-English explanation of what is happening to this page and the likely cause.",
  "recommendations": [
    "Specific, actionable recommendation 1",
    "Specific, actionable recommendation 2",
    "Specific, actionable recommendation 3",
    "Specific, actionable recommendation 4",
    "Specific, actionable recommendation 5"
  ]
}

Focus your recommendations on:
1. Content freshness (outdated stats, old dates, stale examples)
2. Search intent alignment (has the intent shifted?)
3. Structural improvements (headings, FAQ sections, featured snippet targeting)
4. Competitive displacement (newer, better content from competitors)
5. Technical factors (page speed, mobile experience, broken elements)

Be specific to the URL and data. Do not give generic advice. Do not use em dashes in your response.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");

  const parsed = JSON.parse(content);
  return {
    summary: parsed.summary,
    recommendations: parsed.recommendations,
  };
}

export async function generateBulkInsights(
  siteUrl: string,
  decayResults: DecayResult[]
): Promise<string> {
  const topDecaying = decayResults.slice(0, 10);

  const prompt = `You are a content strategist. Analyze the overall content health of this website based on the decaying pages data below. Provide a brief executive summary (3-4 sentences) and identify patterns.

Site: ${siteUrl}

Decaying Pages (sorted by severity):
${topDecaying.map((r, i) => `${i + 1}. ${r.url}
   Decay Score: ${r.decayScore}/100 | Clicks: ${r.clicksChange}% | Impressions: ${r.impressionsChange}% | Position: ${r.positionChange > 0 ? "+" : ""}${r.positionChange}`).join("\n")}

Total pages with decay signals: ${decayResults.length}
Critical: ${decayResults.filter(r => r.severity === "critical").length}
High: ${decayResults.filter(r => r.severity === "high").length}
Medium: ${decayResults.filter(r => r.severity === "medium").length}

Provide your analysis as plain text. Be specific about patterns you see. Do not use em dashes.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 500,
  });

  return response.choices[0].message.content || "Unable to generate insights.";
}
