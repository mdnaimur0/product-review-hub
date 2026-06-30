"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMyReviews } from "@/hooks/useMyReviews";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { ReviewModeration } from "@/components/admin/ReviewModeration";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Package, ChatText } from "@phosphor-icons/react";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { reviews, isLoading, error, refetch } = useMyReviews();
  const {
    products,
    isLoading: productsLoading,
    createProduct,
    deleteProduct,
  } = useAdminProducts();
  const {
    reviews: allReviews,
    isLoading: reviewsLoading,
    deleteReview,
  } = useAdminReviews();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "reviews">(
    "products",
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const isAdmin = user?.is_superuser === true;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-40 pb-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Dashboard
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-primary">
                  <ShieldCheck className="size-3" weight="fill" />
                  Admin
                </span>
              )}
            </div>
            {user && (
              <p className="text-muted-foreground/60">
                Welcome back,{" "}
                <span className="font-medium text-foreground">{user.name}</span>
                {". "}
                Here are your reviews.
              </p>
            )}
          </div>

          {error ? (
            <ErrorAlert message={error} onRetry={refetch} />
          ) : isLoading || authLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="double-bezel">
                  <div className="double-bezel-inner bg-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Skeleton key={j} className="size-3 rounded-full" />
                        ))}
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="You haven't written any reviews yet. Start exploring products and share your thoughts!"
              actionLabel="Browse Products"
              actionHref="/"
            />
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div key={review.id} style={{ animationDelay: `${i * 80}ms` }}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          )}

          {isAdmin && (
            <div className="mt-20">
              <div className="mb-8 flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Admin Panel
                </h2>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    activeTab === "products"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/[0.03] text-muted-foreground/60 hover:text-foreground hover:bg-white/[0.06] ring-1 ring-white/[0.06]"
                  }`}
                >
                  <Package className="size-4" weight="bold" />
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    activeTab === "reviews"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/[0.03] text-muted-foreground/60 hover:text-foreground hover:bg-white/[0.06] ring-1 ring-white/[0.06]"
                  }`}
                >
                  <ChatText className="size-4" weight="bold" />
                  Reviews
                </button>
              </div>

              {activeTab === "products" ? (
                <ProductManagement
                  products={products}
                  isLoading={productsLoading}
                  onDelete={deleteProduct}
                  onCreate={createProduct}
                />
              ) : (
                <ReviewModeration
                  reviews={allReviews}
                  isLoading={reviewsLoading}
                  onDelete={deleteReview}
                />
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
