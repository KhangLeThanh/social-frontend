// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("token");

  const { pathname } = req.nextUrl;

  if (!isLoggedIn && !pathname.startsWith("/auth")) {
    // Not logged in and trying to access protected route
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isLoggedIn && (pathname === "/" || pathname.startsWith("/auth"))) {
    // Logged in but accessing login or root
    return NextResponse.redirect(new URL("/content/dashboard", req.url));
  }

  // Continue
  return NextResponse.next();
}

// Optional: Specify which paths to include
export const config = {
  matcher: ["/", "/auth/:path*", "/content/:path*"],
};
