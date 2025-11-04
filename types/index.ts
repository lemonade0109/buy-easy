import { z } from "zod";
import {
  productSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
} from "../lib/validator";

export type Product = Omit<
  z.infer<typeof productSchema>,
  "price" | "rating" | "stockCount"
> & {
  id: string;
  price: string;
  rating: string;
  stockCount: number;
  createdAt: Date;
};

export type CartItem = z.infer<typeof cartItemSchema>;

export type Cart = z.infer<typeof insertCartSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
