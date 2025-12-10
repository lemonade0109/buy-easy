"use server";

import { prisma } from "@/db/prisma";

export const createEmailVerificationToken = async (userId: string) => {
  //Cleanup existing tokens for the user
  await prisma.emailVerificationToken.deleteMany({
    where: { userId },
  });

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};
