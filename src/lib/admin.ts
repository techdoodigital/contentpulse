import { auth } from "./auth";
import { db } from "./db";
import { getDevUser, isDevMode } from "./dev-user";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  let user = null;

  if (isDevMode()) {
    const devUser = await getDevUser();
    if (devUser) {
      user = await db.user.findUnique({ where: { id: devUser.id } });
    }
  } else {
    const session = await auth();
    if (!session?.user?.email) {
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        user: null,
      };
    }
    user = await db.user.findUnique({
      where: { email: session.user.email },
    });
  }

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  if (user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
    };
  }

  return { error: null, user };
}
