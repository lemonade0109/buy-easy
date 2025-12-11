"use client";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/lib/actions/wishlists/wishlist";
import { asStringMessage } from "@/lib/utils";
import { Loader } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const WishlistButton = ({
  productId,
  initialInWishlist = false,
}: {
  productId: string;
  initialInWishlist?: boolean;
}) => {
  const [inWishlist, setInWishlist] = React.useState(initialInWishlist);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const handleWishlistToggle = async () => {
    startTransition(async () => {
      const res = await toggleWishlist({ productId, pathname });
      if (!res.success) {
        if (res.requiresAuth) {
          router.push(`/sign-in?callbackUrl=/product/${productId}`);
        } else {
          toast.error(asStringMessage((res as { message?: unknown }).message));
        }

        return;
      }

      setInWishlist(res.inWishlist ?? !inWishlist);
      toast.success(res.message as string);
    });
  };

  return (
    <Button
      type="submit"
      size="icon"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleWishlistToggle();
      }}
      className="p-2 cursor-pointer bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : inWishlist ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};

export default WishlistButton;
