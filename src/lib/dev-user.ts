import { db } from "@/lib/db";
import { PLANS } from "@/lib/plans";

const DEV_MODE = process.env.DEV_MODE === "true";
const DEV_EMAIL = "dev@doodigital.co";

export async function getDevUser() {
  if (!DEV_MODE) return null;

  let user = await db.user.findUnique({
    where: { email: DEV_EMAIL },
    include: { subscription: true },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        email: DEV_EMAIL,
        name: "Dev User",
        subscription: {
          create: {
            plan: "pro",
            sitesLimit: PLANS.pro.limits.sites,
            pagesLimit: PLANS.pro.limits.pages,
            analysesLimit: -1, // unlimited
          },
        },
      },
      include: { subscription: true },
    });
  }

  return user;
}

export function isDevMode() {
  return DEV_MODE;
}
