"use client";
import React from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  approvePayPalOrder,
  createPayPalOrder,
} from "@/lib/actions/orders/order-actions";
import { toast } from "react-hot-toast";

const PayPalButtonsComponent = ({
  paypalClientId,
  orderId,
}: {
  paypalClientId: string;
  orderId: string;
}) => {
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(orderId);

    if (!res.success) {
      toast.error(res.message);
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(orderId, data);

    if (!res.success) {
      toast.error(res.message);
    }

    if (res.success) {
      toast.success("Order paid successfully");
    }
  };

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";

    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "Failed to load PayPal";
    }
    return status;
  };
  return (
    <div className="">
      <PayPalScriptProvider options={{ clientId: paypalClientId }}>
        <PrintLoadingState />
        <PayPalButtons
          createOrder={handleCreatePayPalOrder}
          onApprove={handleApprovePayPalOrder}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButtonsComponent;
