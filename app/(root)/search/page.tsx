import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/products/product-action";
import Link from "next/link";
import React from "react";
import SortSelect from "@/components/shared/sort-select";

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $100",
    value: "51-100",
  },
  {
    name: "$101 to $200",
    value: "101-200",
  },
  {
    name: "$201 to $500",
    value: "201-500",
  },
  { name: "$501 and above", value: "501-1000000" },
];

const ratings = [4, 3, 2, 1];

const sortOptions = [
  { value: "newest", name: "Newest Arrivals" },
  { value: "oldest", name: "Oldest Arrivals" },
  { value: "price-low-to-high", name: "Price: Low to High" },
  { value: "price-high-to-low", name: "Price: High to Low" },
  { value: "rating-high-to-low", name: "Rating: High to Low" },
  { value: "name-a-to-z", name: "Name: A to Z" },
  { value: "name-z-to-a", name: "Name: Z to A" },
];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? q : ``}
      ${isCategorySet ? `: Category ${category}` : ``}
      ${isPriceSet ? `: Price ${price}` : ``}
      ${isRatingSet ? `: Rating ${rating} & up` : ``}`.replace(/\s+/g, " "),
      description: `Find ${isQuerySet ? `"${q}"` : "products"} ${
        isCategorySet ? `in category "${category}"` : ``
      }
      ${isPriceSet ? `with price range "${price}"` : ``}
      ${isRatingSet ? `with rating ${rating} & up` : ``} on BuyEasy.`,
    };
  } else {
    return {
      title: "Search Products ",
      description:
        "Find the best products on BuyEasy with our advanced search and filtering options.",
    };
  }
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const normalizedParams = {
    query: q,
    category: category,
    price: price,
    rating: rating,
    sort: sort,
    page: Number(page) || 1,
  };

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const filter = {
      category: c || category,
      price: p || price,
      rating: r || rating,
      sort: s || sort,
      page: pg || page,
    };
    const queryString = Object.entries(filter)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `/search?${new URLSearchParams(queryString).toString()}`;
  };

  const products = await getAllProducts(normalizedParams);

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Category links */}
        <div className="text-xl mb-2 mt-3 font-bold">Department</div>

        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Any
              </Link>
            </li>

            {categories.map((cat) => (
              <li key={cat.category}>
                <Link
                  className={`${category === cat.category && "font-bold"}`}
                  href={getFilterUrl({ c: cat.category })}
                >
                  {cat.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Price links */}
        <div className="text-xl mb-2 mt-8 font-bold">Price</div>

        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (price === "all" || price === "") && "font-bold"
                }`}
                href={getFilterUrl({ p: "all" })}
              >
                Any
              </Link>
            </li>

            {prices.map((priceRange) => (
              <li key={priceRange.value}>
                <Link
                  className={`${price === priceRange.value && "font-bold"}`}
                  href={getFilterUrl({ p: priceRange.value })}
                >
                  {priceRange.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating links */}
        <div className="text-xl mb-2 mt-8 font-bold">Rating</div>

        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (rating === "all" || rating === "") && "font-bold"
                }`}
                href={getFilterUrl({ r: "all" })}
              >
                Any
              </Link>
            </li>

            {ratings.map((ratingValue) => (
              <li key={ratingValue}>
                <Link
                  className={`${
                    rating === ratingValue.toString() && "font-bold"
                  }`}
                  href={getFilterUrl({ r: ratingValue.toString() })}
                >
                  {`${ratingValue} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && " Query: " + q}
            {category !== "all" && category !== "" && " Category: " + category}
            {price !== "all" && price !== "" && " Price: " + price}
            {rating !== "all" && rating !== "" && " Rating: " + rating}
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            (price !== "all" && price !== "") ||
            (rating !== "all" && rating !== "") ? (
              <Button variant={"link"} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            {/* SORT */}
            <SortSelect sortOptions={sortOptions} currentSort={sort} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.data.length === 0 && <div>No products found.</div>}

          {products.data.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: product.price.toString(),
                rating: product.rating?.toString() || "0",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
