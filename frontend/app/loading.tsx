import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";

export default function Loading() {
  return (
    <main className="flex-1 pt-40 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-4xl mx-auto text-center">
          <div className="mb-6 mx-auto skeleton-shimmer h-5 w-40 rounded-full" />
          <div className="mx-auto skeleton-shimmer h-20 w-full max-w-2xl rounded-xl" />
          <div className="mt-6 mx-auto skeleton-shimmer h-6 w-80 rounded" />
          <div className="mt-12 mx-auto max-w-2xl skeleton-shimmer h-14 rounded-[calc(var(--radius-4xl)+0.25rem)]" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-7 md:row-span-2">
            <ProductCardSkeleton />
          </div>
          <div className="md:col-span-5">
            <ProductCardSkeleton />
          </div>
          <div className="md:col-span-5">
            <ProductCardSkeleton />
          </div>
          <div className="md:col-span-7">
            <ProductCardSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
