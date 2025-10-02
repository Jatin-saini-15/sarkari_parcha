import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes that don't need processing
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname === '/api/cron/expire-subscriptions'
  ) {
    return NextResponse.next();
  }

  // Trigger premium expiry check on subscription-related routes
  if (
    pathname.includes('/subscription') ||
    pathname.includes('/admin/database') ||
    pathname.includes('/admin/dashboard') ||
    pathname.includes('/profile')
  ) {
    try {
      // Call the expiry check API silently in the background
      const expireUrl = new URL('/api/cron/expire-subscriptions', request.url);
      
      // Make the request without awaiting to avoid blocking the main request
      fetch(expireUrl.toString()).catch(error => {
        console.error('Background premium expiry check failed:', error);
      });
      
    } catch (error) {
      console.error('Error in premium expiry middleware:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 