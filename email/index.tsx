import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import type { Order } from "@/types";
import "dotenv/config";
import React from "react";
import PurchaseReceiptEmail from "./purchase-receipt";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export const sendPurchaseReceiptEmail = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Purchase Receipt - Order #${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};
