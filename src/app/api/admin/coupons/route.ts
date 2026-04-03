import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const coupons = await db.couponCode.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Admin coupons fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { code, discount, maxUses, expiresAt } = await request.json();

    if (!code || !discount) {
      return NextResponse.json(
        { error: "Code and discount are required" },
        { status: 400 }
      );
    }

    if (discount < 1 || discount > 100) {
      return NextResponse.json(
        { error: "Discount must be between 1 and 100" },
        { status: 400 }
      );
    }

    const coupon = await db.couponCode.create({
      data: {
        code: code.toUpperCase(),
        discount,
        maxUses: maxUses || 0,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error("Admin coupon create error:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id, active, code, discount, maxUses, expiresAt } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Coupon id is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (typeof active === "boolean") updateData.active = active;
    if (code) updateData.code = code.toUpperCase();
    if (discount !== undefined) updateData.discount = discount;
    if (maxUses !== undefined) updateData.maxUses = maxUses;
    if (expiresAt !== undefined)
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const coupon = await db.couponCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Admin coupon update error:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Coupon id is required" },
        { status: 400 }
      );
    }

    await db.couponCode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin coupon delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
