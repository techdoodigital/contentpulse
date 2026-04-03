import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search } },
            { name: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          subscription: true,
          _count: {
            select: {
              sites: true,
            },
          },
        },
        orderBy: { createdAt: "desc" as const },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    // Get alert counts per user via their sites
    const usersWithAlerts = await Promise.all(
      users.map(async (user) => {
        const alertCount = await db.alert.count({
          where: {
            page: {
              site: {
                userId: user.id,
              },
            },
          },
        });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          plan: user.subscription?.plan || "free",
          sitesCount: user._count.sites,
          alertCount,
          createdAt: user.createdAt,
        };
      })
    );

    return NextResponse.json({
      users: usersWithAlerts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    await db.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
