"use client";

import { useState, useTransition } from "react";
import { reviewsCreateReview } from "@/lib/api";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { PaperPlaneRight } from "@phosphor-icons/react";
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2.5 block text-sm font-medium text-foreground">
          Your Rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <div>
        <label
          htmlFor="comment"
          className="mb-2.5 block text-sm font-medium text-foreground"
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
          className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus:border-ring/50 focus:ring-3 focus:ring-ring/20 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={isPending || rating === 0}
          className="gap-2"
        >
          <PaperPlaneRight className="size-3.5" weight="bold" />
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
