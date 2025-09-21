import { z } from "zod";
import { productSchema } from "../lib/validator";

export type Product = z.infer<typeof productSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};
