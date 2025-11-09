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

const OrderDetailsTable = ({
  order,
  paypalClientId,
}: {
  order: Order;
  paypalClientId: string;
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
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-auto">
          <Card>
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

          <Card className="my-4">
            <CardContent className="text-xl pb-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p className="pb-2">{shippingAddress.fullName}</p>
              <p className="pb-2">
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

          <Card>
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
                  {orderitems.map(
                    (item) => (
                      console.log("orderItem:", item),
                      (
                        <TableRow key={item.slug}>
                          <>
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
                          </>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="">
          <Card>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
