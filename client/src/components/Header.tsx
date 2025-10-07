import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu } from 'lucide-react';
import { useState } from 'react';

type HeaderProps = {
  onToggleSidebar: () => void;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
  }`;

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-md text-slate-500 hover:text-primary hover:bg-slate-100"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="text-xl font-semibold text-primary">
              Bebo Vitamins
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass} end>
                Каталог
              </NavLink>
              <a className="px-3 py-2 text-sm text-slate-400 cursor-not-allowed">О нас</a>
              <a className="px-3 py-2 text-sm text-slate-400 cursor-not-allowed">Контакты</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-full shadow hover:bg-primary/90"
            >
              Корзина
              {cartItems.length > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary text-xs">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary"
                >
                  {user.name}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="block w-full px-4 py-2 text-sm text-left hover:bg-slate-50"
                    >
                      Профиль
                    </button>
                    {user.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate('/admin');
                        }}
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-slate-50"
                      >
                        Админ-панель
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="block w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-red-50"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary"
              >
                Войти / Регистрация
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
