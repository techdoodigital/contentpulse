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

// DELETE /api/user/delete - permanently delete user account and all data
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Require confirmation in the request body
    const body = await request.json();
    if (body.confirm !== "DELETE_MY_ACCOUNT") {
      return NextResponse.json(
        { error: "Confirmation required. Send { confirm: 'DELETE_MY_ACCOUNT' }." },
        { status: 400 }
      );
    }

    // Delete user - cascades to subscription, support tickets, sites (which cascade to pages, snapshots, alerts, analyses)
    await db.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ success: true, message: "Account deleted." });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
