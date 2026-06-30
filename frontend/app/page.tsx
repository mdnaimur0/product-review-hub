"use client";

import { useMemo, useState } from "react";
import { useProducts, type ProductFilters } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState<string>("");
  const [page, setPage] = useState(1);

  const filters: ProductFilters = useMemo(
    () => ({
      search: search.trim() || null,
      min_rating: minRating ? Number(minRating) : null,
      page,
      page_size: 12,
    }),
    [search, minRating, page],
  );

  const { products, pagination, isLoading, error, refetch } =
    useProducts(filters);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRatingChange = (value: string) => {
    setMinRating(value === "all" ? "" : value);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <section className="mx-auto max-w-6xl px-6 mb-20 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            Discover. Review. Decide.
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Real reviews from real people. Find the best products backed by
            honest opinions.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={minRating} onValueChange={handleRatingChange}>
              <SelectTrigger className="w-35">
                <SelectValue placeholder="All ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ratings</SelectItem>
                <SelectItem value="4">4+ stars</SelectItem>
                <SelectItem value="3">3+ stars</SelectItem>
                <SelectItem value="2">2+ stars</SelectItem>
                <SelectItem value="1">1+ stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error ? (
            <ErrorAlert message={error} onRetry={refetch} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description={
                search || minRating
                  ? "Try adjusting your search or filter criteria."
                  : "There are no products to review right now. Check back later."
              }
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {pagination.total} product{pagination.total !== 1 ? "s" : ""}{" "}
                found
              </p>
              <ProductGrid products={products} />
              {pagination.total_pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.total_pages, p + 1))
                    }
                    disabled={page === pagination.total_pages}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
