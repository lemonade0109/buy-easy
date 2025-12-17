"use client";
import { Review } from "@/types";
import Link from "next/link";
import React from "react";
import ReviewForm from "./review-form";
import { getAllReviewsForProduct } from "@/lib/actions/reviews/review-action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = React.useState<Review[]>([]);

  React.useEffect(() => {
    const loadReviews = async () => {
      const res = await getAllReviewsForProduct({ productId });
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);

  // Reload handler after review submission
  const reload = async () => {
    const res = await getAllReviewsForProduct({ productId });
    setReviews(res.data);
  };
  return (
    <div className="space-y-4 mt-4">
      {reviews.length === 0 && <div>No reviews yet.</div>}

      {userId ? (
        <>
          {/* REVIEW FORM HERE */}
          <ReviewForm
            onReviewSubmitted={reload}
            userId={userId}
            productId={productId}
          />
        </>
      ) : (
        <div className="">
          Please {` `}
          <Link
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
            className="text-blue-600 underline"
          >
            sign in
          </Link>{" "}
          to write a review.
        </div>
      )}
      <div className="flex flex-col gap-3 max-w-4xl">
        {/* Reviews here */}
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.comment}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />

                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span className="text-xs md:text-sm max-w-[150px] md:max-w-none truncate">
                    {review.user ? review.user.name : "User"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span className="text-xs md:text-sm">
                    {formatDateTime(review.createdAt).formattedDateTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
