import { useEffect, useState } from 'react';
import { http } from '../api/http';
import { useFilters } from '../context/FilterContext';
import { X } from 'lucide-react';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

type Category = { id: number; name: string };

const formOptions = ['капсулы', 'таблетки', 'жевательные пастилки', 'шипучие таблетки', 'капли', 'софтгель'];
const brandOptions = [
  'Sunrise Labs',
  'Focus+ Nutrition',
  'Nordic Light',
  'Shield Pharma',
  'Citrus Bloom',
  'Sunny Drops',
  'Daily Balance',
  'Golden Immunity',
  'SoftGels Co.',
  'Spark Labs',
  'Без бренда'
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const { filters, setFilters, clearFilters } = useFilters();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    http
      .get<Category[]>('/products/categories/all')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const baseClasses = 'bg-white/90 backdrop-blur border-r border-slate-200 w-64 p-6 space-y-6 hidden lg:block';
  const mobileClasses = `fixed inset-y-0 left-0 z-40 w-64 transform bg-white p-6 shadow-xl transition-transform lg:hidden ${
    open ? 'translate-x-0' : '-translate-x-full'
  }`;

  const content = (
    <div className="space-y-6 text-sm text-slate-600">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Категории</h2>
        <button className="lg:hidden text-slate-400" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => setFilters({ category: null })}
          className={`block w-full text-left rounded-md px-3 py-2 transition-colors ${
            !filters.category ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
          }`}
        >
          Все товары
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilters({ category: category.name })}
            className={`block w-full text-left rounded-md px-3 py-2 transition-colors ${
              filters.category === category.name ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Макс. цена</h3>
        <input
          type="range"
          min={1000}
          max={4000}
          step={100}
          value={filters.maxPrice ?? 4000}
          onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
          className="w-full"
        />
        <p className="mt-1 text-xs text-slate-500">
          До {(filters.maxPrice ?? 4000) / 100} ₽
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Форма</h3>
        <div className="space-y-2">
          {formOptions.map((form) => (
            <label key={form} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="form"
                checked={filters.form === form}
                onChange={() => setFilters({ form })}
              />
              <span>{form}</span>
            </label>
          ))}
          <button className="text-xs text-primary" onClick={() => setFilters({ form: null })}>
            Сбросить
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Бренд</h3>
        <select
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={filters.brand ?? ''}
          onChange={(e) => setFilters({ brand: e.target.value || null })}
        >
          <option value="">Все бренды</option>
          {brandOptions.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Поиск</h3>
        <input
          type="search"
          placeholder="Найти витамин"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>

      <button
        onClick={() => {
          clearFilters();
          onClose();
        }}
        className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Сбросить фильтры
      </button>
    </div>
  );

  return (
    <>
      <aside className={baseClasses}>{content}</aside>
      <aside className={mobileClasses}>{content}</aside>
      {open && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
    </>
  );
}
