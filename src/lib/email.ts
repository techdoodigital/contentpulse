/**
 * Email notification service for CiteWatch.
 *
 * Currently uses a simple logging approach for development.
 * In production, swap the `sendEmail` implementation for your
 * preferred provider (Resend, SendGrid, AWS SES, etc.).
 *
 * To enable real emails:
 * 1. Install a provider: npm install resend
 * 2. Set EMAIL_FROM and RESEND_API_KEY in .env
 * 3. Replace the sendEmail function body
 */

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const { to, subject, html } = payload;

  // Check if email sending is configured
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "CiteWatch <alerts@citewatch.app>";

  if (!apiKey) {
    console.log("[Email] No RESEND_API_KEY set. Email would be sent to:", to);
    console.log("[Email] Subject:", subject);
    console.log("[Email] Body preview:", html.substring(0, 200));
    return true; // Return true in dev so the flow continues
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to, subject, html }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[Email] Send failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Send error:", error);
    return false;
  }
}

/**
 * Build and send a decay alert email for a user.
 */
export async function sendDecayAlertEmail(
  userEmail: string,
  userName: string | null,
  siteName: string,
  siteId: string,
  alerts: { severity: string; message: string; pageUrl: string }[]
) {
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const highCount = alerts.filter((a) => a.severity === "high").length;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://contentpulse.app";

  const subject = criticalCount > 0
    ? `[Critical] ${criticalCount} critical decay alert${criticalCount > 1 ? "s" : ""} on ${siteName}`
    : `${alerts.length} new decay alert${alerts.length > 1 ? "s" : ""} on ${siteName}`;

  const alertRows = alerts
    .slice(0, 10) // Max 10 alerts in email
    .map((a) => {
      const color =
        a.severity === "critical"
          ? "#ef4444"
          : a.severity === "high"
          ? "#f97316"
          : a.severity === "medium"
          ? "#eab308"
          : "#3b82f6";
      const path = a.pageUrl.replace(/^https?:\/\/[^/]+/, "");
      return `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b;">
            <span style="color: #e2e8f0; font-size: 13px;">${path}</span>
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b; text-align: center;">
            <span style="background: ${color}20; color: ${color}; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: capitalize;">${a.severity}</span>
          </td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #1e293b;">
            <span style="color: #94a3b8; font-size: 12px;">${a.message}</span>
          </td>
        </tr>`;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 700; color: #fff;">Cite<span style="color: #f97316;">Watch</span></span>
        </div>

        <!-- Main card -->
        <div style="background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 24px;">
          <h1 style="color: #f1f5f9; font-size: 18px; margin: 0 0 4px;">
            Decay Alerts for ${siteName}
          </h1>
          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 20px;">
            Hi ${userName || "there"}, we detected ${alerts.length} page${alerts.length > 1 ? "s" : ""} with declining performance.
            ${criticalCount > 0 ? `<span style="color: #ef4444; font-weight: 600;">${criticalCount} critical.</span>` : ""}
            ${highCount > 0 ? `<span style="color: #f97316; font-weight: 600;">${highCount} high priority.</span>` : ""}
          </p>

          <!-- Alert table -->
          <table style="width: 100%; border-collapse: collapse; background: #0f172a; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #1e293b;">
                <th style="padding: 8px 12px; text-align: left; color: #64748b; font-size: 11px; font-weight: 500;">Page</th>
                <th style="padding: 8px 12px; text-align: center; color: #64748b; font-size: 11px; font-weight: 500;">Severity</th>
                <th style="padding: 8px 12px; text-align: left; color: #64748b; font-size: 11px; font-weight: 500;">Issue</th>
              </tr>
            </thead>
            <tbody>
              ${alertRows}
            </tbody>
          </table>

          ${alerts.length > 10 ? `<p style="color: #64748b; font-size: 12px; margin: 12px 0 0;">And ${alerts.length - 10} more alerts...</p>` : ""}

          <!-- CTA -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="${appUrl}/site/${siteId}" style="display: inline-block; background: #ea580c; color: #fff; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none;">
              View Full Report
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #475569; font-size: 11px; margin: 0;">
            You're receiving this because you have email alerts enabled.
            <a href="${appUrl}/account" style="color: #f97316; text-decoration: none;">Manage preferences</a>
          </p>
          <p style="color: #334155; font-size: 11px; margin: 8px 0 0;">
            CiteWatch by DooDigital
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: userEmail, subject, html });
}
