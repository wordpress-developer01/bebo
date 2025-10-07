import { useEffect, useState } from 'react';
import { http } from '../api/http';
import { Product } from '../types/api';

const emptyForm = {
  title: '',
  description: '',
  priceCents: 1500,
  categoryId: 1,
  imagePath: '/assets/products/vitamin-1.svg',
  stock: 10,
  rating: 4.5,
  form: 'капсулы',
  brand: 'Sunrise Labs'
};

type Category = { id: number; name: string };

export function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      http.get<Product[]>('/admin/products'),
      http.get<Category[]>('/products/categories/all')
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, form: form.form || undefined, brand: form.brand || undefined };
      if (editingId) {
        await http.put(`/admin/products/${editingId}`, payload);
        setMessage('Товар обновлен');
      } else {
        await http.post('/admin/products', payload);
        setMessage('Товар создан');
      }
      setForm({ ...emptyForm });
      setEditingId(null);
      loadData();
    } catch (error: any) {
      setMessage(error.response?.data?.message ?? 'Ошибка сохранения');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      priceCents: product.priceCents,
      categoryId: product.categoryId,
      imagePath: product.imagePath,
      stock: product.stock,
      rating: product.rating,
      form: product.form ?? 'капсулы',
      brand: product.brand ?? 'Без бренда'
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    await http.delete(`/admin/products/${id}`);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900">Администрирование</h1>
      </div>

      {message && <div className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100"
      >
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-600">Название</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-600">Описание</label>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Категория</label>
          <select
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm((prev) => ({ ...prev, categoryId: Number(e.target.value) }))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Цена (в копейках)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.priceCents}
            onChange={(e) => setForm((prev) => ({ ...prev, priceCents: Number(e.target.value) }))}
            min={0}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Склад</label>
          <input
            type="number"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.stock}
            onChange={(e) => setForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
            min={0}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Рейтинг</label>
          <input
            type="number"
            step="0.1"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.rating}
            onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
            min={0}
            max={5}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Форма</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.form}
            onChange={(e) => setForm((prev) => ({ ...prev, form: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Бренд</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.brand}
            onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-600">Путь к изображению</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.imagePath}
            onChange={(e) => setForm((prev) => ({ ...prev, imagePath: e.target.value }))}
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            {editingId ? 'Сохранить изменения' : 'Создать товар'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Каталог</h2>
        {loading ? (
          <div className="h-40 rounded-2xl bg-white/70 animate-pulse" />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Название</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Цена</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Категория</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{product.id}</td>
                    <td className="px-4 py-3 text-slate-900">{product.title}</td>
                    <td className="px-4 py-3">{(product.priceCents / 100).toFixed(2)} ₽</td>
                    <td className="px-4 py-3">{product.category?.name}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={() => handleEdit(product)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="text-xs font-medium text-red-500 hover:underline"
                        onClick={() => handleDelete(product.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
