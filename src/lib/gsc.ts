import { google } from "googleapis";
import { db } from "@/lib/db";

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
  );
}

async function getAuthenticatedClient(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user?.googleAccessToken) {
    throw new Error("User has no Google credentials. Please reconnect your Google account.");
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  });

  // Handle token refresh
  oauth2Client.on("tokens", async (tokens) => {
    await db.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.access_token ?? undefined,
        googleRefreshToken: tokens.refresh_token ?? undefined,
        googleTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
      },
    });
  });

  return oauth2Client;
}

export async function listSites(userId: string) {
  const authClient = await getAuthenticatedClient(userId);
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

  const response = await searchconsole.sites.list();
  return (response.data.siteEntry || []).map((site) => ({
    siteUrl: site.siteUrl || "",
    permissionLevel: site.permissionLevel || "",
  }));
}

export interface GSCPageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function fetchPagePerformance(
  userId: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  rowLimit: number = 1000
): Promise<GSCPageData[]> {
  const authClient = await getAuthenticatedClient(userId);
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit,
      type: "web",
    },
  });

  return (response.data.rows || []).map((row) => ({
    page: row.keys?.[0] || "",
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
}

export async function fetchPagePerformanceByDate(
  userId: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  pageUrl: string
): Promise<{ date: string; clicks: number; impressions: number; ctr: number; position: number }[]> {
  const authClient = await getAuthenticatedClient(userId);
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["date"],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "page",
              operator: "equals",
              expression: pageUrl,
            },
          ],
        },
      ],
      type: "web",
    },
  });

  return (response.data.rows || []).map((row) => ({
    date: row.keys?.[0] || "",
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }));
}
