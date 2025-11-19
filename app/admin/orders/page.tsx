import React from "react";
import { Metadata } from "next";
import { deleteOrder, getAllOrders } from "@/lib/actions/orders/order-actions";
import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";

export const metadata: Metadata = {
  title: "Admin Orders",
  description: "Manage all orders in the admin panel",
};

export default async function AdminOrderPage(props: {
  searchParams: Promise<{ page?: string; query: string }>;
}) {
  const { page = "1", query: searchText } = await props.searchParams;
  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl">Orders</h1>
          {searchText && (
            <div className=" space-x-2 flex items-center">
              Filtered by <i>&quot;{searchText}&quot;</i>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  Clear Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>BUYER</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).formattedDateTime}
                </TableCell>
                <TableCell>{order.user?.name}</TableCell>

                <TableCell>
                  {formatCurrency(String(order.totalPrice))}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).formattedDateTime
                    : "Not Paid"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).formattedDateTime
                    : "Not Delivered"}
                </TableCell>
                <TableCell className="flex">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
        )}
      </div>
    </>
  );
}
