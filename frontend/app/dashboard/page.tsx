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
import { Shield, Package, MessageSquare } from "lucide-react";

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
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Dashboard
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Shield className="size-3" />
                  Admin
                </span>
              )}
            </div>
            {user && (
              <p className="text-muted-foreground">
                Welcome back,{" "}
                <span className="font-medium text-foreground">{user.name}</span>
                {". "}
                Here are your reviews.
              </p>
            )}
          </div>

          {error && <ErrorAlert message={error} onRetry={refetch} />}

          {isLoading || authLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="double-bezel">
                  <div className="double-bezel-inner bg-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="size-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex gap-0.5">
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
                <div key={review.id} style={{ animationDelay: `${i * 60}ms` }}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-16">
              <div className="mb-8 flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Admin Panel
                </h2>
                <Shield className="size-5 text-primary" />
              </div>

              {/* Admin Tabs */}
              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-smooth duration-200 ${
                    activeTab === "products"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Package className="size-4" />
                  Products
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-smooth duration-200 ${
                    activeTab === "reviews"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <MessageSquare className="size-4" />
                  Reviews
                </button>
              </div>

              {/* Admin Content */}
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
