"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SortOption {
  value: string;
  name: string;
}

interface MobileSortProps {
  sortOptions: SortOption[];
  currentSort: string;
}

export default function MobileSort({
  sortOptions,
  currentSort,
}: MobileSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[400px]">
        <SheetHeader>
          <SheetTitle>Sort by</SheetTitle>
        </SheetHeader>
        <div className="mt-6 px-4">
          <RadioGroup value={currentSort} onValueChange={handleSortChange}>
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 mb-4"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="text-base cursor-pointer"
                >
                  {option.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
}
