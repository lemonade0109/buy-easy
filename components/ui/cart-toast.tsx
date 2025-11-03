"use client";
import React from "react";
import { toast as hotToast, type Toast } from "react-hot-toast";
import { Button } from "./button";

type CartToastProps = {
  t: Toast; // toast object from react-hot-toast
  description: string;
  onViewCart: () => void;
};

export default function CartToast({
  t,
  description,
  onViewCart,
}: CartToastProps) {
  return (
    <div className="flex items-start gap-4 max-w-sm w-full bg-white dark:bg-slate-900 shadow-md rounded-md p-3 border border-slate-100 dark:border-slate-800">
      <div className="flex items-start ">
        <div className="flex-1">
          <span className="text-xs text-slate-600 dark:text-slate-300">
            {description}
          </span>
        </div>
      </div>

      <div className="">
        <Button
          onClick={() => {
            onViewCart();
            hotToast.dismiss(t.id);
          }}
        >
          View cart
        </Button>
      </div>
      <div>
        <button
          aria-label="Dismiss"
          className="text-slate-400 hover:text-slate-600"
          onClick={() => hotToast.dismiss(t.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
}
