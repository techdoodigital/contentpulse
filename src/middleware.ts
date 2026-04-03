import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/pricing",
  "/privacy",
  "/terms",
  "/help",
  "/what-is-content-decay",
  "/how-it-works",
  "/api/auth",
  "/api/newsletter",
  "/api/stripe/webhook",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and static assets
  if (
    isPublicPath(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Dev mode bypass
  if (process.env.DEV_MODE === "true") {
    return NextResponse.next();
  }

  // Check for NextAuth session cookie (works without importing Prisma)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
