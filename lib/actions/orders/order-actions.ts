"use server";

import { auth } from "@/auth";
import { convertToPlainObject, renderError } from "@/lib/utils";
import type { Order as OrderType, PaymentResult } from "@/types";
import { getCartItems } from "../cart/cart-actions";
import { getUserById } from "../users/user-actions";
import { insertOrderSchema, validateWithZodSchema } from "@/lib/validator";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { paypal } from "@/lib/paypal";
import { revalidatePath } from "next/cache";

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
      message: renderError(error),
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
      message: renderError(error),
    };
  }
};

// Create new paypal order
export const createPayPalOrder = async (orderId: string) => {
  try {
    // Get order from DB
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      // Create PayPal order here using order details
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // Update order with PayPal order ID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            status: paypalOrder.status,
            email_address: "",
            pricePaid: order.totalPrice,
          },
        },
      });

      return {
        success: true,
        message: "Item order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return {
      success: false,
      message: renderError(error) as unknown as string,
    };
  }
};

// Approve paypal order and update order to paid
export const approvePayPalOrder = async (
  orderId: string,
  data: { orderID: string }
) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not found");

    // Capture PayPal payment
    const captureResult = await paypal.capturePayment(data.orderID);

    if (
      !captureResult ||
      captureResult.status !== "COMPLETED" ||
      captureResult.id !== (order.paymentResult as PaymentResult)?.id
    ) {
      throw new Error("Error in paypal payment");
    }
    // Update order to paid in DB
    // todo
    await updateOrderToPaid(orderId, {
      orderId: data.orderID,
      paymentResult: {
        id: captureResult.id,
        status: captureResult.status,
        pricePaid:
          captureResult.purchase_units[0].payments.captures[0].amount.value,
        email_address: (captureResult.payer as { email_address: string })
          .email_address,
      },
    });
    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Your order has been paid ",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error) as unknown as string,
    };
  }
};

// update order to paid
const updateOrderToPaid = async (
  orderId: string,
  paymentResult: {
    orderId: string;
    paymentResult: PaymentResult;
  }
) => {
  // Get order from DB
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderitems: true },
  });
  if (!order) throw new Error("Order not found");

  if (order.isPaid) {
    throw new Error("Order is already paid");
  }

  // Transaction to update order & account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockCount: { increment: -item.quantity },
        },
      });
    }

    // Update order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");
};
