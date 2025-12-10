import sampleData from "@/db/sample-data";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import "dotenv/config";
import React from "react";

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: "123",
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      fullName: "John Doe",
      address: "123 Main St",
      city: "Anytown",
      postalCode: "12345",
      country: "USA",
    },
    createdAt: new Date(),
    itemsPrice: "100",
    taxPrice: "10",
    shippingPrice: "5",
    totalPrice: "115",
    orderitems: sampleData.products.map((x) => ({
      productId: "123",
      name: x.name,
      image: x.image[0],
      slug: x.slug,
      quantity: 1,
      price: x.price.toString(),
      orderId: "order_123",
    })),
    isDelivered: true,
    isPaid: true,
    deliveredAt: new Date(),
    paidAt: new Date(),
    paymentResult: {
      id: "pay_123",
      status: "Completed",
      pricePaid: "115.00",
      email_address: "john.doe@example.com",
    },
  },
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

type OrderInformationProps = {
  order: Order;
};

export default function PurchaseReceiptEmail({ order }: { order: Order }) {
  return (
    <Html>
      <Preview>
        Your order #{order.id} has been confirmed - Thank you for shopping with
        BuyEasy!
      </Preview>

      <Tailwind>
        <Head />
        <Body className="bg-gray-50 font-sans">
          <Container className="max-w-2xl mx-auto bg-white my-10 rounded-lg shadow-lg">
            {/* Header */}
            <Section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-8 rounded-t-lg">
              <Heading className="text-3xl font-bold m-0 text-white">
                Order Confirmed! 🎉
              </Heading>
              <Text className="text-blue-100 mt-2 mb-0">
                Thank you for your purchase, {order.user.name}!
              </Text>
            </Section>

            {/* Order Info */}
            <Section className="px-10 py-6 bg-gray-50 border-b border-gray-200">
              <Row>
                <Column>
                  <Text className="text-xs uppercase text-gray-500 font-semibold mb-1">
                    Order Number
                  </Text>
                  <Text className="text-sm font-mono bg-white px-3 py-2 rounded border border-gray-200 inline-block">
                    #{order.id.slice(0, 8)}
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-xs uppercase text-gray-500 font-semibold mb-1">
                    Order Date
                  </Text>
                  <Text className="text-sm font-medium text-gray-800">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Order Items */}
            <Section className="px-10 py-8">
              <Heading className="text-xl font-bold text-gray-800 mb-6">
                Order Items
              </Heading>

              {order.orderitems.map((item, index) => (
                <Row
                  key={item.productId}
                  className={`${index !== 0 ? "border-t border-gray-200 pt-6" : ""} pb-6`}
                >
                  <Column className="w-24 pr-4">
                    <Img
                      width="80"
                      height="80"
                      alt={item.name}
                      className="rounded-lg border border-gray-200"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    <Text className="font-semibold text-gray-900 text-base m-0 mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-gray-600 text-sm m-0">
                      Quantity: {item.quantity}
                    </Text>
                  </Column>
                  <Column align="right" className="align-top">
                    <Text className="font-bold text-gray-900 text-base m-0">
                      {formatCurrency(item.price)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Order Summary */}
            <Section className="px-10 py-6 bg-gray-50 rounded-b-lg">
              <Heading className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </Heading>

              {[
                { name: "Subtotal", price: order.itemsPrice, bold: false },
                { name: "Shipping", price: order.shippingPrice, bold: false },
                { name: "Tax", price: order.taxPrice, bold: false },
              ].map(({ name, price, bold }) => (
                <Row key={name} className="mb-2">
                  <Column>
                    <Text
                      className={`text-sm ${bold ? "font-semibold" : ""} text-gray-700 m-0`}
                    >
                      {name}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text
                      className={`text-sm ${bold ? "font-semibold" : ""} text-gray-700 m-0`}
                    >
                      {formatCurrency(price)}
                    </Text>
                  </Column>
                </Row>
              ))}

              <Section className="border-t-2 border-gray-300 mt-4 pt-4">
                <Row>
                  <Column>
                    <Text className="text-lg font-bold text-gray-900 m-0">
                      Total
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text className="text-lg font-bold text-blue-600 m-0">
                      {formatCurrency(order.totalPrice)}
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Shipping Address */}
            <Section className="px-10 py-6 border-t border-gray-200">
              <Heading className="text-lg font-bold text-gray-800 mb-3">
                Shipping Address
              </Heading>
              <Text className="text-sm text-gray-700 leading-relaxed m-0">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="px-10 py-6 bg-gray-100 text-center rounded-b-lg">
              <Text className="text-xs text-gray-600 m-0">
                Questions? Contact us at support@buyeasy.com
              </Text>
              <Text className="text-xs text-gray-500 mt-2 mb-0">
                © 2025 BuyEasy. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
