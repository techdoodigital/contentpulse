export interface PlanConfig {
  name: string;
  slug: "free" | "starter" | "pro";
  price: number;
  stripePriceId: string | null;
  limits: {
    sites: number;
    pages: number;
    analyses: number;
    syncFrequency: string;
    historyDays: number;
  };
  features: string[];
}

export const PLANS: Record<string, PlanConfig> = {
  free: {
    name: "Free",
    slug: "free",
    price: 0,
    stripePriceId: null,
    limits: {
      sites: 1,
      pages: 50,
      analyses: 5,
      syncFrequency: "weekly",
      historyDays: 30,
    },
    features: [
      "1 site",
      "50 pages tracked",
      "Weekly sync frequency",
      "30-day history",
      "5 AI analyses per month",
      "Basic decay detection",
    ],
  },
  starter: {
    name: "Starter",
    slug: "starter",
    price: 19,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || null,
    limits: {
      sites: 3,
      pages: 500,
      analyses: 50,
      syncFrequency: "daily",
      historyDays: 90,
    },
    features: [
      "3 sites",
      "500 pages tracked",
      "Daily sync frequency",
      "90-day history",
      "50 AI analyses per month",
      "Email alerts",
      "Priority decay scoring",
      "Exportable reports",
    ],
  },
  pro: {
    name: "Pro",
    slug: "pro",
    price: 39,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || null,
    limits: {
      sites: 10,
      pages: 2000,
      analyses: -1, // unlimited
      syncFrequency: "daily",
      historyDays: 365,
    },
    features: [
      "10 sites",
      "2,000 pages tracked",
      "Daily sync frequency",
      "12-month history",
      "Unlimited AI analyses",
      "Email alerts",
      "Priority decay scoring",
      "Exportable reports",
      "Bulk refresh recommendations",
      "API access",
      "Priority support",
    ],
  },
};

export function getPlanBySlug(slug: string): PlanConfig {
  return PLANS[slug] || PLANS.free;
}

export function getPlanByPriceId(priceId: string): PlanConfig | undefined {
  return Object.values(PLANS).find((p) => p.stripePriceId === priceId);
}
