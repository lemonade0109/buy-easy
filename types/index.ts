import { z } from "zod";
import {
  productSchema,
  insertCartSchema,
  cartItemSchema,
} from "../lib/validator";

export type Product = z.infer<typeof productSchema> & {
  id: string;
  rating: string;
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
