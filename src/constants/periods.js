// Períodos disponíveis para o histórico.
// `unit` e `amount` são usados por getStartDateForPeriod (utils/dates.js).
export const PERIODS = [
  { id: '7d', label: '7 dias', unit: 'day', amount: 7 },
  { id: '15d', label: '15 dias', unit: 'day', amount: 15 },
  { id: '30d', label: '30 dias', unit: 'day', amount: 30 },
  { id: '3m', label: '3 meses', unit: 'month', amount: 3 },
  { id: '6m', label: '6 meses', unit: 'month', amount: 6 },
  { id: '1y', label: '1 ano', unit: 'year', amount: 1 },
  { id: '5y', label: '5 anos', unit: 'year', amount: 5 },
  { id: '10y', label: '10 anos', unit: 'year', amount: 10 },
];

export const DEFAULT_PERIOD_ID = '30d';
export const DEFAULT_FROM = 'EUR';
export const DEFAULT_TO = 'USD';
