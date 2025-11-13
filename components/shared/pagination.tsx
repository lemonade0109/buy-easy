"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { formUrlQueryString } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  urlPathname?: string;
};

const Pagination = ({ page, totalPages, urlPathname }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: "prev" | "next") => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQueryString({
      params: searchParams.toString(),
      key: urlPathname || "page",
      value: pageValue.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        disabled={Number(page) <= 1}
        onClick={() => handleClick("prev")}
      >
        Previous
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick("next")}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
