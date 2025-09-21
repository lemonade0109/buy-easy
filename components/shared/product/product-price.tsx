import { cn } from "@/lib/utils";
import React from "react";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const stringValue = value.toFixed(2);
  const [whole, decimal] = stringValue.split(".");
  return (
    <p className={cn("text-xl", className)}>
      <span className={`text-xl font-semibold ${className}`}>
        ${whole}
        <span className="text-xs align-super">.{decimal}</span>
      </span>
    </p>
  );
};

export default ProductPrice;
