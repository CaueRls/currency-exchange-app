import { useCallback, useMemo, useState } from 'react';
import {
  EMPTY_FILTERS,
  filterRecords,
  sortRecords,
  validateFilters,
  hasActiveFilters,
} from '../utils/filters';

/**
 * Guarda filtros e ordenação e devolve a lista derivada (filtrada e ordenada).
 * @param {Array} records registros do período
 */
export function useRecordFilters(records) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState({ field: 'date', direction: 'desc' }); // RN11

  const errors = useMemo(() => validateFilters(filters), [filters]);

  const visibleRecords = useMemo(
    () => sortRecords(filterRecords(records, filters), sort.field, sort.direction),
    [records, filters, sort],
  );

  const setFilter = useCallback((name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
  }, []);

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  /** Clicar no mesmo campo inverte a direção; em outro campo, começa crescente. */
  const toggleSort = useCallback((field) => {
    setSort((current) =>
      current.field === field
        ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' },
    );
  }, []);

  return {
    filters,
    sort,
    errors,
    visibleRecords,
    isFiltering: hasActiveFilters(filters),
    setFilter,
    clearFilters,
    toggleSort,
  };
}
