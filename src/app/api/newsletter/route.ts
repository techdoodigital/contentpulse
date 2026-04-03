import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/newsletter - subscribe to newsletter
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ message: "You're already subscribed!" });
    }

    await db.newsletterSubscriber.create({
      data: { email: email.toLowerCase().trim() },
    });

    return NextResponse.json({ message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
