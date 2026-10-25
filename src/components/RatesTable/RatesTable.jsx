import StatusMessage from '../StatusMessage/StatusMessage';
import { formatDateBR } from '../../utils/dates';
import { formatRate } from '../../utils/amount';
import styles from './RatesTable.module.css';

function SortHeader({ field, label, sort, onSortChange }) {
  const isActive = sort.field === field;
  const ariaSort = isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';
  const arrow = isActive ? (sort.direction === 'asc' ? '▲' : '▼') : '↕';

  return (
    <th scope="col" aria-sort={ariaSort}>
      <button type="button" className={styles.sortButton} onClick={() => onSortChange(field)}>
        {label} <span aria-hidden="true">{arrow}</span>
      </button>
    </th>
  );
}

/**
 * Tabela de cotações.
 * @param {Array} records registros já filtrados e ordenados
 * @param {number} totalCount total de registros do período (antes dos filtros)
 * @param {{field: 'date'|'rate', direction: 'asc'|'desc'}} sort
 * @param {(field: string) => void} onSortChange
 * @param {React.ReactNode} exportButton botão de exportação
 */
export default function RatesTable({
  records,
  totalCount,
  sort,
  onSortChange,
  status,
  error,
  onRetry,
  exportButton,
}) {
  if (status === 'loading' || status === 'idle') {
    return <StatusMessage type="loading" message="Carregando registros..." />;
  }
  if (status === 'error') {
    return <StatusMessage type="error" message={error} onRetry={onRetry} />;
  }
  if (totalCount === 0) {
    return <StatusMessage type="empty" message="Não há cotações para este par e período." />;
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <p className={styles.count} aria-live="polite">
          {records.length} de {totalCount} registros
        </p>
        {exportButton}
      </div>

      {records.length === 0 ? (
        <StatusMessage
          type="empty"
          message="Nenhum registro encontrado com os filtros atuais."
        />
      ) : (
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="Tabela de cotações">
          <table className={styles.table}>
            <thead>
              <tr>
                <SortHeader field="date" label="Data" sort={sort} onSortChange={onSortChange} />
                <th scope="col">Origem</th>
                <th scope="col">Destino</th>
                <SortHeader field="rate" label="Cotação" sort={sort} onSortChange={onSortChange} />
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.date}>
                  <td>{formatDateBR(record.date)}</td>
                  <td>{record.from}</td>
                  <td>{record.to}</td>
                  <td className={styles.numeric}>{formatRate(record.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
