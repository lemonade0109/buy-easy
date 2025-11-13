"use client";
import React from "react";
import { Button } from "../ui/button";
import { deliverOrder } from "@/lib/actions/orders/order-actions";
import { toast } from "react-hot-toast";
import { asStringMessage } from "@/lib/utils";

const MarkAsDeliveredButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await deliverOrder(orderId);
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
      {isPending ? "Processing..." : "Mark as Delivered"}
    </Button>
  );
};

export default MarkAsDeliveredButton;
