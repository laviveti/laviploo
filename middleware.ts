import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from "@/lib/auth/config";

const publicRoutes = ["/login", "/login/verify"];
const authRoutes = ["/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth API routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken = request.cookies.get("better-auth.session_token");

  // If no session and trying to access protected route, redirect to login
  if (!sessionToken && !publicRoutes.includes(pathname)) {
    const loginUrl = new URL(AUTH_CONFIG.ROUTES.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If has session and trying to access auth pages, redirect to dashboard
  if (sessionToken && publicRoutes.includes(pathname)) {
    const dashboardUrl = new URL(AUTH_CONFIG.ROUTES.DASHBOARD, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};