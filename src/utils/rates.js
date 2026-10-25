/**
 * Converte o JSON de série temporal da Frankfurter em uma lista de registros.
 *
 * Entrada (exemplo):
 * { base: 'EUR', start_date: '2026-01-02', end_date: '2026-01-05',
 *   rates: { '2026-01-02': { USD: 1.1 }, '2026-01-05': { USD: 1.2 } } }
 *
 * Saída: [{ date: '2026-01-02', from: 'EUR', to: 'USD', rate: 1.1 }, ...]
 * ordenada por data crescente.
 */
export function normalizeTimeSeries(data, from, to) {
  if (!data || typeof data.rates !== 'object' || data.rates === null) {
    return [];
  }

  return Object.entries(data.rates)
    .filter(([, dayRates]) => dayRates && typeof dayRates[to] === 'number')
    .map(([date, dayRates]) => ({ date, from, to, rate: dayRates[to] }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
