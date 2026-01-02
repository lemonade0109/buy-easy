import crypto from "crypto";
import { prisma } from "@/db/prisma";

export const createPasswordResetToken = async (userId: string) => {
  // Delete existing tokens for the user
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  // Generate a unique token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 3600 * 1000); // Token valid for 1 hour

  // Store the token in the database
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};
