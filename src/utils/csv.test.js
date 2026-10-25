import { describe, it, expect } from 'vitest';
import { recordsToCsv, buildCsvFileName, downloadCsv } from './csv';
import { normalizeTimeSeries } from './rates';

const records = [
  { date: '2026-01-05', from: 'EUR', to: 'USD', rate: 1.2 },
  { date: '2026-01-02', from: 'EUR', to: 'USD', rate: 1.1 },
];

describe('recordsToCsv', () => {
  it('inclui cabeçalho e uma linha por registro', () => {
    const lines = recordsToCsv(records).split('\r\n');
    expect(lines[0]).toBe('data,moeda_origem,moeda_destino,cotacao');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('2026-01-05,EUR,USD,1.2');
  });
  it('com lista vazia gera apenas o cabeçalho', () => {
    expect(recordsToCsv([])).toBe('data,moeda_origem,moeda_destino,cotacao');
  });
});

describe('buildCsvFileName', () => {
  it('usa par e intervalo de datas', () => {
    expect(buildCsvFileName(records)).toBe('cotacoes_EUR-USD_2026-01-02_2026-01-05.csv');
  });
  it('nome genérico para lista vazia', () => {
    expect(buildCsvFileName([])).toBe('cotacoes.csv');
  });
});

describe('downloadCsv', () => {
  it('bloqueia exportação vazia', () => {
    expect(downloadCsv([])).toBe(false);
  });
});

describe('normalizeTimeSeries', () => {
  const api = {
    base: 'EUR',
    rates: {
      '2026-01-05': { USD: 1.2 },
      '2026-01-02': { USD: 1.1 },
    },
  };
  it('converte e ordena por data crescente', () => {
    expect(normalizeTimeSeries(api, 'EUR', 'USD')).toEqual([
      { date: '2026-01-02', from: 'EUR', to: 'USD', rate: 1.1 },
      { date: '2026-01-05', from: 'EUR', to: 'USD', rate: 1.2 },
    ]);
  });
  it('resposta sem rates devolve lista vazia', () => {
    expect(normalizeTimeSeries({}, 'EUR', 'USD')).toEqual([]);
    expect(normalizeTimeSeries(null, 'EUR', 'USD')).toEqual([]);
  });
  it('ignora dias sem a moeda de destino', () => {
    expect(normalizeTimeSeries({ rates: { '2026-01-02': {} } }, 'EUR', 'USD')).toEqual([]);
  });
});
