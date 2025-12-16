import { getAllCategories } from "@/lib/actions/products/product-action";
import React from "react";
import SearchBarClient from "./search-client";

const SearchBar = async () => {
  const categories = await getAllCategories();
  return <SearchBarClient categories={categories} />;
};

export default SearchBar;
