import type { ProductListItem } from "@/lib/api";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductListItem[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <div key={product.id} style={{ animationDelay: `${i * 80}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
