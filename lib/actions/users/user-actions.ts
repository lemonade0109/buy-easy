"use server";
import {
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

// Check if email exists
export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });

  return !!user;
}

// Action to sign in user with credentials
export async function signInUserWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(userSignInSchema, rawData);

    await signIn("credentials", validatedData);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    // Log the error server-side to aid debugging and return the message to the client
    // (keep generic for production; this is intentionally more verbose to help debug now)
    // eslint-disable-next-line no-console
    console.error("signInUserWithCredentials error:", error);

    const message =
      error instanceof Error && error.message
        ? error.message
        : "Incorrect username or password";

    return { success: false, message };
  }
}

// Action to sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
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
}

// Action to sign out user
export async function signOutUser() {
  await signOut();
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
}

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
