/**
 * Interpreta o texto digitado pelo usuário.
 * Aceita vírgula ou ponto como separador decimal.
 * @param {string} input
 * @returns {{ valid: boolean, value: number|null, error: string|null }}
 */
export function parseAmount(input) {
  const text = String(input ?? '').trim();

  if (text === '') {
    return { valid: false, value: null, error: 'Informe um valor para converter.' };
  }

  // Sinal opcional, dígitos e um separador decimal opcional (vírgula ou ponto).
  // O sinal é aceito aqui apenas para dar a mensagem correta para valores negativos.
  if (!/^[+-]?\d*[.,]?\d+$/.test(text)) {
    return { valid: false, value: null, error: 'Digite apenas números (ex.: 1500,50).' };
  }

  const value = Number(text.replace(',', '.'));

  if (!Number.isFinite(value)) {
    return { valid: false, value: null, error: 'Valor inválido.' };
  }
  if (value <= 0) {
    return { valid: false, value: null, error: 'O valor deve ser maior que zero.' };
  }

  return { valid: true, value, error: null };
}

/** valor × taxa (RN01). */
export function convertAmount(amount, rate) {
  return amount * rate;
}

/** Formata um valor monetário no padrão pt-BR, com 2 casas decimais. */
export function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Formata uma taxa de câmbio com até 6 casas decimais (mínimo 4). */
export function formatRate(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value);
}
