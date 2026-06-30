"use client";

import { use } from "react";
import { useProduct } from "@/hooks/useProduct";
import { useAuth } from "@/hooks/useAuth";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { StarRating } from "@/components/reviews/StarRating";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "@phosphor-icons/react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = Number(id);
  const {
    product,
    isLoading,
    error,
    notFound: isNotFound,
    refetch,
  } = useProduct(productId);
  const { isAuthenticated } = useAuth();
  const avgRating = product ? averageRating(product.reviews) : 0;

  if (isNotFound) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-40 pb-32">
        <div className="mx-auto max-w-6xl px-6">
          {error ? (
            <ErrorAlert message={error} onRetry={refetch} />
          ) : isLoading || !product ? (
            <div className="space-y-12">
              <div className="grid gap-12 md:grid-cols-2">
                <Skeleton className="aspect-square rounded-[calc(var(--radius-4xl)+0.25rem)]" />
                <div className="space-y-5">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <div className="flex gap-1 pt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="size-7 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-7 w-32" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-32 rounded-[calc(var(--radius-4xl)+0.25rem)]"
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-20 grid gap-12 md:grid-cols-2">
                <div className="double-bezel">
                  <div className="double-bezel-inner relative aspect-square overflow-hidden bg-white/[0.03]">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Star
                          className="size-20 text-white/[0.06]"
                          weight="light"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 ring-1 ring-white/[0.06] w-fit">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                      Product Detail
                    </span>
                  </div>
                  <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl leading-[1.05]">
                    {product.title}
                  </h1>
                  {product.description && (
                    <p className="mb-8 text-base leading-relaxed text-muted-foreground/70 md:text-lg">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    {product.reviews.length > 0 && (
                      <>
                        <StarRating
                          value={Math.round(avgRating)}
                          readonly
                          size="lg"
                        />
                        <span className="text-2xl font-semibold text-foreground">
                          {avgRating.toFixed(1)}
                        </span>
                      </>
                    )}
                    <span className="text-sm text-muted-foreground/50">
                      {product.reviews.length}{" "}
                      {product.reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>
              </div>

              <section className="max-w-3xl">
                <div className="mb-8 flex items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Reviews
                  </h2>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>
                {isAuthenticated && (
                  <div className="double-bezel mb-10">
                    <div className="double-bezel-inner bg-card p-6 md:p-8">
                      <ReviewForm productId={productId} onSuccess={refetch} />
                    </div>
                  </div>
                )}
                <ReviewList reviews={product.reviews} />
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function averageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
