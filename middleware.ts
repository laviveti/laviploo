import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AUTH_CONFIG } from "@/lib/auth/config";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/api/webhooks(.*)",
]);

const isProtectedRoute = createRouteMatcher([
  "/((?!sign-in|api).*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const isPublic = isPublicRoute(req);
  const isProtected = isProtectedRoute(req);

  // Allow access to public routes regardless of auth status
  if (isPublic) {
    return NextResponse.next();
  }

  // Protect all other routes (dashboard layout routes)
  if (!userId && isProtected) {
    const signInUrl = new URL(AUTH_CONFIG.ROUTES.SIGN_IN, req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users from sign-in to dashboard
  if (userId && req.nextUrl.pathname.startsWith(AUTH_CONFIG.ROUTES.SIGN_IN)) {
    const dashboardUrl = new URL(AUTH_CONFIG.ROUTES.DASHBOARD, req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
