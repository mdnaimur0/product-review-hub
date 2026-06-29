"use client";

import { useState, useTransition } from "react";
import { reviewsCreateReview } from "@/lib/api";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: number;
  onSuccess: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    startTransition(async () => {
      try {
        const { error: apiError } = await reviewsCreateReview({
          body: {
            rating,
            comment: comment || undefined,
            product_id: productId,
          },
        });
        if (apiError) throw apiError;
        setRating(0);
        setComment("");
        toast.success("Review submitted successfully!");
        onSuccess();
      } catch (err) {
        toast.error(
          getErrorMessage(err as Parameters<typeof getErrorMessage>[0]),
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Your Rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <div>
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          rows={3}
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full resize-none rounded-lg border border-input bg-input/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-smooth duration-200 focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending || rating === 0}
        className="gap-2"
      >
        <Send className="size-3.5" />
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
