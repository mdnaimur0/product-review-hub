"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const { products, isLoading, error, refetch } = useProducts();

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
          {error && <ErrorAlert message={error} onRetry={refetch} />}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products yet"
              description="There are no products to review right now. Check back later."
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
