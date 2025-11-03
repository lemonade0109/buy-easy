import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight middleware: only ensures a session_cartId cookie exists.
// Avoids importing auth/prisma or other heavy server libs so this file stays small (<1MB).
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    const existing = req.cookies.get("session_cartId")?.value;
    if (!existing) {
      // Use crypto.randomUUID when available (Edge runtime); fall back to a short random id.
      const id =
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).crypto?.randomUUID?.() ??
        Math.random().toString(36).slice(2, 10);
      res.cookies.set({
        name: "session_cartId",
        value: id,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }
  } catch (e) {
    // Don't block requests on cookie setting errors; just continue.
    // Keeping this catch prevents runtime errors from bubbling into the response.
  }

  return res;
}

// Match most routes but exclude API, _next and static assets.
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
