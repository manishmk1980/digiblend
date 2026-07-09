import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/app(.*)',
  '/account(.*)',
  '/settings(.*)',
  '/admin(.*)',
  '/api/billing(.*)',
  '/api/tools(.*)',
  '/api/customers(.*)',
  '/api/subscriptions(.*)',
  '/api/usage(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);

function isClerkConfigured() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  return Boolean(publishableKey && /^pk_(test|live)_/.test(publishableKey) && process.env.CLERK_SECRET_KEY);
}

export default clerkMiddleware(async (auth, request) => {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  if (isAdminRoute(request)) {
    const session = await auth();
    if (!session.userId) {
      return session.redirectToSignIn();
    }

    const metadata = session.sessionClaims?.metadata as { role?: string } | undefined;
    if (metadata?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }

  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|webp|ico|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
