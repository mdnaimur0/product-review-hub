"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash, Star, ChatText } from "@phosphor-icons/react";
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
          <h3 className="mb-5 text-lg font-semibold text-foreground">
            Review Moderation
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.06] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="skeleton-shimmer size-6 rounded-full" />
                    <div className="skeleton-shimmer h-4 w-24 rounded" />
                  </div>
                  <div className="skeleton-shimmer h-4 w-16 rounded" />
                </div>
                <div className="skeleton-shimmer h-4 w-full rounded" />
                <div className="mt-3 skeleton-shimmer h-3 w-32 rounded" />
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
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Review Moderation
          </h3>
          <span className="text-sm text-muted-foreground/60">
            {reviews.length} reviews
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06]">
              <ChatText
                className="size-6 text-muted-foreground/40"
                weight="light"
              />
            </div>
            <p className="text-sm text-muted-foreground/60">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-white/[0.06] p-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.02]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {review.user_name}
                    </span>
                    <Link
                      href={`/products/${review.product_id}`}
                      className="text-xs text-muted-foreground/60 hover:text-primary"
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
                              : "fill-white/[0.03] text-white/[0.08]"
                          }`}
                          weight={i < review.rating ? "fill" : "regular"}
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
                        <Spinner />
                      ) : (
                        <Trash className="size-3" weight="bold" />
                      )}
                    </Button>
                  </div>
                </div>
                {review.comment && (
                  <p className="mb-2 text-sm leading-relaxed text-muted-foreground/80">
                    {review.comment}
                  </p>
                )}
                <time className="block text-xs text-muted-foreground/40">
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
