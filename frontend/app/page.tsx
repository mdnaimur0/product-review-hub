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
import {
  MagnifyingGlassIcon as MagnifyingGlass,
  CaretLeftIcon as CaretLeft,
  CaretRightIcon as CaretRight,
} from "@phosphor-icons/react";

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
      <main className="flex-1">
        <section className="relative min-h-[80dvh] flex items-center justify-center mesh-gradient-hero px-6 pt-24 pb-32">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/4 px-4 py-1.5 ring-1 ring-white/6">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                Trusted by thousands
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl text-balance leading-[0.95]">
              Discover.
              <br />
              <span className="text-primary">Review.</span> Decide.
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground/60 md:text-xl leading-relaxed">
              Real reviews from real people. Find the best products backed by
              honest opinions.
            </p>

            <div className="mx-auto max-w-2xl">
              <div className="double-bezel">
                <div className="double-bezel-inner bg-card">
                  <div className="flex flex-col gap-3 p-2 sm:flex-row">
                    <div className="relative flex-1">
                      <MagnifyingGlass
                        className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40"
                        weight="light"
                      />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="border-0 bg-transparent pl-10 ring-0 focus-visible:ring-0"
                      />
                    </div>
                    <Select
                      value={minRating}
                      onValueChange={handleRatingChange}
                    >
                      <SelectTrigger className="w-full sm:w-36 border-0 bg-black/3 dark:bg-white/3 text-foreground/60!">
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
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/30 pointer-events-none" />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-32 -mt-20 relative z-20">
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
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm text-muted-foreground/60">
                  {pagination.total} product{pagination.total !== 1 ? "s" : ""}{" "}
                  found
                </p>
              </div>
              <ProductGrid products={products} />
              {pagination.total_pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="gap-2"
                  >
                    <CaretLeft className="size-3.5" weight="bold" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: pagination.total_pages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-all duration-500 ease-out-expo ${
                          page === p
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground/60 hover:text-foreground hover:bg-white/4"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.total_pages, p + 1))
                    }
                    disabled={page === pagination.total_pages}
                    className="gap-2"
                  >
                    Next
                    <CaretRight className="size-3.5" weight="bold" />
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
