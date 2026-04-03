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

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await db.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Support tickets fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, description, category, priority } = await request.json();

    if (!subject || subject.trim().length === 0) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }

    if (!description || description.trim().length < 20) {
      return NextResponse.json(
        { error: "Description must be at least 20 characters" },
        { status: 400 }
      );
    }

    const validCategories = ["bug", "feature", "billing", "account", "other"];
    const validPriorities = ["low", "medium", "high"];

    const ticket = await db.supportTicket.create({
      data: {
        userId: user.id,
        subject: subject.trim(),
        description: description.trim(),
        category: validCategories.includes(category) ? category : "other",
        priority: validPriorities.includes(priority) ? priority : "medium",
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error("Support ticket creation error:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
