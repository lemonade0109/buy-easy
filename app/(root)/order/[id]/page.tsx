import React from "react";
import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/orders/order-actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Order Details",
  description: "Details of your order",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await props.params;

  const result = await getOrderById(id);
  let client_secret = null;

  if (!result || "success" in result) {
    notFound();
  }

  const order = result;
  // Check if is not paid and using stripe
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100), // amount in cents
      currency: "USD",
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={isAdmin(session?.user?.email)}
      />
    </>
  );
}
