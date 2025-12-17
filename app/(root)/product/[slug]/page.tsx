import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/actions/products/product-action";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getCartItems } from "@/lib/actions/cart/cart-actions";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";
import StockBadge from "@/components/shared/product/stock-badge";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth();
  const user = session?.user;

  const cart = await getCartItems();
  return (
    <>
      <section>
        <div className="mb-4 md:hidden">
          <Breadcrumbs name={product.name} category={product.category} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            {/* Images column */}
            <ProductImages images={product.image} />
          </div>

          {/* Details Column */}
          <div className="col-span-2 p-5 ">
            <div className="flex flex-col md:gap-6 gap-3">
              <div className="">
                <p className="text-sm mb-1 text-gray-500 dark:text-gray-300">
                  {product.brand} / {product.category}
                </p>
                <h1 className="h3-bold">{product.name}</h1>
              </div>
              <div className=" mt-4 md:mt-0 space-y-2 ">
                <Rating value={Number(product.rating) || 0} />
                <p>{product.numReviews} Reviews</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 
                  py-2
                  "
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="md:font-semibold font-bold text-lg md:text-base">
                Description
              </p>
              <p className="text-gray-700 dark:text-gray-300 max-w-prose text-sm mt-2 md:text-base">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Column */}
          <div className="">
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <span className="">Price</span>
                  <span className="">
                    <ProductPrice value={Number(product.price)} />
                  </span>
                </div>

                <div className="mb-2 flex justify-between">
                  <div className="">Status</div>
                  <StockBadge stockCount={product.stockCount ?? 0} />
                </div>

                {product.stockCount > 0 && product.stockCount <= 10 && (
                  <div className="mb-2 text-sm text-orange-600">
                    Only {product.stockCount} left in stock - order soon!
                  </div>
                )}

                {product.stockCount > 0 && product.id && (
                  <AddToCart
                    cart={cart}
                    item={{
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                      image: product.image![0],
                      slug: product.slug,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <span className="text-xl font-bold "> Customer Reviews</span>
        <ReviewList
          productId={product.id || ""}
          userId={user?.id || ""}
          productSlug={product.slug}
        />
      </section>
    </>
  );
}
