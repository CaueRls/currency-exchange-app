import { useCallback, useEffect, useState } from 'react';
import { getLatestRate } from '../services/frankfurterApi';

/**
 * Busca a taxa mais recente do par from → to.
 * Se `enabled` for false (ex.: moedas iguais), não consulta a API.
 */
export function useLatestRate(from, to, enabled = true) {
  const [data, setData] = useState({ rate: null, date: null });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || !from || !to) {
      setStatus('idle');
      setData({ rate: null, date: null });
      return undefined;
    }

    const controller = new AbortController();
    setStatus('loading');
    setError(null);

    getLatestRate(from, to, { signal: controller.signal })
      .then((result) => {
        setData(result);
        setStatus('success');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setData({ rate: null, date: null });
        setError(err.message);
        setStatus('error');
      });

    return () => controller.abort();
  }, [from, to, enabled, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { rate: data.rate, date: data.date, status, error, reload };
}
