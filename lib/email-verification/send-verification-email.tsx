"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import VerificationEmail from "@/email/verification-email";

export const sendVerificationEmail = async (
  email: string,
  token: string,
  firstName: string
) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  console.log(`📧 Preparing to send verification email to ${email}`);

  try {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER;
    const senderName = process.env.SENDER_NAME || "BuyEasy";

    // Render the React email component to HTML
    const emailHtml = await render(
      <VerificationEmail
        verificationUrl={verificationUrl}
        userName={firstName}
      />
    );

    // Send the email
    console.log(`📤 Sending verification email to ${email}...`);

    const info = await transporter.sendMail({
      from: `${senderName} <${senderEmail}>`,
      to: email,
      subject: "Verify Your Email Address - BuyEasy",
      html: emailHtml,
    });

    console.log(`✅ Verification email sent successfully to ${email}`);
    console.log(`📨 Message ID: ${info.messageId}`);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${email}:`, error);
    throw error;
  }
};
