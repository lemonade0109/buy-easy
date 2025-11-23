"use client";
import { productDefaultValues } from "@/lib/constants";
import { productSchema, updateProductSchema } from "@/lib/validator";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
import {
  createProduct,
  updateProduct,
} from "@/lib/actions/products/product-action";
import toast from "react-hot-toast";
import { asStringMessage } from "@/lib/utils";
import z from "zod";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(
      type === "Update" ? updateProductSchema : productSchema
    ),
    defaultValues:
      product && type === "Update"
        ? product
        : {
            ...productDefaultValues,
            numReviews: product?.numReviews || 0,
          },
  });

  const onSubmit: SubmitHandler<z.infer<typeof productSchema>> = async (
    values
  ) => {
    // On Create
    if (type === "Create") {
      const res = await createProduct(values);
      if (!res.success) {
        toast.error(asStringMessage((res as { message?: unknown }).message));
      } else {
        toast.success(asStringMessage((res as { message?: unknown }).message));
      }
      router.push("/admin/products");
    }

    // On Update
    if (type === "Update") {
      if (!productId) {
        router.push("/admin/products");
      }

      const res = await updateProduct({ ...values, id: productId! });
      if (!res.success) {
        toast.error(asStringMessage((res as { message?: unknown }).message));
      } else {
        toast.success(asStringMessage((res as { message?: unknown }).message));
      }
      router.push("/admin/products");
    }
  };

  const images = form.watch("image");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
          {/* Image upload */}
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Image</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="Product Image"
                          width={100}
                          height={100}
                          className="rounded-sm w-20 h-20 object-cover object-center"
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue("image", [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(
                              `Failed to upload image: ${error.message}`
                            );
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          {/* isFeatured */}
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className=" flex space-x-2 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured</FormLabel>
                  </FormItem>
                )}
              />

              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="Banner Image"
                  className="w-full object-cover object-center rounded-sm"
                  width={1920}
                  height={680}
                />
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue("banner", res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Failed to upload image: ${error.message}`);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
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
