import React from "react";
import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Create Product - Admin Panel",
};

export default async function CreateProductPage() {
  await requireAdmin();
  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  );
}
