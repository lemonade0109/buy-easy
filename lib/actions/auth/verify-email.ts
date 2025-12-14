"use server";

import { prisma } from "@/db/prisma";

export async function verifyEmailToken(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return {
      success: false,
      title: "Invalid or Expired link",
      message:
        "The verification link is invalid. You may need to request a new one.",
    };
  }

  if (record.expiresAt < new Date()) {
    return {
      success: false,
      title: "Expired Verification Link",
      message: "The verification link has expired. Please request a new one.",
    };
  }

  // Mark the user's email as verified
  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  });

  // Delete the used token
  await prisma.emailVerificationToken.deleteMany({
    where: { token },
  });

  return {
    success: true,
    title: "Email Verified Successfully",
    message: "Your email has been verified successfully. You can now sign in.",
  };
}
