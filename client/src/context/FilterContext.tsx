import { createContext, useContext, useMemo, useState } from 'react';

export type Filters = {
  category: string | null;
  form: string | null;
  brand: string | null;
  maxPrice: number | null;
  search: string;
};

type FilterContextValue = {
  filters: Filters;
  setFilters: (update: Partial<Filters>) => void;
  clearFilters: () => void;
};

const defaultFilters: Filters = {
  category: null,
  form: null,
  brand: null,
  maxPrice: null,
  search: ''
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);

  const setFilters = (update: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...update }));
  };

  const clearFilters = () => setFiltersState(defaultFilters);

  const value = useMemo(() => ({ filters, setFilters, clearFilters }), [filters]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return ctx;
}
