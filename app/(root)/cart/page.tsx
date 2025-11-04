import React from "react";
import CartTable from "./cart-table";
import { getCartItems } from "@/lib/actions/cart/cart-actions";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const cart = await getCartItems();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
}
