import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/orders/order-actions";

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Build the webhook event
    const event = await Stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") || "",
      webhookSecret
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

    return NextResponse.json({ message: "Event type not handled" });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
