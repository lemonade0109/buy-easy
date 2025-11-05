"use server";

import { prisma } from "@/db/prisma";
import { cookies } from "next/headers";

/**
 * Moves the anonymous session cart (from session_cartId cookie)
 * to the authenticated user's account.
 *
 * - Runs in a transaction (no race conditions)
 * - Uses updateMany (won't throw if the row disappears)
 * - Clears the session_cartId cookie after a successful merge
 * - Swallows errors to avoid breaking the sign-in flow
 */
export async function mergeSessionCartToUser(userId: string) {
  try {
    const jar = await cookies();
    const sessionCartId = jar.get("session_cartId")?.value;
    if (!sessionCartId) return;

    await prisma.$transaction(async (tx) => {
      // find the anonymous cart by its session id
      const sc = await tx.cart.findFirst({
        where: { sessionCartId },
        select: { id: true },
      });
      if (!sc?.id) return; // nothing to merge

      // remove any pre-existing carts tied to this user (optional policy)
      await tx.cart.deleteMany({ where: { userId } });

      // reassign the anonymous cart to this user
      await tx.cart.updateMany({
        where: { id: sc.id },
        data: { userId },
      });
    });

    // clear the cookie so we don't try to re-merge next login
    (await cookies()).delete("session_cartId");
  } catch (err) {
    console.error("[cart merge failed]", err);
    // DO NOT rethrow – auth flow should continue
  }
}
