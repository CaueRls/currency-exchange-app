// A API Frankfurter trabalha com datas em UTC (AAAA-MM-DD).
// Por isso todas as funções aqui usam métodos UTC.

/** Converte um Date para 'AAAA-MM-DD' (UTC). */
export function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Calcula a data inicial de um período, contando para trás a partir de `endDate`.
 * @param {{unit: 'day'|'month'|'year', amount: number}} period
 * @param {Date} [endDate]
 * @returns {string} data inicial no formato AAAA-MM-DD
 */
export function getStartDateForPeriod(period, endDate = new Date()) {
  const start = new Date(
    Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()),
  );

  if (period.unit === 'day') {
    start.setUTCDate(start.getUTCDate() - period.amount);
  } else if (period.unit === 'month') {
    const day = start.getUTCDate();
    start.setUTCDate(1); // evita "estouro" de mês (ex.: 31 → mês de 30 dias)
    start.setUTCMonth(start.getUTCMonth() - period.amount);
    const lastDay = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0),
    ).getUTCDate();
    start.setUTCDate(Math.min(day, lastDay));
  } else if (period.unit === 'year') {
    const day = start.getUTCDate();
    const month = start.getUTCMonth();
    start.setUTCDate(1);
    start.setUTCFullYear(start.getUTCFullYear() - period.amount);
    const lastDay = new Date(Date.UTC(start.getUTCFullYear(), month + 1, 0)).getUTCDate();
    start.setUTCMonth(month);
    start.setUTCDate(Math.min(day, lastDay));
  } else {
    throw new Error(`Unidade de período desconhecida: ${period.unit}`);
  }

  return toISODate(start);
}

/** 'AAAA-MM-DD' → 'DD/MM/AAAA' (sem usar Date, para não sofrer com fuso). */
export function formatDateBR(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
