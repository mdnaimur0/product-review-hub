"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { AdminReviewRead } from "@/lib/api";
import Link from "next/link";

interface ReviewModerationProps {
  reviews: AdminReviewRead[];
  isLoading: boolean;
  onDelete: (reviewId: number) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export function ReviewModeration({
  reviews,
  isLoading,
  onDelete,
}: ReviewModerationProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (reviewId: number) => {
    setDeletingId(reviewId);

    const result = await onDelete(reviewId);

    if (result.success) {
      toast.success("Review deleted successfully!");
    } else {
      toast.error(result.error || "Failed to delete review");
    }

    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="double-bezel">
        <div className="double-bezel-inner bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Review Moderation
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-6 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="double-bezel">
      <div className="double-bezel-inner bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Review Moderation
          </h3>
          <span className="text-sm text-muted-foreground">
            {reviews.length} reviews
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-border p-4 transition-smooth duration-200 hover:bg-muted/50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {review.user_name}
                    </span>
                    <Link
                      href={`/products/${review.product_id}`}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      on {review.product_title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted/30 text-muted/30"
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      aria-label={`Delete review by ${review.user_name}`}
                    >
                      {deletingId === review.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2 className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>
                {review.comment && (
                  <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                )}
                <time className="block text-xs text-muted-foreground/60">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
