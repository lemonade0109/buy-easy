import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

export const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val))),
    "price must have two decimal places"
  );

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
