import { getAllCategories } from "@/lib/actions/products/product-action";
import React from "react";
import MobileSearch from "./mobile-search";

const MobileSearchWrapper = async () => {
  const categories = await getAllCategories();
  return <MobileSearch categories={categories} />;
};

export default MobileSearchWrapper;
