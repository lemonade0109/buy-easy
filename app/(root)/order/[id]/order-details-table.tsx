import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import NextLink from "next/link";
import Image from "next/image";
import React from "react";
import PayPalButtonsComponent from "@/components/paypal/paypal-button";
import MarkAsPaidButton from "@/components/admin/mark-as-paid-button";
import MarkAsDeliveredButton from "@/components/admin/mark-as-delivered-button";
import StripePayment from "@/components/stripe/stripe-payment";

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, "paymentResult">;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    id,
    shippingAddress,
    shippingPrice,
    orderitems,
    itemsPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;

  const paymentMethodIcon = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "PayPal":
        return (
          <Image src="/icons/paypal.svg" alt="PayPal" width={80} height={80} />
        );
      case "Stripe":
        return (
          <Image src="/icons/stripe.svg" alt="Stripe" width={60} height={60} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5 gap-3">
        <div className="col-span-3 md:col-span-2 w-full space-4-y overflow-auto">
          <Card className="w-full">
            <CardContent className="text-xl pb-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="pb-2">{paymentMethodIcon(paymentMethod)}</p>

              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).formattedDateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="md:my-4 my-3 w-full">
            <CardContent className="text-xl pb-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p className="pb-2 text-sm">{shippingAddress.fullName}</p>
              <p className="pb-2 text-sm">
                {shippingAddress.address} {shippingAddress.city}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>

              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).formattedDateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <NextLink
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={String(item.image)}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.quantity}</span>
                      </TableCell>
                      <TableCell className="">${item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 md:col-span-1 w-full">
          <div className="mb-2 text-xl font-semibold">Order Summary</div>

          <Card className="w-full">
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>

              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>

              {/*  PayPal Payment Section */}
              {!isPaid && paymentMethod === "PayPal" && (
                <PayPalButtonsComponent
                  orderId={order.id}
                  paypalClientId={paypalClientId}
                />
              )}

              {/* Stripe Payment Section */}
              {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}

              {/* Cash on Delivery Section */}
              {isAdmin && !isPaid && paymentMethod === "Cash on Delivery" && (
                <MarkAsPaidButton orderId={order.id} />
              )}

              {isAdmin && isPaid && !isDelivered && (
                <MarkAsDeliveredButton orderId={order.id} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
