"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useMyReviews } from "@/hooks/useMyReviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { reviews, isLoading, error, refetch } = useMyReviews();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Dashboard
            </h1>
            {user && (
              <p className="text-muted-foreground">
                Welcome back,{" "}
                <span className="font-medium text-foreground">{user.name}</span>
                . Here are your reviews.
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
        </div>
      </main>
      <Footer />
    </>
  );
}
