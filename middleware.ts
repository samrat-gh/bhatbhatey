import { NextRequest, NextResponse } from 'next/server';

// Middleware now validates the JWT by calling the internal /api/auth/me endpoint
// and forwards the resolved user id (if any) via an injected request header.
// This keeps token verification logic centralized in the API route.

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If visiting /login and already authenticated, redirect to /vehicles
  if (pathname === '/login') {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.next();
    try {
      const meUrl = new URL('/api/auth/me', req.url);
      const meRes = await fetch(meUrl, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (meRes.ok) {
        const data = await meRes.json().catch(() => null);
        if (data?.success) {
          return NextResponse.redirect(new URL('/vehicles', req.url));
        }
      }
    } catch (_) {
      // ignore errors, allow user to see login page
    }
    return NextResponse.next();
  }

  // Protected routes
  if (
    !pathname.startsWith('/vehicles') &&
    !pathname.startsWith('/profile') &&
    !pathname.startsWith('/orders')
  )
    return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const meUrl = new URL('/api/auth/me', req.url);
    const meRes = await fetch(meUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!meRes.ok) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    const data = await meRes.json().catch(() => null);
    if (!data?.success || !data?.user?.id) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', data.user.id);
    if (data.user.email) requestHeaders.set('x-user-email', data.user.email);
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (_) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/vehicles/:path*', '/profile', '/orders', '/login'],
};
