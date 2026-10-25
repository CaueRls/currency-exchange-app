import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Currency Exchange</h1>
        <p className={styles.subtitle}>
          Converta valores, acompanhe o histórico e exporte cotações. Dados do Banco Central
          Europeu via Frankfurter.
        </p>
      </div>
    </header>
  );
}
