import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductCard } from "@/components/products/ProductCard";
import type { ProductListItem } from "@/lib/api";

const mockProduct: ProductListItem = {
  id: 42,
  title: "Wireless Headphones",
  description: "Premium noise-cancelling headphones with 30h battery",
  image_url: null,
  average_rating: 4.5,
  review_count: 12,
};

describe("ProductCard", () => {
  it("renders product title and description", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText(/Premium noise-cancelling/)).toBeInTheDocument();
  });

  it("renders average rating value", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("renders review count", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("12 reviews")).toBeInTheDocument();
  });

  it("renders singular form for 1 review", () => {
    render(<ProductCard product={{ ...mockProduct, review_count: 1 }} />);
    expect(screen.getByText("1 review")).toBeInTheDocument();
  });

  it("links to product detail page", () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/42");
  });

  it("renders placeholder when no image", () => {
    render(<ProductCard product={{ ...mockProduct, image_url: null }} />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });
});
