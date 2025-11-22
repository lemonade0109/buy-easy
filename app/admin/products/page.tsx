import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteProduct,
  getAllProducts,
} from "@/lib/actions/products/product-action";
import { requireAdmin } from "@/lib/auth-guard";
import { formatCurrency, formatId } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) {
  await requireAdmin();
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  const products = await getAllProducts({
    page,
    query: searchText,
    category,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl">Products</h1>
          {searchText && (
            <div className=" space-x-2 flex items-center">
              Filtered by <i>&quot;{searchText}&quot;</i>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  Clear Filter
                </Button>
              </Link>
            </div>
          )}
        </div>

        <Button variant="default" asChild>
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id || "")}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {formatCurrency(product.price as unknown as string | number)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stockCount}</TableCell>
              <TableCell>
                {product.rating as unknown as number | string}
              </TableCell>
              <TableCell className="flex gap-1">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>

                <DeleteDialog id={product.id || ""} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products.totalPages > 1 && (
        <Pagination page={page} totalPages={products.totalPages} />
      )}
    </div>
  );
}
