import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ReviewForm } from "@/components/reviews/ReviewForm";

describe("ReviewForm", () => {
  it("renders rating label", () => {
    render(<ReviewForm productId={1} onSuccess={() => {}} />);
    expect(screen.getByText("Your Rating")).toBeInTheDocument();
  });

  it("renders comment textarea", () => {
    render(<ReviewForm productId={1} onSuccess={() => {}} />);
    expect(
      screen.getByPlaceholderText(/Share your experience/),
    ).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ReviewForm productId={1} onSuccess={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Submit Review/ }),
    ).toBeInTheDocument();
  });

  it("disables submit when rating is 0", () => {
    render(<ReviewForm productId={1} onSuccess={() => {}} />);
    const btn = screen.getByRole("button", { name: /Submit Review/ });
    expect(btn).toBeDisabled();
  });
});
