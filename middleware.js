import { NextResponse } from 'next/server';

export function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Skip static assets, API routes, and internal Next.js routes
  if (
    pathname.startsWith('/_next') ||   // Internal Next.js files
    pathname.startsWith('/api') ||    // API routes
    pathname.startsWith('/public') || // Public assets folder (optional if assets are under /public)
    pathname.match(/\.(png|jpg|jpeg|gif|svg|css|js|json|woff|woff2|ttf|otf|ico|eot)$/) // Static assets
  ) {
    return NextResponse.next();
  }

  // Apply lowercase enforcement for other routes
  if (pathname !== pathname.toLowerCase()) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
