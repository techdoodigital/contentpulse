import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isDevMode, getDevUser } from "@/lib/dev-user";
import AdminShell from "@/components/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  if (isDevMode()) {
    const devUser = await getDevUser();
    if (devUser) {
      user = await db.user.findUnique({ where: { id: devUser.id } });
    }
  } else {
    const session = await auth();
    if (!session?.user?.email) {
      redirect("/api/auth/signin");
    }
    user = await db.user.findUnique({
      where: { email: session.user.email },
    });
  }

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminShell userName={user.name || "Admin"}>{children}</AdminShell>;
}
