"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProductStock } from "@/lib/actions/products/stock-management";
import { asStringMessage } from "@/lib/utils";
import { Package } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface UpdateStockButtonProps {
  productId: string;
  productName: string;
  currentStock: number;
}

export default function UpdateStockButton({
  productId,
  productName,
  currentStock,
}: UpdateStockButtonProps) {
  const [open, setOpen] = useState(false);
  const [stock, setStock] = useState(currentStock.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateProductStock(productId, Number(stock));

    if (result.success) {
      toast.success(asStringMessage((result as { message?: unknown }).message));
      setOpen(false);
    } else {
      toast.error(asStringMessage((result as { message?: unknown }).message));
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="h-4 w-4 mr-2" />
          Update Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Update the stock quantity for {productName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Current stock: {currentStock}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
