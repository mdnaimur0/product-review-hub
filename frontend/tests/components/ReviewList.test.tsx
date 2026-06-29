import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ReviewList } from "@/components/reviews/ReviewList";
import type { ReviewRead } from "@/lib/api";

const mockReviews: ReviewRead[] = [
  {
    id: 1,
    product_id: 1,
    user_id: "user-1",
    user_name: "Alice",
    rating: 5,
    comment: "Perfect!",
    created_at: "2025-02-01T14:20:00Z",
  },
  {
    id: 2,
    product_id: 1,
    user_id: "user-2",
    user_name: "Bob",
    rating: 4,
    comment: "Good product overall.",
    created_at: "2025-02-05T09:15:00Z",
  },
];

describe("ReviewList", () => {
  it("renders all reviews", () => {
    render(<ReviewList reviews={mockReviews} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders empty state when no reviews", () => {
    render(<ReviewList reviews={[]} />);
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  });
});
