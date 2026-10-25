import styles from './CurrencySelect.module.css';

/**
 * Seletor controlado de moeda.
 * @param {string} id identificador para associar o label
 * @param {string} label texto visível
 * @param {string} value código da moeda selecionada (ex.: 'EUR')
 * @param {Object<string,string>} currencies mapa código → nome
 * @param {(code: string) => void} onChange
 */
export default function CurrencySelect({ id, label, value, currencies, onChange }) {
  const codes = Object.keys(currencies).sort();

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {codes.map((code) => (
          <option key={code} value={code}>
            {code} — {currencies[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
