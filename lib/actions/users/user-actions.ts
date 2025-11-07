"use server";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  userSignInSchema,
  userSignUpSchema,
  validateWithZodSchema,
} from "@/lib/validator";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { renderError } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { ShippingAddress } from "@/types";
import z from "zod";

// Check if email exists
export const emailExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });

  return !!user;
};

// Action to sign in user with credentials
export const signInUserWithCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const rawData = Object.fromEntries(formData);
    const callbackUrl = (rawData.callbackUrl as string) || "/";
    const validatedData = validateWithZodSchema(userSignInSchema, rawData);

    await signIn("credentials", {
      ...validatedData,
      redirect: true,
      redirectTo: callbackUrl,
    });
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error && error.message
        ? error.message
        : "Incorrect username or password";

    return { success: false, ...renderError(message) };
  }
};

// Action to sign up user
export const signUpUser = async (prevState: unknown, formData: FormData) => {
  try {
    const rawData = Object.fromEntries(formData);
    const callbackUrl = (rawData.callbackUrl as string) || "/";
    const validatedData = validateWithZodSchema(userSignUpSchema, rawData);

    if (await emailExists(validatedData.email)) {
      return { success: false, message: "Email already in use" };
    }

    const plainPassword = validatedData.password;
    validatedData.password = hashSync(validatedData.password, 10);

    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: plainPassword,
      redirect: true,
      redirectTo: callbackUrl,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, message: "Email already in use" };
    }

    return { success: false, ...renderError(error) };
  }
};

// Action to sign out user
export const signOutUser = async () => {
  await signOut({ redirect: true, redirectTo: "/" });
};

// Get user by ID
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
};

// Update user address
export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const validatedAddress = validateWithZodSchema(shippingAddressSchema, data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address: validatedAddress },
    });

    return { success: true, message: "User address updated successfully" };
  } catch (error) {
    return {
      success: false,
      ...renderError(error),
    };
  }
};

// Update user payment method
export const updateUserPaymentMethod = async (
  data: z.infer<typeof paymentMethodSchema>
) => {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const validatedPaymentMethod = validateWithZodSchema(
      paymentMethodSchema,
      data
    );

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: validatedPaymentMethod.type },
    });

    return {
      success: true,
      message: "User payment method updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      ...renderError(error),
    };
  }
};
