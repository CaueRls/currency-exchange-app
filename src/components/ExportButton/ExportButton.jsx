import { downloadCsv } from '../../utils/csv';
import styles from './ExportButton.module.css';

/**
 * Exporta em CSV exatamente os registros recebidos (já filtrados e ordenados).
 * Fica desabilitado quando não há registros (RF15).
 */
export default function ExportButton({ records }) {
  const isEmpty = records.length === 0;

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => downloadCsv(records)}
      disabled={isEmpty}
      title={isEmpty ? 'Não há registros para exportar' : 'Baixar os registros filtrados em CSV'}
    >
      Exportar CSV
    </button>
  );
}
