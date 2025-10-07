import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { resolveAsset } from '../utils/assets';

export function CartPage() {
  const { cartItems, removeFromCart, updateQty, totalCents } = useCart();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">Корзина</h1>
        {cartItems.length > 0 && (
          <button
            onClick={() => navigate('/checkout')}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Оформить заказ
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center text-slate-500">
          Ваша корзина пуста. Добавьте витамины из каталога.
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
            >
              <img
                src={resolveAsset(item.product.imagePath)}
                alt={item.product.title}
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <p className="text-lg font-semibold text-slate-900">{item.product.title}</p>
                <p className="text-sm text-slate-500">{item.product.form}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="h-8 w-8 rounded-full border border-slate-200 text-slate-600"
                  onClick={() => updateQty(item.product.id, item.qty - 1)}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                <button
                  className="h-8 w-8 rounded-full border border-slate-200 text-slate-600"
                  onClick={() => updateQty(item.product.id, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900">
                  {((item.product.priceCents * item.qty) / 100).toFixed(2)} ₽
                </p>
                <button
                  className="text-xs text-red-500 hover:underline"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-6 py-4 text-white">
            <span className="text-sm uppercase tracking-wide text-white/80">Итого</span>
            <span className="text-2xl font-semibold">{(totalCents / 100).toFixed(2)} ₽</span>
          </div>
        </div>
      )}
    </div>
  );
}
