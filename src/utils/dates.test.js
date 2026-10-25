import { describe, it, expect } from 'vitest';
import { PERIODS } from '../constants/periods';
import { getStartDateForPeriod, formatDateBR, toISODate } from './dates';

const end = new Date(Date.UTC(2026, 9, 25)); // 25/10/2026
const period = (id) => PERIODS.find((p) => p.id === id);

describe('getStartDateForPeriod', () => {
  it('7 dias', () => expect(getStartDateForPeriod(period('7d'), end)).toBe('2026-10-18'));
  it('15 dias', () => expect(getStartDateForPeriod(period('15d'), end)).toBe('2026-10-10'));
  it('30 dias', () => expect(getStartDateForPeriod(period('30d'), end)).toBe('2026-09-25'));
  it('3 meses', () => expect(getStartDateForPeriod(period('3m'), end)).toBe('2026-07-25'));
  it('6 meses', () => expect(getStartDateForPeriod(period('6m'), end)).toBe('2026-04-25'));
  it('1 ano', () => expect(getStartDateForPeriod(period('1y'), end)).toBe('2025-10-25'));
  it('5 anos', () => expect(getStartDateForPeriod(period('5y'), end)).toBe('2021-10-25'));
  it('10 anos', () => expect(getStartDateForPeriod(period('10y'), end)).toBe('2016-10-25'));

  it('ajusta fim de mês curto (31/05 - 3 meses = 28/02)', () => {
    const may31 = new Date(Date.UTC(2026, 4, 31));
    expect(getStartDateForPeriod(period('3m'), may31)).toBe('2026-02-28');
  });
  it('ajusta ano bissexto (29/02/2028 - 1 ano = 28/02/2027)', () => {
    const leap = new Date(Date.UTC(2028, 1, 29));
    expect(getStartDateForPeriod(period('1y'), leap)).toBe('2027-02-28');
  });
});

describe('formatDateBR / toISODate', () => {
  it('formata AAAA-MM-DD em DD/MM/AAAA', () => {
    expect(formatDateBR('2026-10-25')).toBe('25/10/2026');
  });
  it('converte Date em ISO (UTC)', () => {
    expect(toISODate(end)).toBe('2026-10-25');
  });
});
