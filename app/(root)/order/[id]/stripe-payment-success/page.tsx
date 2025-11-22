import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/orders/order-actions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function StripePaymentSuccessPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) {
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  // Fetch order
  const order = await getOrderById(id);
  if (!order || "success" in order) notFound();

  // Retrieve Payment Intent from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(
    paymentIntentId as string
  );

  // Check payment validity
  if (
    paymentIntent.metadata.orderId === null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    notFound();
  }

  // Check if payment is successful
  const isSuccess = paymentIntent.status === "succeeded";
  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-bold">Thanks for your purchase</h1>
        <p className="text-center text-lg">We are processing your order now.</p>

        <Button asChild>
          <Link href={`/order/${id}`}>View Order </Link>
        </Button>
      </div>
    </div>
  );
}
