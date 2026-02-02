import { useState, useCallback, useEffect } from 'react';

/**
 * Хук для управления асинхронными операциями с loading/error/data
 */
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      return response;
    } catch (err) {
      setError(err as E);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return { execute, loading, error, data };
};

/**
 * Хук для управления состоянием модального окна
 */
export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
};

/**
 * Хук для управления фильтром и сортировкой
 */
export const useFilter = <T extends Record<string, any>>(initialFilters: T) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters,
  };
};

/**
 * Хук для пагинации
 */
export const usePagination = (initialPage = 1, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return {
    currentPage,
    pageSize,
    goToPage: (page: number) => setCurrentPage(Math.max(1, page)),
    nextPage: () => setCurrentPage((prev) => prev + 1),
    prevPage: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
    offset: (currentPage - 1) * pageSize,
  };
};

/**
 * Хук для дебоунса
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
