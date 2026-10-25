import { describe, it, expect } from 'vitest';
import {
  EMPTY_FILTERS,
  filterRecords,
  sortRecords,
  validateFilters,
  hasActiveFilters,
} from './filters';

const records = [
  { date: '2026-01-02', from: 'EUR', to: 'USD', rate: 1.1 },
  { date: '2026-01-03', from: 'EUR', to: 'USD', rate: 1.3 },
  { date: '2026-01-06', from: 'EUR', to: 'USD', rate: 1.2 },
  { date: '2026-01-07', from: 'EUR', to: 'USD', rate: 1.5 },
];
const f = (patch) => ({ ...EMPTY_FILTERS, ...patch });

describe('filterRecords', () => {
  it('sem filtros devolve tudo', () => {
    expect(filterRecords(records, EMPTY_FILTERS)).toHaveLength(4);
  });
  it('filtra por data inicial (inclusiva)', () => {
    expect(filterRecords(records, f({ startDate: '2026-01-03' }))).toHaveLength(3);
  });
  it('filtra por data final (inclusiva)', () => {
    expect(filterRecords(records, f({ endDate: '2026-01-03' }))).toHaveLength(2);
  });
  it('filtra por cotação mínima e máxima', () => {
    expect(filterRecords(records, f({ minRate: '1,2', maxRate: '1.3' }))).toHaveLength(2);
  });
  it('combina datas e cotação', () => {
    const result = filterRecords(
      records,
      f({ startDate: '2026-01-03', endDate: '2026-01-06', minRate: '1.25' }),
    );
    expect(result.map((r) => r.date)).toEqual(['2026-01-03']);
  });
  it('retorna vazio quando nenhum registro atende', () => {
    expect(filterRecords(records, f({ minRate: '9' }))).toEqual([]);
  });
  it('intervalo de datas invertido retorna vazio', () => {
    expect(filterRecords(records, f({ startDate: '2026-02-01', endDate: '2026-01-01' }))).toEqual([]);
  });
  it('mínima maior que máxima retorna vazio', () => {
    expect(filterRecords(records, f({ minRate: '2', maxRate: '1' }))).toEqual([]);
  });
});

describe('validateFilters / hasActiveFilters', () => {
  it('detecta datas invertidas', () => {
    expect(validateFilters(f({ startDate: '2026-02-01', endDate: '2026-01-01' })).dates).toBeTruthy();
  });
  it('detecta cotação inválida', () => {
    expect(validateFilters(f({ minRate: 'abc' })).rates).toBeTruthy();
  });
  it('filtros vazios não têm erro', () => {
    expect(validateFilters(EMPTY_FILTERS)).toEqual({});
  });
  it('hasActiveFilters', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(hasActiveFilters(f({ minRate: '1' }))).toBe(true);
  });
});

describe('sortRecords', () => {
  it('ordena por data decrescente', () => {
    expect(sortRecords(records, 'date', 'desc')[0].date).toBe('2026-01-07');
  });
  it('ordena por cotação crescente', () => {
    expect(sortRecords(records, 'rate', 'asc').map((r) => r.rate)).toEqual([1.1, 1.2, 1.3, 1.5]);
  });
  it('não altera o array original', () => {
    const copy = [...records];
    sortRecords(records, 'rate', 'desc');
    expect(records).toEqual(copy);
  });
});
