import { useCallback, useEffect, useState } from 'react';
import { getCurrencies } from '../services/frankfurterApi';

/** Carrega a lista de moedas uma única vez. */
export function useCurrencies() {
  const [currencies, setCurrencies] = useState({});
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setError(null);

    getCurrencies({ signal: controller.signal })
      .then((data) => {
        setCurrencies(data);
        setStatus('success');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setStatus('error');
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { currencies, status, error, reload };
}
