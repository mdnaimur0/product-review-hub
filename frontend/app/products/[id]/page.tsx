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
import { Star } from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = Number(id);
  const { product, isLoading, error, refetch } = useProduct(productId);
  const { isAuthenticated } = useAuth();
  const avgRating = product ? averageRating(product.reviews) : 0;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          {error && <ErrorAlert message={error} onRetry={refetch} />}

          {isLoading || !product ? (
            <div className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <Skeleton className="aspect-square rounded-2xl" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-1 pt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="size-6 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          ) : (
            <>
              <div className="mb-16 grid gap-8 md:grid-cols-2">
                <div className="double-bezel">
                  <div className="double-bezel-inner relative aspect-square overflow-hidden bg-muted">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground/30">
                        <Star className="size-20" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {product.title}
                  </h1>
                  {product.description && (
                    <p className="mb-6 leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <StarRating
                      value={Math.round(avgRating)}
                      readonly
                      size="lg"
                    />
                    <span className="text-lg font-semibold text-foreground">
                      {avgRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews.length}{" "}
                      {product.reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
                  Reviews
                </h2>
                {isAuthenticated && (
                  <div className="mb-8">
                    <ReviewForm productId={productId} onSuccess={refetch} />
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
