"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { renderError } from "@/lib/utils";
import { insertReviewSchema, validateWithZodSchema } from "@/lib/validator";
import { revalidatePath } from "next/cache";
import z from "zod";

// Create & Update Product Review
export const createOrUpdateReview = async (
  data: z.infer<typeof insertReviewSchema>
) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authorized");

    const validatedReview = validateWithZodSchema(insertReviewSchema, {
      ...data,
      userId: session.user.id as string,
    });

    // Get product being reviewed
    const product = await prisma.product.findFirst({
      where: { id: validatedReview.productId },
    });

    if (!product) throw new Error("Product not found");

    // Check if user has already reviewed the product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: validatedReview.productId,
        userId: validatedReview.userId,
      },
    });

    await prisma.$transaction(async (prisma) => {
      if (existingReview) {
        // Update existing review
        await prisma.review.update({
          where: { id: existingReview.id },
          data: {
            rating: validatedReview.rating,
            title: validatedReview.title,
            comment: validatedReview.comment,
          },
        });
      } else {
        // Create new review
        await prisma.review.create({
          data: validatedReview,
        });
      }

      // Get avg rating
      const averageRating = await prisma.review.aggregate({
        where: { productId: validatedReview.productId },
        _avg: { rating: true },
      });

      // Get number of reviews
      const numberOfReviews = await prisma.review.count({
        where: { productId: validatedReview.productId },
      });

      // Update product with new avg rating and number of reviews
      await prisma.product.update({
        where: { id: validatedReview.productId },
        data: {
          rating: averageRating._avg.rating?.toFixed(1) || "0",
          numReviews: numberOfReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: existingReview
        ? "Review updated successfully"
        : "Review created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Get All reviews for a product
export const getAllReviewsForProduct = async ({
  productId,
}: {
  productId: string;
}) => {
  const data = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });
  return { data };
};

// Get review by user for a product
export const getReviewByUserForProduct = async ({
  productId,
}: {
  productId: string;
}) => {
  const session = await auth();
  if (!session) throw new Error("User is not authorized");
  const userId = session.user.id as string;

  const data = await prisma.review.findFirst({
    where: { productId, userId },
  });
  return { data };
};
