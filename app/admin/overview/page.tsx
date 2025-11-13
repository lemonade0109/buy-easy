import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getOrderSummary } from "@/lib/actions/orders/order-actions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminOverviewPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("User is not authorized ");
  }

  const summary = await getOrderSummary();
  console.log(summary);

  return <div>AdminOverviewPage</div>;
}
