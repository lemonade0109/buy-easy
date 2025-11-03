import { z } from "zod";
import {
  productSchema,
  insertCartSchema,
  cartItemSchema,
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

export type CallBackProps = {
  session: import("next-auth").Session;
  token: import("next-auth/jwt").JWT;
  user?: import("next-auth").User;
  trigger?: "update" | "signIn" | "signUp";
};
