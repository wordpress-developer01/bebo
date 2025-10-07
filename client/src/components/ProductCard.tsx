import { Link } from 'react-router-dom';
import { Product } from '../types/api';
import { useCart } from '../context/CartContext';
import { resolveAsset } from '../utils/assets';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="relative">
        <img src={resolveAsset(product.imagePath)} alt={product.title} className="w-full h-48 object-cover" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600">
          {product.category?.name}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <Link to={`/products/${product.id}`} className="text-lg font-semibold text-slate-900 hover:text-primary">
          {product.title}
        </Link>
        <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>⭐ {product.rating.toFixed(1)}</span>
          {product.form && <span>{product.form}</span>}
        </div>
        {product.brand && <p className="text-xs uppercase tracking-wide text-slate-400">{product.brand}</p>}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-semibold text-slate-900">{(product.priceCents / 100).toFixed(2)} ₽</span>
          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}
