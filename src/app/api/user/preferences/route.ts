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

// GET /api/user/preferences
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      emailAlerts: user.emailAlerts,
      alertThreshold: user.alertThreshold,
    });
  } catch (error) {
    console.error("Preferences error:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/preferences
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (typeof body.emailAlerts === "boolean") {
      updates.emailAlerts = body.emailAlerts;
    }
    if (
      body.alertThreshold &&
      ["low", "medium", "high", "critical"].includes(body.alertThreshold)
    ) {
      updates.alertThreshold = body.alertThreshold;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: updates,
    });

    return NextResponse.json({
      emailAlerts: updated.emailAlerts,
      alertThreshold: updated.alertThreshold,
    });
  } catch (error) {
    console.error("Preferences update error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
