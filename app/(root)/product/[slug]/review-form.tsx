"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createOrUpdateReview,
  getReviewByUserForProduct,
} from "@/lib/actions/reviews/review-action";
import { reviewFormDefaultValues } from "@/lib/constants";
import { asStringMessage } from "@/lib/utils";
import { insertReviewSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = React.useState(false);

  const formSchema = insertReviewSchema.omit({ productId: true, userId: true });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: reviewFormDefaultValues,
  });

  // Submit Form Handler
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const reviewData = {
      ...data,
      productId,
      userId,
    };
    const res = await createOrUpdateReview(reviewData);
    if (!res.success) {
      toast.error(asStringMessage((res as { message?: unknown }).message));
    }

    setOpen(false);
    onReviewSubmitted();

    toast.success(asStringMessage((res as { message?: unknown }).message));
  };

  // Open Form Handler
  const handleOpenForm = async () => {
    const existingReview = await getReviewByUserForProduct({ productId });

    if (existingReview.data) {
      form.reset({
        title: existingReview.data.title,
        comment: existingReview.data.comment,
        rating: String(existingReview.data.rating),
      });
    }
    setOpen(true);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant={"default"}>
        Write a Review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>

              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter comment" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(
                          (rating) => (
                            <SelectItem key={rating} value={String(rating)}>
                              {rating}{" "}
                              <StarIcon className="inline-block ml-1 h-4 w-4 " />
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Submitting..."
                    : "Submit Review"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
