"use server";

import { prisma } from "@/db/prisma";
import { renderError } from "@/lib/utils";
import { forgotPasswordSchema, validateWithZodSchema } from "@/lib/validator";
import { createPasswordResetToken } from "./create-password-reset-token";
import { sendPasswordResetEmail } from "@/lib/email-verification/send-password-reset-email";

export const requestPasswordReset = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(forgotPasswordSchema, rawData);

    const lookupEmail = validatedData.email.toLowerCase().trim();

    // check if email exists in the database
    const user = await prisma.user.findFirst({
      where: { email: { equals: lookupEmail, mode: "insensitive" } },
    });

    if (!user) {
      // For security, do not reveal that the email does not exist
      return {
        success: false,
        message:
          "If an account exists with that email, a reset link has been sent.",
      };
    }
    const firstName = user.name.split(" ")[0];

    const token = await createPasswordResetToken(user.id);

    await sendPasswordResetEmail(lookupEmail, token, firstName);
    return {
      success: true,
      message:
        "If an account exists with that email, a reset link has been sent.",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};
