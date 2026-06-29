import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import type { ReviewRead } from "@/lib/api";

const mockReview: ReviewRead = {
  id: 1,
  product_id: 1,
  user_id: "user-1",
  user_name: "Alice Johnson",
  rating: 4,
  comment: "Great product, really enjoy using it daily.",
  created_at: "2025-03-15T10:30:00Z",
};

describe("ReviewCard", () => {
  it("renders user name", () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  });

  it("renders user avatar initial", () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders comment", () => {
    render(<ReviewCard review={mockReview} />);
    expect(
      screen.getByText("Great product, really enjoy using it daily."),
    ).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(/Mar 15, 2025/)).toBeInTheDocument();
  });

  it("renders correct number of filled stars", () => {
    const { container } = render(<ReviewCard review={mockReview} />);
    const filled = container.querySelectorAll(".fill-amber-400");
    expect(filled).toHaveLength(4);
  });
});
