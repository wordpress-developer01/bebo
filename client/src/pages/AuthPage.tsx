import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
  const { login, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await signUp(form.name, form.email, form.password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-lg border border-slate-100">
        <h1 className="text-2xl font-semibold text-slate-900">
          {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Используйте тестовые данные из README для быстрого входа.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-slate-600">Имя</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Пароль</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            <p className="mt-1 text-xs text-slate-400">Минимум 6 символов.</p>
          </div>
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:bg-primary/50"
          >
            {loading ? 'Обработка...' : isLogin ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <button
          className="mt-4 w-full text-sm text-primary hover:underline"
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {isLogin ? 'Создать новый аккаунт' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}
