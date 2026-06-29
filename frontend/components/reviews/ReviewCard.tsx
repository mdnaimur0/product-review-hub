import { Star } from "lucide-react";
import type { ReviewRead } from "@/lib/api";

interface ReviewCardProps {
  review: ReviewRead;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="double-bezel animate-fade-up">
      <div className="double-bezel-inner bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
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
                className={`size-3 ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted/30 text-muted/30"
                }`}
              />
            ))}
          </div>
        </div>
        {review.comment && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {review.comment}
          </p>
        )}
        <time className="mt-3 block text-xs text-muted-foreground/60">
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
