/**
 * FixMyDorm - Next.js Proxy (Route Protection)
 *
 * Handles route protection and role-based redirects.
 * Uses the new "proxy" file convention (replaces deprecated "middleware").
 *
 * Strategy: We check for Amplify auth cookies to determine auth state.
 * Amplify stores tokens in cookies when SSR mode is enabled.
 *
 * Routes:
 *   /auth/*          → Public (login, signup, verify)
 *   /dashboard/*     → Protected (students)
 *   /management/*    → Protected (management only)
 *   /                → Public (landing page)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Routes that don't require authentication */
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup", "/auth/verify"];

/** Check if a route is public */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith("/auth/")
  );
}

/**
 * Check for Amplify auth cookies.
 * Amplify v6 stores tokens in cookies with specific naming patterns
 * when SSR mode is enabled.
 */
function hasAuthCookies(request: NextRequest): boolean {
  const cookies = request.cookies;

  // Amplify v6 stores auth tokens in cookies with patterns like:
  // CognitoIdentityServiceProvider.<clientId>.<username>.idToken
  // or the newer format with lastAuthUser
  for (const [name] of cookies) {
    if (
      name.includes("CognitoIdentityServiceProvider") &&
      (name.includes("idToken") || name.includes("LastAuthUser"))
    ) {
      return true;
    }
  }

  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasAuthCookies(request);

  // Allow public routes
  if (isPublicRoute(pathname)) {
    // If authenticated user visits auth pages, redirect to dashboard
    if (isAuthenticated && pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes: redirect to login if not authenticated
  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (svg, png, jpg, etc.)
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
