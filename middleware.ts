import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin/,
];

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Set cart ID cookie if not exists (simplified for Edge)
  if (!req.cookies.has("session_cartId")) {
    res.cookies.set(
      "session_cartId",
      Math.random().toString(36).substring(2, 15),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 2592000, // 30 days
      }
    );
  }

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) =>
    route.test(req.nextUrl.pathname)
  );

  if (isProtected) {
    const hasSession =
      req.cookies.has("authjs.session-token") ||
      req.cookies.has("__Secure-authjs.session-token");

    if (!hasSession) {
      const url = new URL("/sign-in", req.url);
      url.searchParams.set(
        "callbackUrl",
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
