import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith('/api/auth')) {
		return NextResponse.next();
	}

	if (pathname.startsWith('/admin')) {
		return NextResponse.next();
	}

	return intlMiddleware(req);
}

export const config = {
	matcher: [
		'/',
		'/(ru|en|zh)/:path*',
		'/(gallery|products|news|contacts)/:path*',
		'/admin/:path*',
		'/api/auth/:path*',
	],
};
