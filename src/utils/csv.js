const HEADERS = ['data', 'moeda_origem', 'moeda_destino', 'cotacao'];

/** Protege um campo para CSV (aspas, vírgula ou quebra de linha). */
function escapeField(value) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Gera o texto CSV com cabeçalho. Cotação usa ponto decimal.
 * @returns {string}
 */
export function recordsToCsv(records) {
  const lines = [HEADERS.join(',')];
  for (const r of records) {
    lines.push([r.date, r.from, r.to, r.rate].map(escapeField).join(','));
  }
  return lines.join('\r\n');
}

/**
 * Nome identificável: cotacoes_EUR-USD_2026-01-01_2026-03-31.csv
 * O intervalo usa a menor e a maior data dos registros exportados.
 */
export function buildCsvFileName(records) {
  if (records.length === 0) return 'cotacoes.csv';
  const { from, to } = records[0];
  const dates = records.map((r) => r.date).sort();
  return `cotacoes_${from}-${to}_${dates[0]}_${dates[dates.length - 1]}.csv`;
}

/**
 * Gera o arquivo no navegador (Blob + link temporário) e dispara o download.
 * O BOM (﻿) faz o Excel reconhecer o UTF-8.
 * @returns {boolean} false se não havia registros (exportação vazia bloqueada).
 */
export function downloadCsv(records) {
  if (records.length === 0) return false;

  const blob = new Blob(['﻿', recordsToCsv(records)], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = buildCsvFileName(records);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
