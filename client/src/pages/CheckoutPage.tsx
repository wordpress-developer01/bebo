import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { http } from '../api/http';

export function CheckoutPage() {
  const { cartItems, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ items: { productId: number; title: string; qty: number; totalCents: number }[]; totalCents: number } | null>(null);

  useEffect(() => {
    if (cartItems.length === 0) return;
    const payload = {
      items: cartItems.map((item) => ({ productId: item.product.id, qty: item.qty }))
    };
    http
      .post('/cart', payload)
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null));
  }, [cartItems]);

  const handleCheckout = async () => {
    setError(null);
    if (cartItems.length === 0) {
      setError('Корзина пуста');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        items: cartItems.map((item) => ({ productId: item.product.id, qty: item.qty }))
      };
      await http.post('/orders', payload);
      clear();
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Не удалось оформить заказ');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Оформление заказа</h1>
          <p className="text-slate-500">Проверьте корзину и подтвердите покупку.</p>
        </div>
      </div>

      {summary ? (
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="space-y-3">
            {summary.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm text-slate-600">
                <span>
                  {item.title} × {item.qty}
                </span>
                <span>{(item.totalCents / 100).toFixed(2)} ₽</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
            <span>Итого</span>
            <span>{(summary.totalCents / 100).toFixed(2)} ₽</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center text-slate-500">
          Чтобы оформить заказ, добавьте товары в корзину.
        </div>
      )}

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="flex justify-end">
        <button
          onClick={handleCheckout}
          disabled={submitting || cartItems.length === 0}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? 'Отправка...' : 'Подтвердить заказ'}
        </button>
      </div>
    </div>
  );
}
