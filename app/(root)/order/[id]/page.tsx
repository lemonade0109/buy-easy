import React from "react";
import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/orders/order-actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
  description: "Details of your order",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const result = await getOrderById(id);

  // Narrow the union: handle error/result without shippingAddress first
  if (!result || "success" in result) {
    // either not found or an error object — show 404 or handle it
    notFound();
  }

  // TS now knows `result` is the order type
  const order = result;

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
      />
    </>
  );
}
