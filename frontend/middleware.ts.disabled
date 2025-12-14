import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const locales = ['en', 'ja', 'ko', 'zh-CN', 'zh-TW'];
const defaultLocale = 'ja';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
