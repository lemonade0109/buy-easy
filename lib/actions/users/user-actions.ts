"use server";
import {
  emailExists,
  userSignInSchema,
  userSignUpSchema,
  validateWithZodSchema,
} from "@/lib/validator";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { renderError } from "@/lib/utils";
import { Prisma } from "@prisma/client";

// Action to sign in user with credentials
export async function signInUserWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    // Coerce FormData values to strings to avoid passing `null` into Zod
    // const userData = userSignInSchema.parse({
    //   email: String(formData.get("email") ?? ""),
    //   password: String(formData.get("password") ?? ""),
    // });
    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(userSignInSchema, rawData);

    await signIn("credentials", validatedData);
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    // Return structured error information so the client can render field errors
    return { success: false, message: "Incorrect username or password" };
  }
}

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

    // Return structured error information so the client can render field errors
    return { success: false, ...renderError(error) };
  }
}

// Action to sign out user
export async function signOutUser() {
  await signOut();
}
