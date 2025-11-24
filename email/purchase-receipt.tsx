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
      <Preview>View Order Receipt</Preview>

      <Tailwind>
        <Head />
        <Body className="bg-white font-sans">
          <Container className=" max-w-xl">
            <Heading className="text-2xl font-bold text-gray-800">
              Purchase Receipt
            </Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Order ID
                  </Text>

                  <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                </Column>

                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>

                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>

                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>

                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>

                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Price paid
                  </Text>

                  <Text className="mt-0 mr-4">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="border border-solid border-gray-500 rounded-lg py-4 md:p-6 my-4">
              {order.orderitems.map((item) => (
                <Row key={item.productId} className="mt-8">
                  <Column className="w-20">
                    <Img
                      width={"80"}
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>

                  <Column className="align-top">
                    {item.name} x {item.quantity}
                  </Column>
                </Row>
              ))}

              {[
                { name: "Items", price: order.itemsPrice },
                { name: "Tax", price: order.taxPrice },
                { name: "Shipping", price: order.shippingPrice },
                { name: "Total", price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}: </Column>
                  <Column align="right" width={70} className="align-top ">
                    <Text className="m-0">{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
