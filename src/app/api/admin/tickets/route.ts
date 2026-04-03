import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const where = status && status !== "all" ? { status } : {};

    const tickets = await db.supportTicket.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Admin tickets fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { ticketId, status, response } = await request.json();

    if (!ticketId) {
      return NextResponse.json(
        { error: "ticketId is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["open", "in-progress", "resolved"];
    const updateData: Record<string, unknown> = {};

    if (status && validStatuses.includes(status)) {
      updateData.status = status;
    }
    if (response !== undefined) {
      updateData.response = response;
    }

    const ticket = await db.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Admin ticket update error:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
