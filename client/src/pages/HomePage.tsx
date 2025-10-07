import { useEffect, useMemo, useState } from 'react';
import { http } from '../api/http';
import { Product } from '../types/api';
import { useFilters } from '../context/FilterContext';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const { filters } = useFilters();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    http
      .get<{ items: Product[] }>('/products', {
        params: {
          category: filters.category ?? undefined,
          q: filters.search || undefined
        }
      })
      .then((res) => setProducts(res.data.items))
      .finally(() => setLoading(false));
  }, [filters.category, filters.search]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.maxPrice && product.priceCents > filters.maxPrice) {
        return false;
      }
      if (filters.form && product.form !== filters.form) {
        return false;
      }
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }
      return true;
    });
  }, [products, filters.maxPrice, filters.form, filters.brand]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900">Подборки витаминов</h1>
        <p className="text-slate-500">
          Ухаживайте за собой и близкими с тщательно подобранными комплексами.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-72 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center text-slate-500">
          По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
