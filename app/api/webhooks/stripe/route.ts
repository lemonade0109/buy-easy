import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/orders/order-actions";

export async function POST(req: NextRequest) {
  // Build the webhook event
  const event = await Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") || "",
    process.env.STRIPE_WEBHOOK_SECRET || ""
  );

  // Check for successful payment intent
  if (event.type === "charge.succeeded") {
    const { object } = event.data;

    // Update order status
    await updateOrderToPaid(object.metadata.orderId, {
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toString(),
      },
    });

    return NextResponse.json({ message: "Order updated to paid" });
  }

  return NextResponse.json({ message: "Event is not charge.succeeded" });
}
