import React from "react";
import { Card, CardContent } from "./ui/card";
import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">Free Shipping</div>
            <div className="text-sm text-muted-foreground">
              Get free shipping on all orders over $50.
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold">Money Back Guarantee</div>
            <div className="text-sm text-muted-foreground">
              Within 30 days of delivery, return for a full refund.
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">Secure Payment</div>
            <div className="text-sm text-muted-foreground">
              We offer secure payment options for your peace of mind.
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">Customer Support</div>
            <div className="text-sm text-muted-foreground">
              We provide 24/7 customer support to assist you with any inquiries.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
