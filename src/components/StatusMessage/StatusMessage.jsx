import styles from './StatusMessage.module.css';

const DEFAULT_MESSAGES = {
  loading: 'Carregando dados...',
  error: 'Ocorreu um erro.',
  empty: 'Nenhum dado encontrado.',
};

/**
 * Mensagem padronizada para loading, erro e ausência de dados.
 * @param {'loading'|'error'|'empty'} type
 * @param {string} [message]
 * @param {() => void} [onRetry] mostra o botão "Tentar novamente" no erro
 */
export default function StatusMessage({ type, message, onRetry }) {
  const text = message || DEFAULT_MESSAGES[type];

  return (
    <div
      className={`${styles.box} ${styles[type]}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      {type === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
      <p className={styles.text}>{text}</p>
      {type === 'error' && onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
