"use client";
import { Cart } from "@/types";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { asStringMessage } from "@/lib/utils";
import Link from "next/link";
import { removeFromCart, addToCart } from "@/lib/actions/cart/cart-actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  return (
    <div>
      <h1 className="py-4 h2-bold ">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div className="">
          <p>Your cart is empty.</p>
          <Link href={"/"} className="text-gray-500 hover:underline">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3 ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center gap-2"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span>{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        disabled={isPending}
                        type="button"
                        onClick={() => {
                          startTransition(async () => {
                            const res = await removeFromCart(item.productId);

                            if (!res.success) {
                              toast.error(
                                asStringMessage(
                                  (res as { message?: unknown }).message
                                ) || "Error removing item from cart"
                              );
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>

                      <span className="mx-2">{item.quantity}</span>

                      <Button
                        variant="outline"
                        disabled={isPending}
                        type="button"
                        onClick={() => {
                          startTransition(async () => {
                            const res = await addToCart(item);

                            if (!res.success) {
                              toast.error(
                                asStringMessage(
                                  (res as { message?: unknown }).message
                                ) || "Error adding item to cart"
                              );
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card className="mt-64 md:mt-0">
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal (
                {cart.items.reduce((acc, item) => acc + item.quantity, 0)})
                <span className="font-bold">
                  {" "}
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>

              <Button
                className="w-full"
                disabled={isPending}
                onClick={() => {
                  startTransition(() => {
                    router.push("/shipping-address");
                  });
                }}
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartTable;
