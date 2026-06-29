import type { ReviewRead } from "@/lib/api";
import { ReviewCard } from "./ReviewCard";
import { EmptyState } from "@/components/shared/EmptyState";

interface ReviewListProps {
  reviews: ReviewRead[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first to share your thoughts about this product."
      />
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, i) => (
        <div key={review.id} style={{ animationDelay: `${i * 60}ms` }}>
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
}
