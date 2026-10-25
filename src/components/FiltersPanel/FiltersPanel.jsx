import styles from './FiltersPanel.module.css';

/**
 * Painel de filtros controlado pelo componente pai (lifting state up).
 * @param {{startDate: string, endDate: string, minRate: string, maxRate: string}} filters
 * @param {{dates?: string, rates?: string}} errors
 * @param {(name: string, value: string) => void} onChange
 * @param {() => void} onClear
 * @param {boolean} canClear true se há algum filtro preenchido
 */
export default function FiltersPanel({ filters, errors, onChange, onClear, canClear }) {
  return (
    <form
      className={styles.panel}
      aria-label="Filtros da tabela"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className={styles.group}>
        <div className={styles.field}>
          <label htmlFor="filter-start" className={styles.label}>
            Data inicial
          </label>
          <input
            id="filter-start"
            type="date"
            className={styles.input}
            value={filters.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            aria-invalid={Boolean(errors.dates)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="filter-end" className={styles.label}>
            Data final
          </label>
          <input
            id="filter-end"
            type="date"
            className={styles.input}
            value={filters.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
            aria-invalid={Boolean(errors.dates)}
          />
        </div>
        {errors.dates && (
          <p className={styles.error} role="alert">
            {errors.dates}
          </p>
        )}
      </div>

      <div className={styles.group}>
        <div className={styles.field}>
          <label htmlFor="filter-min" className={styles.label}>
            Cotação mínima
          </label>
          <input
            id="filter-min"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: 1,05"
            className={styles.input}
            value={filters.minRate}
            onChange={(e) => onChange('minRate', e.target.value)}
            aria-invalid={Boolean(errors.rates)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="filter-max" className={styles.label}>
            Cotação máxima
          </label>
          <input
            id="filter-max"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: 1,20"
            className={styles.input}
            value={filters.maxRate}
            onChange={(e) => onChange('maxRate', e.target.value)}
            aria-invalid={Boolean(errors.rates)}
          />
        </div>
        {errors.rates && (
          <p className={styles.error} role="alert">
            {errors.rates}
          </p>
        )}
      </div>

      <button type="button" className={styles.clear} onClick={onClear} disabled={!canClear}>
        Limpar filtros
      </button>
    </form>
  );
}
