"use server";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  updateUserProfileSchema,
  updateUserSchema,
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
import { ORDER_ITEMS_PER_PAGE } from "@/lib/constants";
import { revalidatePath } from "next/cache";

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

    // Check if user exists first to avoid Auth.js throwing CredentialsSignin
    const lookupEmail = String(validatedData.email).trim();
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: lookupEmail, mode: "insensitive" } },
      select: { id: true },
    });

    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    // Use redirect: false so we can handle errors returned by signIn and

    const res = await signIn("credentials", {
      ...validatedData,
      redirect: true,
      callbackUrl,
    });

    // `signIn` may return an object with `error` or `url` depending on outcome.
    try {
      // eslint-disable-next-line no-console
      console.debug("[auth] signIn raw result type:", typeof res);
      // eslint-disable-next-line no-console
      console.debug("[auth] signIn raw result:", res);
    } catch (e) {}
    type SignInResult =
      | { error?: string; url?: string; ok?: boolean }
      | undefined
      | null;
    if (res && typeof res === "object") {
      const r = res as SignInResult;
      if (r && r.error) {
        return { success: false, message: String(r.error) };
      }
      if (r && r.url) {
        return {
          success: true,
          message: "Signed in successfully",
          data: r.url,
        };
      }
    }

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Incorrect username or password",
    };
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
      callbackUrl,
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

    return {
      success: false,
      message: renderError(error),
    };
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
      message: renderError(error),
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
      message: renderError(error) as unknown as string,
    };
  }
};

// Update the user profile
export const updateUserProfile = async (data: {
  name: string;
  email: string;
}) => {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");
    const validatedProfileData = validateWithZodSchema(
      updateUserProfileSchema,
      data
    );
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: validatedProfileData.name,
      },
    });

    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Get all users
export const getAllUsers = async ({
  limit = ORDER_ITEMS_PER_PAGE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) => {
  const queryFilter: Prisma.UserWhereInput =
    query && query.trim() !== "all"
      ? {
          name: { contains: query, mode: "insensitive" } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    take: limit,
    skip: page && limit ? (page - 1) * limit : 0,
    orderBy: { createdAt: "desc" },
  });

  const dataCount = await prisma.user.count();
  return { data, totalPages: Math.ceil(dataCount / limit) };
};

// Delete user
export const deleteUser = async (userId: string) => {
  try {
    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Update user
export const updateUser = async (user: z.infer<typeof updateUserSchema>) => {
  try {
    const validatedUserData = validateWithZodSchema(updateUserSchema, user);
    await prisma.user.update({
      where: { id: validatedUserData.id },
      data: {
        ...validatedUserData,
      },
    });
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};
