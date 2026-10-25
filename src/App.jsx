import { useState } from 'react';
import Header from './components/Header/Header';
import ConverterCard from './components/ConverterCard/ConverterCard';
import HistorySection from './components/HistorySection/HistorySection';
import StatusMessage from './components/StatusMessage/StatusMessage';
import { useCurrencies } from './hooks/useCurrencies';
import { DEFAULT_FROM, DEFAULT_TO } from './constants/periods';
import styles from './App.module.css';

export default function App() {
  // O par de moedas é compartilhado pelo conversor e pelo histórico,
  // por isso o estado fica no componente pai.
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const { currencies, status, error, reload } = useCurrencies();

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        {status === 'loading' && <StatusMessage type="loading" message="Carregando moedas..." />}
        {status === 'error' && <StatusMessage type="error" message={error} onRetry={reload} />}
        {status === 'success' && (
          <div className={styles.layout}>
            <ConverterCard
              from={from}
              to={to}
              currencies={currencies}
              onChangeFrom={setFrom}
              onChangeTo={setTo}
              onSwap={handleSwap}
            />
            <HistorySection from={from} to={to} />
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        Dados: Frankfurter API (taxas de referência do Banco Central Europeu). Valores
        meramente informativos.
      </footer>
    </>
  );
}
