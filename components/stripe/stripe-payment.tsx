"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { formatCurrency } from "@/lib/utils";
import { SERVER_URL } from "@/lib/constants";

const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const { theme, systemTheme } = useTheme();

  // Stripe Form Component
  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [email, setEmail] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!stripe || !elements || !email) return;

      setIsLoading(true);
      setErrorMessage(null);

      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            receipt_email: email,
            return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
          },
        })
        .then(({ error }) => {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setErrorMessage(error.message || "An error occurred");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-xl font-semibold">Stripe Checkout</div>
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}

        <PaymentElement />
        <div>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email || "")}
          />
        </div>
        <Button
          className="w-full"
          disabled={!stripe || isLoading || !elements}
          variant="default"
          size="lg"
        >
          {isLoading
            ? "Processing..."
            : `Pay $${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    );
  };

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
              ? "stripe"
              : systemTheme === "light"
              ? "stripe"
              : "night",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  );
};

export default StripePayment;
