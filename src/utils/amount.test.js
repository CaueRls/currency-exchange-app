import { describe, it, expect } from 'vitest';
import { parseAmount, convertAmount, formatMoney } from './amount';

describe('parseAmount', () => {
  it('aceita número inteiro', () => {
    expect(parseAmount('100')).toEqual({ valid: true, value: 100, error: null });
  });
  it('aceita vírgula como separador decimal', () => {
    expect(parseAmount('1500,50').value).toBe(1500.5);
  });
  it('aceita ponto como separador decimal', () => {
    expect(parseAmount('12.75').value).toBe(12.75);
  });
  it('rejeita vazio e só espaços', () => {
    expect(parseAmount('').valid).toBe(false);
    expect(parseAmount('   ').valid).toBe(false);
  });
  it('rejeita texto', () => {
    expect(parseAmount('abc').valid).toBe(false);
    expect(parseAmount('12abc').valid).toBe(false);
    expect(parseAmount('1,2,3').valid).toBe(false);
  });
  it('rejeita zero e negativos com mensagem específica', () => {
    expect(parseAmount('0').error).toMatch(/maior que zero/);
    expect(parseAmount('-5').error).toMatch(/maior que zero/);
  });
});

describe('convertAmount', () => {
  it('multiplica valor pela taxa', () => {
    expect(convertAmount(100, 1.1)).toBeCloseTo(110, 10);
  });
  it('funciona com taxa menor que 1', () => {
    expect(convertAmount(50, 0.5)).toBe(25);
  });
});

describe('formatMoney', () => {
  it('formata com duas casas no padrão pt-BR', () => {
    expect(formatMoney(1234.5)).toBe('1.234,50');
  });
});
