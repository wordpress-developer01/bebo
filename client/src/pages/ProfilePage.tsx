import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { http } from '../api/http';
import { Order } from '../types/api';
import { resolveAsset } from '../utils/assets';

export function ProfilePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    http
      .get<Order[]>('/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-semibold text-slate-900">Здравствуйте, {user.name}</h1>
        <p className="text-sm text-slate-500">{user.email}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-primary">Роль: {user.role}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Мои заказы</h2>
        {loading ? (
          <div className="h-40 rounded-2xl bg-white/70 animate-pulse" />
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center text-slate-500">
            У вас пока нет заказов.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                  <span>Заказ №{order.id}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-primary text-xs">{order.status}</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {item.product?.imagePath && (
                          <img src={resolveAsset(item.product.imagePath)} alt={item.product?.title ?? 'Товар'} className="h-10 w-10 rounded-lg object-cover" />
                        )}
                        <span className="text-slate-700">{item.product?.title ?? `Товар #${item.productId}`} × {item.qty}</span>
                      </div>
                      <span className="font-medium text-slate-900">{((item.unitPriceCents * item.qty) / 100).toFixed(2)} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right text-lg font-semibold text-slate-900">
                  {(order.totalCents / 100).toFixed(2)} ₽
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
