"use server";

import { prisma } from "@/db/prisma";
import { renderError } from "@/lib/utils";
import { resetPasswordSchema, validateWithZodSchema } from "@/lib/validator";
import { hashSync } from "bcrypt-ts-edge";
import z from "zod";

export const resetPassword = async (prevState: unknown, formData: FormData) => {
  try {
    const raw = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(resetPasswordSchema, raw);

    // Check if the token is valid
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: {
        token: validatedData.token,
      },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return {
        success: false,
        message: "Invalid or expired reset token",
      };
    }

    // Update the user's password
    const hashedPassword = await hashSync(validatedData.password, 10);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword },
      });
    });

    // delete all reset tokens for the user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: tokenRecord.userId },
    });

    return {
      success: true,
      message: "Password has been reset successfully, you can now sign in.",
    };
  } catch (error) {
    console.error("[resetPassword]", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: renderError(error),
      };
    }
    return {
      success: false,
      message: renderError(error),
    };
  }
};
