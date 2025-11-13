import Pagination from "@/components/shared/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserOrders } from "@/lib/actions/orders/order-actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Your Orders",
};

export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await props.searchParams;

  const orders = await getUserOrders({
    page: Number(page) || 1,
  });

  return (
    <>
      <div className="space-y-2">
        <h2 className="h2-bold">Orders</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
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
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                    <span className="px-2">Details</span>
                  </Link>
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
