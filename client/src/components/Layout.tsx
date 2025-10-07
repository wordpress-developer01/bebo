import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FilterProvider } from '../context/FilterContext';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <FilterProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="flex flex-1">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-6 lg:ml-64 transition-all">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </FilterProvider>
  );
}

