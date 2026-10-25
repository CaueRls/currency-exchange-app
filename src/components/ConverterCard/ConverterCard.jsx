import { useState } from 'react';
import CurrencySelect from '../CurrencySelect/CurrencySelect';
import StatusMessage from '../StatusMessage/StatusMessage';
import { useLatestRate } from '../../hooks/useLatestRate';
import { parseAmount, convertAmount, formatMoney, formatRate } from '../../utils/amount';
import { formatDateBR } from '../../utils/dates';
import styles from './ConverterCard.module.css';

export default function ConverterCard({
  from,
  to,
  currencies,
  onChangeFrom,
  onChangeTo,
  onSwap,
}) {
  const [amountText, setAmountText] = useState('100');

  const sameCurrency = from === to;
  const parsed = parseAmount(amountText);
  const { rate, date, status, error, reload } = useLatestRate(from, to, !sameCurrency);

  const converted = parsed.valid && rate !== null ? convertAmount(parsed.value, rate) : null;

  return (
    <section className={styles.card} aria-labelledby="converter-title">
      <h2 id="converter-title" className={styles.title}>
        Conversor
      </h2>

      <div className={styles.amountField}>
        <label htmlFor="amount" className={styles.label}>
          Valor
        </label>
        <input
          id="amount"
          className={`${styles.input} ${!parsed.valid ? styles.inputInvalid : ''}`}
          type="text"
          inputMode="decimal"
          value={amountText}
          onChange={(event) => setAmountText(event.target.value)}
          aria-invalid={!parsed.valid}
          aria-describedby={!parsed.valid ? 'amount-error' : undefined}
          placeholder="Ex.: 1500,50"
        />
        {!parsed.valid && (
          <p id="amount-error" className={styles.fieldError} role="alert">
            {parsed.error}
          </p>
        )}
      </div>

      <div className={styles.pair}>
        <CurrencySelect
          id="from-currency"
          label="De"
          value={from}
          currencies={currencies}
          onChange={onChangeFrom}
        />
        <button
          type="button"
          className={styles.swap}
          onClick={onSwap}
          aria-label="Inverter moedas de origem e destino"
          title="Inverter moedas"
        >
          ⇄
        </button>
        <CurrencySelect
          id="to-currency"
          label="Para"
          value={to}
          currencies={currencies}
          onChange={onChangeTo}
        />
      </div>

      <div className={styles.result} aria-live="polite">
        {sameCurrency && (
          <StatusMessage type="empty" message="Selecione moedas diferentes para converter." />
        )}
        {!sameCurrency && status === 'loading' && <StatusMessage type="loading" />}
        {!sameCurrency && status === 'error' && (
          <StatusMessage type="error" message={error} onRetry={reload} />
        )}
        {!sameCurrency && status === 'success' && (
          <>
            {converted !== null ? (
              <>
                <p className={styles.source}>
                  {formatMoney(parsed.value)} {from} =
                </p>
                <p className={styles.converted}>
                  {formatMoney(converted)} <span>{to}</span>
                </p>
              </>
            ) : (
              <p className={styles.source}>Informe um valor válido para ver a conversão.</p>
            )}
            <p className={styles.meta}>
              Taxa: 1 {from} = {formatRate(rate)} {to}
              <br />
              Cotação de {formatDateBR(date)}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
