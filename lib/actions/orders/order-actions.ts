"use server";

import { auth } from "@/auth";
import {
  convertToPlainObject,
  decimalToNumber,
  renderError,
} from "@/lib/utils";
import type { Order as OrderType, PaymentResult } from "@/types";
import { getCartItems } from "../cart/cart-actions";
import { getUserById } from "../users/user-actions";
import { insertOrderSchema, validateWithZodSchema } from "@/lib/validator";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { paypal } from "@/lib/paypal";
import { revalidatePath } from "next/cache";
import { ORDER_ITEMS_PER_PAGE } from "@/lib/constants";
import { Prisma } from "@prisma/client";

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
  paymentResult?: {
    orderId: string;
    paymentResult?: PaymentResult;
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

// Get user orders with pagination
export const getUserOrders = async ({
  limit = ORDER_ITEMS_PER_PAGE,
  page,
}: {
  limit?: number;
  page?: number;
}) => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");

  const data = await prisma.order.findMany({
    where: { userId: session.user?.id as string },
    orderBy: { createdAt: "desc" },
    skip: page && limit ? (page - 1) * limit : undefined,
    take: limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session.user?.id as string },
  });

  return { data, totalPages: Math.ceil(dataCount / limit) };
};

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

// Raw row returned by prisma.$queryRaw for monthly sales. Different DB adapters
// may return the alias with different casing, so accept both.
type SalesRow = {
  month: string;
  totalSales?: Prisma.Decimal | null;
  totalsales?: Prisma.Decimal | null;
};

// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{
      month: string;
      // some DB drivers/libraries return the alias lower-cased; accept both
      totalSales?: Prisma.Decimal;
      totalsales?: Prisma.Decimal;
    }>
  >`
    SELECT to_char("createdAt", 'MM/YY') as "month",
    sum("totalPrice") as "totalSales"
    FROM "orders"
    GROUP BY to_char("createdAt", 'MM/YY')
  `;

  const getRawTotal = (entry: SalesRow) => entry.totalSales ?? entry.totalsales;

  const salesData: SalesDataType = (salesDataRaw as SalesRow[]).map((entry) => {
    const rawValue = getRawTotal(entry);
    return {
      month: entry.month,
      totalSales: decimalToNumber(rawValue),
    };
  });

  // Get latest sales
  const latestOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
    take: 5,
  });
  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestOrders,
    salesData,
  };
}

// Get all orders
export const getAllOrders = async ({
  limit = ORDER_ITEMS_PER_PAGE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) => {
  const queryFilter: Prisma.OrderWhereInput =
    query && query.trim() !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: "desc" },
    skip: page && limit ? (page - 1) * limit : undefined,
    take: limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return { data, totalPages: Math.ceil(dataCount / limit) };
};

// Delete an order
export const deleteOrder = async (id: string) => {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Update COD order to paid
export const updateOrderToPaidCOD = async (orderId: string) => {
  try {
    await updateOrderToPaid(orderId);

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order marked as paid",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Update order to delivered
export const deliverOrder = async (orderId: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });
    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid yet");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });
    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order marked as delivered",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};
