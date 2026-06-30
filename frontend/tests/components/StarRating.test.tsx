import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StarRating } from "@/components/reviews/StarRating";

describe("StarRating", () => {
  it("renders 5 stars", () => {
    const { container } = render(<StarRating value={0} />);
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(5);
  });

  it("fills correct number of stars", () => {
    const { container } = render(<StarRating value={3} />);
    const filled = container.querySelectorAll(".fill-amber-400");
    expect(filled).toHaveLength(3);
  });

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    const { container } = render(<StarRating value={0} onChange={onChange} />);
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("does not call onChange in readonly mode", () => {
    const onChange = vi.fn();
    const { container } = render(
      <StarRating value={0} onChange={onChange} readonly />,
    );
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[2]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables buttons in readonly mode", () => {
    const { container } = render(<StarRating value={0} readonly />);
    const buttons = container.querySelectorAll("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });
});
