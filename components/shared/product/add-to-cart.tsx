"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { asStringMessage } from "@/lib/utils";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import CartToast from "@/components/ui/cart-toast";
import { removeFromCart, addToCart } from "@/lib/actions/cart/cart-actions";

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();

  const [isPending, startTransition] = React.useTransition();

  // Add to cart handler
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addToCart(item);
      if (!res.success) {
        toast.error(asStringMessage((res as { message?: unknown }).message));
      }

      // Handle success add to cart
      if (res.success) {
        toast.custom((t) => (
          <CartToast
            t={t}
            description={asStringMessage(
              (res as { message?: unknown }).message
            )}
            onViewCart={() => {
              router.push("/cart");
            }}
          />
        ));
      }
    });
  };

  // Clear cart handler
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeFromCart(item.productId);
      if (!res.success) {
        toast.error(asStringMessage((res as { message?: unknown }).message));
      }
      // Handle success remove from cart
      if (res.success) {
        toast.custom((t) => (
          <CartToast
            t={t}
            description={asStringMessage(
              (res as { message?: unknown }).message
            )}
            onViewCart={() => {
              router.push("/cart");
            }}
          />
        ));
      }
    });
  };

  // Check if item in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="flex items-center justify-center gap-2 ">
      <Button type="button" variant={"outline"} onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>

      <span className="px-2 mb-1 text-center">{existItem?.quantity}</span>

      <Button type="button" variant={"outline"} onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full mt-4 " type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}{" "}
      Add to Cart
    </Button>
  );
};

export default AddToCart;
