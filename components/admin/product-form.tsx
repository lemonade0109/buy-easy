"use client";
import { productDefaultValues } from "@/lib/constants";
import { productSchema, updateProductSchema } from "@/lib/validator";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const ProductForm = ({
  type,
  product,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  // const router = useRouter();

  const form = useForm({
    resolver: zodResolver(
      type === "Update" ? updateProductSchema : productSchema
    ),
    defaultValues:
      product && type === "Update"
        ? product
        : {
            ...productDefaultValues,
            numReviews: Number(productDefaultValues.numReviews),
          },
  });

  return (
    <Form {...form}>
      <form className="space-y-8" method="POST">
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Name  */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=" flex items-center ">
            <Button
              type="button"
              size="sm"
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-2xl  mt-4"
              onClick={() => {
                form.setValue(
                  "slug",
                  slugify(form.getValues("name"), { lower: true })
                );
              }}
            >
              Generate
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockCount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter stock count"
                    {...field}
                    value={field.value?.toString() || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row upload-field">
          {/* Images */}
        </div>
        <div className="upload-field">{/* isFeatured */}</div>
        <div className="upload-field">
          {/* Description*/}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Enter product description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          {/* Submit*/}

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
