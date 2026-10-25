import { useCallback, useEffect, useState } from 'react';
import { PERIODS } from '../constants/periods';
import { getTimeSeries } from '../services/frankfurterApi';
import { getStartDateForPeriod, toISODate } from '../utils/dates';

/**
 * Busca a série histórica do par para o período escolhido.
 * Refaz a consulta quando o par, o período ou `reload` mudam.
 */
export function useExchangeHistory(from, to, periodId, enabled = true) {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || !from || !to) {
      setRecords([]);
      setStatus('idle');
      return undefined;
    }

    const period = PERIODS.find((p) => p.id === periodId);
    const today = new Date();
    const startDate = getStartDateForPeriod(period, today);
    const endDate = toISODate(today);

    const controller = new AbortController();
    setStatus('loading');
    setError(null);

    getTimeSeries(from, to, startDate, endDate, { signal: controller.signal })
      .then((data) => {
        setRecords(data);
        setStatus('success');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setRecords([]);
        setError(err.message);
        setStatus('error');
      });

    return () => controller.abort();
  }, [from, to, periodId, enabled, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { records, status, error, reload };
}
