import styles from './PeriodSelector.module.css';

/**
 * Grupo de botões de período (um selecionado por vez).
 * @param {Array<{id: string, label: string}>} periods
 * @param {string} value id do período ativo
 * @param {(id: string) => void} onChange
 */
export default function PeriodSelector({ periods, value, onChange }) {
  return (
    <div className={styles.group} role="group" aria-label="Período do histórico">
      {periods.map((period) => (
        <button
          key={period.id}
          type="button"
          className={`${styles.button} ${period.id === value ? styles.active : ''}`}
          aria-pressed={period.id === value}
          onClick={() => onChange(period.id)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
