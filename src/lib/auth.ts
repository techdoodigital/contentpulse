import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/plans";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/webmasters.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // After sign-in, redirect to dashboard instead of homepage
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`;
      }
      // Allow callback URLs that start with the base URL
      if (url.startsWith(baseUrl)) return url;
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account }) {
      if (!user.email || !account) {
        console.error("[AUTH] signIn rejected: missing email or account");
        return false;
      }

      try {
        // Upsert user and store Google tokens
        const dbUser = await db.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token ?? undefined,
            googleTokenExpiry: account.expires_at
              ? new Date(account.expires_at * 1000)
              : undefined,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            googleTokenExpiry: account.expires_at
              ? new Date(account.expires_at * 1000)
              : undefined,
          },
        });

        // Create subscription if it doesn't exist
        const existingSub = await db.subscription.findUnique({
          where: { userId: dbUser.id },
        });
        if (!existingSub) {
          const freePlan = PLANS.free;
          await db.subscription.create({
            data: {
              userId: dbUser.id,
              plan: "free",
              sitesLimit: freePlan.limits.sites,
              pagesLimit: freePlan.limits.pages,
              analysesLimit: freePlan.limits.analyses,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("[AUTH] signIn error:", error);
        return false;
      }
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await db.user.findUnique({
          where: { email: session.user.email },
          include: { subscription: true },
        });
        if (dbUser) {
          (session.user as unknown as Record<string, unknown>).id = dbUser.id;
          (session.user as unknown as Record<string, unknown>).plan =
            dbUser.subscription?.plan || "free";
          (session.user as unknown as Record<string, unknown>).role =
            dbUser.role || "user";
        }
      }
      return session;
    },
  },
});
