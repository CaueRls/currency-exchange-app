import { useState } from 'react';
import PeriodSelector from '../PeriodSelector/PeriodSelector';
import RateChart from '../RateChart/RateChart';
import FiltersPanel from '../FiltersPanel/FiltersPanel';
import RatesTable from '../RatesTable/RatesTable';
import ExportButton from '../ExportButton/ExportButton';
import StatusMessage from '../StatusMessage/StatusMessage';
import { PERIODS, DEFAULT_PERIOD_ID } from '../../constants/periods';
import { useExchangeHistory } from '../../hooks/useExchangeHistory';
import { useRecordFilters } from '../../hooks/useRecordFilters';
import styles from './HistorySection.module.css';

/**
 * Orquestra o histórico: período, consulta, filtros, ordenação, gráfico e tabela.
 * Os estados de filtro/ordenação ficam aqui (e no hook) para que o painel de filtros
 * e a tabela compartilhem os mesmos dados (lifting state up).
 */
export default function HistorySection({ from, to }) {
  const [periodId, setPeriodId] = useState(DEFAULT_PERIOD_ID);
  const sameCurrency = from === to;

  const { records, status, error, reload } = useExchangeHistory(
    from,
    to,
    periodId,
    !sameCurrency,
  );

  const { filters, sort, errors, visibleRecords, isFiltering, setFilter, clearFilters, toggleSort } =
    useRecordFilters(records);

  return (
    <section className={styles.section} aria-labelledby="history-title">
      <div className={styles.header}>
        <h2 id="history-title" className={styles.title}>
          Histórico {from} → {to}
        </h2>
        <PeriodSelector periods={PERIODS} value={periodId} onChange={setPeriodId} />
      </div>

      {sameCurrency ? (
        <StatusMessage type="empty" message="Selecione moedas diferentes para ver o histórico." />
      ) : (
        <>
          <RateChart
            records={records}
            from={from}
            to={to}
            status={status}
            error={error}
            onRetry={reload}
          />

          <h3 className={styles.subtitle}>Registros</h3>
          <FiltersPanel
            filters={filters}
            errors={errors}
            onChange={setFilter}
            onClear={clearFilters}
            canClear={isFiltering}
          />
          <RatesTable
            records={visibleRecords}
            totalCount={records.length}
            sort={sort}
            onSortChange={toggleSort}
            status={status}
            error={error}
            onRetry={reload}
            exportButton={<ExportButton records={visibleRecords} />}
          />
        </>
      )}
    </section>
  );
}
