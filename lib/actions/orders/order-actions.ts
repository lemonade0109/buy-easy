"use server";

import { auth } from "@/auth";
import { convertToPlainObject, renderError } from "@/lib/utils";
import type { Order as OrderType } from "@/types";
import { getCartItems } from "../cart/cart-actions";
import { getUserById } from "../users/user-actions";
import { insertOrderSchema, validateWithZodSchema } from "@/lib/validator";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Create order and create the order items
export const createOrder = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");

    const cart = await getCartItems();
    const userId = session.user?.id as string;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "User address not found",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Payment method not found",
        redirectTo: "/payment-method",
      };
    }

    // Here you would typically create the order in your database
    const order = validateWithZodSchema(insertOrderSchema, {
      userId: userId,
      itemsPrice: cart.itemsPrice,
      shippingAddress: user.address,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      paymentMethod: user.paymentMethod,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to create order and order items in DB
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create Order
      const insertOrder = await tx.order.create({ data: order });

      // Create Order Items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: insertOrder.id,
            price: item.price,
          },
        });
      }

      // Clear the cart after order is created
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      });

      return insertOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      ...renderError(error),
    };
  }
};

// Get order by id
export const getOrderById = async (orderId: string) => {
  try {
    const data = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderitems: true,
        user: { select: { email: true, name: true } },
      },
    });

    if (!data) throw new Error("Order not found");

    // convert to plain object (this will turn Decimal values into strings at runtime)
    type PlainOrder = Record<string, unknown> & {
      itemsPrice?: unknown;
      shippingPrice?: unknown;
      taxPrice?: unknown;
      totalPrice?: unknown;
      orderitems?: Array<Record<string, unknown>>;
    };

    const plain = convertToPlainObject(data) as PlainOrder;

    // Map monetary Decimal fields to strings to satisfy the UI types
    const mapped: OrderType = {
      ...(plain as unknown as OrderType),
      itemsPrice: String(plain.itemsPrice ?? "0"),
      shippingPrice: String(plain.shippingPrice ?? "0"),
      taxPrice: String(plain.taxPrice ?? "0"),
      totalPrice: String(plain.totalPrice ?? "0"),
      orderitems: (plain.orderitems ?? []).map((it) => {
        return {
          ...(it as unknown as Record<string, unknown>),
          price: String((it as Record<string, unknown>)["price"] ?? "0"),
        } as unknown as OrderType["orderitems"][number];
      }),
    };

    return mapped;
  } catch (error) {
    return {
      success: false,
      ...renderError(error),
    };
  }
};
