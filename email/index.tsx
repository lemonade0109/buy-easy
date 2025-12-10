import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { APP_NAME } from "@/lib/constants";
import type { Order } from "@/types";
import "dotenv/config";
import React from "react";
import PurchaseReceiptEmail from "./purchase-receipt";

// Create Nodemailer transporter with Brevo SMTP
const transporter = nodemailer.createTransport({
  //TODO: Use environment variables
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendPurchaseReceiptEmail = async ({ order }: { order: Order }) => {
  try {
    // Render the React Email component to HTML
    const emailHtml = await render(<PurchaseReceiptEmail order={order} />);

    const senderEmail =
      process.env.SENDER_EMAIL || "noreply@jubriloyebamiji.com";
    const senderName = process.env.SENDER_NAME || APP_NAME;

    // Send email using Nodemailer
    const info = await transporter.sendMail({
      from: `${senderName} <${senderEmail}>`,
      to: order.user.email,
      subject: `Purchase Receipt - Order #${order.id}`,
      html: emailHtml,
    });

    return { id: info.messageId, success: true };
  } catch (error) {
    console.error("Error sending purchase receipt email:", error);
    throw error;
  }
};
