import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../api/http';
import { Product } from '../types/api';
import { useCart } from '../context/CartContext';
import { resolveAsset } from '../utils/assets';

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    http
      .get<Product>(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white/80" />;
  }

  if (!product) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center text-slate-500">
        Товар не найден.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <img src={resolveAsset(product.imagePath)} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary">{product.category?.name}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{product.title}</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">{product.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
          <div>
            <p className="font-medium text-slate-900">Рейтинг</p>
            <p>⭐ {product.rating.toFixed(1)}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Форма</p>
            <p>{product.form ?? '—'}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Бренд</p>
            <p>{product.brand ?? '—'}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Наличие</p>
            <p>{product.stock > 0 ? `В наличии (${product.stock} шт.)` : 'Нет в наличии'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-semibold text-slate-900">{(product.priceCents / 100).toFixed(2)} ₽</span>
          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
}
