import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { COOKIE_ADMIN } from "./dataEnv/dataEnv";

// Middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //check if user is authenticated extracting the token from the request
  const isAdmin = request.cookies.get(COOKIE_ADMIN)?.value;

  const isAuthenticatedAdmin = !!isAdmin;

  if (pathname.startsWith("/admin") && !isAuthenticatedAdmin) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
