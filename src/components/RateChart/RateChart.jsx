import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatusMessage from '../StatusMessage/StatusMessage';
import { formatDateBR } from '../../utils/dates';
import { formatRate } from '../../utils/amount';
import styles from './RateChart.module.css';

/**
 * Gráfico de linha da cotação ao longo do tempo.
 * @param {Array<{date: string, rate: number}>} records em ordem de data crescente
 * @param {'idle'|'loading'|'success'|'error'} status
 */
export default function RateChart({ records, from, to, status, error, onRetry }) {
  if (status === 'loading' || status === 'idle') {
    return <StatusMessage type="loading" message="Carregando histórico..." />;
  }
  if (status === 'error') {
    return <StatusMessage type="error" message={error} onRetry={onRetry} />;
  }
  if (records.length === 0) {
    return (
      <StatusMessage type="empty" message="Não há cotações publicadas para este período." />
    );
  }

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>
        1 {from} em {to}
      </figcaption>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={records} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#e6e9f2" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateBR}
              minTickGap={48}
              tick={{ fontSize: 12, fill: '#5b6785' }}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(v) => formatRate(v)}
              width={70}
              tick={{ fontSize: 12, fill: '#5b6785' }}
            />
            <Tooltip
              labelFormatter={formatDateBR}
              formatter={(value) => [formatRate(value), `${from} → ${to}`]}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#1d4ed8"
              strokeWidth={2}
              dot={records.length <= 40}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
