import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/*
 * Vercel Services does not support Next.js Edge Middleware output.
 * The former middleware only forwarded requests and sent analytics to an
 * Umami hostname that exists inside the Docker Compose network, not on Vercel.
 * Keep the asset/API matcher, but let requests continue without that
 * environment-specific analytics side effect.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|vendor|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mjs|js|css|json|pbf|mvt|woff|woff2|ico|txt)$).*)',
  ],
};
