import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl;

  // Paths that don't require authentication
  const publicPaths = ["/login", "/api/auth/login", "/favicon.ico"];

  // Allow public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    // Redirect authenticated users away from the login page
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Paths that require authentication
  if (!token) {
    // Store the intended destination to redirect back after login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static assets
  matcher: ["/((?!_next/static|_next/image|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
