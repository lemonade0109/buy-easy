"use client";
import React from "react";
import { Button } from "../ui/button";
import { updateOrderToPaidCOD } from "@/lib/actions/orders/order-actions";
import { toast } from "react-hot-toast";
import { asStringMessage } from "@/lib/utils";

const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => {
        console.log("🔴 Mark as Paid button clicked for order:", orderId);
        startTransition(async () => {
          console.log("🟡 Starting payment update for order:", orderId);
          const res = await updateOrderToPaidCOD(orderId);
          console.log("🟢 Payment update response:", res);
          toast(
            res.success
              ? toast.success(
                  asStringMessage((res as { message?: unknown }).message)
                )
              : toast.error(
                  asStringMessage((res as { message?: unknown }).message)
                )
          );
        });
      }}
    >
      {isPending ? "Processing..." : "Mark as Paid"}
    </Button>
  );
};

export default MarkAsPaidButton;
