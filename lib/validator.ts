import { z } from "zod";

import { formatNumberWithDecimal } from "./utils";
import { prisma } from "@/db/prisma";

export const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
    "price must have two decimal places"
  );

//Schema for inserting Products
export const productSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Maximum length is 100 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .max(100, "Maximum length is 100 characters"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  description: z.string().max(500).optional(),
  price: currency,
  image: z.array(z.string()).min(1, "Product must have at least one image"),
  stockCount: z.number().min(0).optional(),
  isFeatured: z.boolean().default(false),
  brand: z.string().min(2).max(100).optional(),
  rating: z.string().min(0).max(5).optional(),
  numReviews: z.number().min(0).optional(),
  banner: z.string().nullable().optional(),
});

// Schema for signin users in
export const userSignInSchema = z.object({
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Schema for signing up users
export const userSignUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z
      .string()
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export function validateWithZodSchema<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown
): z.infer<S> {
  const results = schema.safeParse(data);

  if (!results.success) {
    const errors = results.error.issues.map((issue) => issue.message);
    throw new Error(errors.join(", "));
  }

  return results.data as z.infer<S>;
}

//validate email existence
export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });

  return !!user;
}

//Cart item schema
