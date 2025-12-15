import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
  stockCount: number;
  lowStockThreshold?: number;
  className?: string;
}

export default function StockBadge({
  stockCount,
  lowStockThreshold = 10,
  className = "",
}: StockBadgeProps) {
  if (stockCount === 0) {
    return (
      <Badge variant="destructive" className={className}>
        Out of Stock
      </Badge>
    );
  }

  if (stockCount <= lowStockThreshold) {
    return (
      <Badge
        variant="default"
        className={`bg-orange-500 hover:bg-orange-600 ${className}`}
      >
        Low Stock ({stockCount} left)
      </Badge>
    );
  }

  return (
    <Badge
      variant="default"
      className={`bg-green-500 hover:bg-green-600 ${className}`}
    >
      In Stock
    </Badge>
  );
}
