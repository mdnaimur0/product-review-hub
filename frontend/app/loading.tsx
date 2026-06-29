import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";

export default function Loading() {
  return (
    <main className="flex-1 pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-20 space-y-4 text-center">
          <div className="mx-auto h-16 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-6 w-80 max-w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
