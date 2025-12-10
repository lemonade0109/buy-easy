import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getOrderSummary } from "@/lib/actions/orders/order-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, CreditCard } from "lucide-react";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Charts from "./charts";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminOverviewPage() {
  await requireAdmin();

  const summary = await getOrderSummary();

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalSales._sum.totalPrice!.toString())}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <CreditCard />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <CreditCard />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 md:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts data={{ salesData: summary.salesData }} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {summary.latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order.user.name ? order.user.name : "Deleted User"}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).formattedDate}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(order.totalPrice.toString())}
                    </TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span>Details</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
