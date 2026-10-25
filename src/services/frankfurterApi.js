import { normalizeTimeSeries } from '../utils/rates';

const BASE_URL = 'https://api.frankfurter.dev/v1';

/** Erro com status HTTP para a interface diferenciar falhas de rede e da API. */
export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error; // cancelamento não é erro de rede
    throw new ApiError('Não foi possível conectar à API. Verifique sua internet.');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.message ? ` (${body.message})` : '';
    } catch {
      /* corpo não é JSON; ignora */
    }
    throw new ApiError(`A API retornou erro ${response.status}${detail}.`, response.status);
  }

  return response.json();
}

/** GET /currencies → { EUR: 'Euro', USD: 'United States Dollar', ... } */
export function getCurrencies(options) {
  return request('/currencies', options);
}

/**
 * GET /latest?base=EUR&symbols=USD
 * @returns {Promise<{ rate: number, date: string }>}
 */
export async function getLatestRate(from, to, options) {
  const data = await request(`/latest?base=${from}&symbols=${to}`, options);
  const rate = data?.rates?.[to];
  if (typeof rate !== 'number') {
    throw new ApiError('A API não retornou cotação para este par de moedas.');
  }
  return { rate, date: data.date };
}

/**
 * GET /{inicio}..{fim}?base=EUR&symbols=USD
 * @returns {Promise<Array<{date: string, from: string, to: string, rate: number}>>}
 */
export async function getTimeSeries(from, to, startDate, endDate, options) {
  const data = await request(
    `/${startDate}..${endDate}?base=${from}&symbols=${to}`,
    options,
  );
  return normalizeTimeSeries(data, from, to);
}
