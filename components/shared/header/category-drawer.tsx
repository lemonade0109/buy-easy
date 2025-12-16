import { getAllCategories } from "@/lib/actions/products/product-action";
import React from "react";
import CategoryDrawerClient from "./category-drawer-client";

const CategoryDrawer = async () => {
  const categories = await getAllCategories();
  return <CategoryDrawerClient categories={categories} />;
};

export default CategoryDrawer;
