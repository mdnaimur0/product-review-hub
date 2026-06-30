import { StarIcon as Star } from "@phosphor-icons/react";
import type { ReviewRead } from "@/lib/api";

interface ReviewCardProps {
  review: ReviewRead;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div
      className="double-bezel"
      style={{ animation: "fade-up-blur 0.9s var(--ease-out-expo) both" }}
    >
      <div className="double-bezel-inner bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {review.user_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-foreground">
              {review.user_name}
            </span>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 stroke-2 stroke-foreground ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-(--bg-subtle) text-(--border-subtle)"
                }`}
                weight={i < review.rating ? "fill" : "regular"}
              />
            ))}
          </div>
        </div>
        {review.comment && (
          <p className="text-sm leading-relaxed text-muted-foreground/80">
            {review.comment}
          </p>
        )}
        <time className="mt-4 block text-xs text-muted-foreground/40">
          {new Date(review.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </div>
  );
}
