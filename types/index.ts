import { z } from "zod";
import { productSchema } from "../lib/validator";

export type Product = z.infer<typeof productSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type CallBackProps = {
  session: import("next-auth").Session;
  token: import("next-auth/jwt").JWT;
  user?: import("next-auth").User;
  trigger?: "update" | "signIn" | "signUp";
};
