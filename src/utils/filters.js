export const EMPTY_FILTERS = {
  startDate: '',
  endDate: '',
  minRate: '',
  maxRate: '',
};

/** Converte texto digitado em número (aceita vírgula). Vazio ou inválido → null. */
function toNumberOrNull(text) {
  const clean = String(text ?? '').trim().replace(',', '.');
  if (clean === '') return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

/** Retorna true se algum filtro estiver preenchido. */
export function hasActiveFilters(filters) {
  return Object.values(filters).some((value) => String(value).trim() !== '');
}

/**
 * Valida os filtros (RN09).
 * @returns {{ dates?: string, rates?: string }} mensagens de erro por grupo
 */
export function validateFilters(filters) {
  const errors = {};

  if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
    errors.dates = 'A data inicial não pode ser maior que a final.';
  }

  const min = toNumberOrNull(filters.minRate);
  const max = toNumberOrNull(filters.maxRate);

  if (String(filters.minRate).trim() !== '' && min === null) {
    errors.rates = 'Cotação mínima inválida.';
  } else if (String(filters.maxRate).trim() !== '' && max === null) {
    errors.rates = 'Cotação máxima inválida.';
  } else if (min !== null && max !== null && min > max) {
    errors.rates = 'A cotação mínima não pode ser maior que a máxima.';
  }

  return errors;
}

/**
 * Aplica os filtros combinados (E lógico, datas inclusivas — RN08).
 * Filtros inválidos retornam lista vazia (RN09).
 */
export function filterRecords(records, filters) {
  if (Object.keys(validateFilters(filters)).length > 0) return [];

  const min = toNumberOrNull(filters.minRate);
  const max = toNumberOrNull(filters.maxRate);

  return records.filter((record) => {
    if (filters.startDate && record.date < filters.startDate) return false;
    if (filters.endDate && record.date > filters.endDate) return false;
    if (min !== null && record.rate < min) return false;
    if (max !== null && record.rate > max) return false;
    return true;
  });
}

/**
 * Ordena sem alterar o array original.
 * @param {'date'|'rate'} field
 * @param {'asc'|'desc'} direction
 */
export function sortRecords(records, field, direction) {
  const factor = direction === 'asc' ? 1 : -1;

  return [...records].sort((a, b) => {
    if (field === 'rate') return (a.rate - b.rate) * factor;
    return a.date.localeCompare(b.date) * factor;
  });
}
