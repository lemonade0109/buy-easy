import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin/,
];

export default auth((req) => {
  // Ensure a session_cartId cookie exists. Use the Web Crypto API when
  // available (Edge-friendly). Avoid importing the Node `crypto` module in
  // middleware to keep the Edge bundle small.
  const existingSessionCart = req.cookies.get("session_cartId")?.value;

  // Prepare a default next response we can attach cookies to if needed.
  const defaultRes = NextResponse.next();

  // If missing, generate an id and attach it to the default response.
  if (!existingSessionCart) {
    const id =
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).crypto?.randomUUID?.() ??
      Math.random().toString(36).slice(2, 10);
    defaultRes.cookies.set({
      name: "session_cartId",
      value: id,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  const isProtected = protectedRoutes.some((route) =>
    route.test(req.nextUrl.pathname)
  );
  const isLoggedIn = !!req.auth;

  if (isProtected && !isLoggedIn) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );

    // Create the redirect response and, if we generated a session_cartId,
    // attach the same cookie to the redirect response so the browser will
    // receive it even when redirected.
    const redirectRes = NextResponse.redirect(url);
    if (!existingSessionCart) {
      const id = defaultRes.cookies.get("session_cartId")?.value;
      if (id) {
        redirectRes.cookies.set({
          name: "session_cartId",
          value: id,
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      }
    }

    return redirectRes;
  }

  // If we didn't need to redirect, return the default response (may have the cookie).
  return defaultRes;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
