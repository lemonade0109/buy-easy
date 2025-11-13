import { z } from "zod";

import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

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

//Cart item schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  name: z.string().min(3).max(100),
  price: currency,
  image: z.string().min(1, "Image URL is required"),
  slug: z.string().min(3).max(100),
});

export const insertCartSchema = z.object({
  sessionCartId: z.string().min(1, "Session cart ID is required"),
  items: z.array(cartItemSchema).min(1, "Cart must have at least one item"),
  itemsPrice: currency,
  taxPrice: currency,
  shippingPrice: currency,
  totalPrice: currency,
  userId: z.string().optional().nullable(),
});

// Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(2, "Postal code must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

// Schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(2, "Payment method type is required"),
  })
  .refine((data) => {
    return (
      PAYMENT_METHODS.includes(data.type),
      {
        path: ["type"],
        message: "Invalid payment method type",
      }
    );
  });

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  totalPrice: currency,
  shippingAddress: shippingAddressSchema,
});

// Schema for inserting order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  image: z.string(),
  slug: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: currency,
});

// Schema for payment result from PayPal
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  pricePaid: z.string(),
  email_address: z.string(),
});

// Schema for updating the user profile
export const updateUserProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
});
