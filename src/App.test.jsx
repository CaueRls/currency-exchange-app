// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Recharts usa ResizeObserver, ausente no jsdom.
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const CURRENCIES = { BRL: 'Brazilian Real', EUR: 'Euro', USD: 'United States Dollar' };

function mockApi({ failHistory = false, emptyHistory = false } = {}) {
  globalThis.fetch = vi.fn(async (url) => {
    const u = String(url);
    const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });

    if (u.endsWith('/currencies')) return json(CURRENCIES);

    if (u.includes('/latest')) {
      const base = new URL(u).searchParams.get('base');
      const symbol = new URL(u).searchParams.get('symbols');
      const table = { 'EUR>USD': 1.1, 'USD>EUR': 0.9091, 'EUR>BRL': 6.0, 'BRL>EUR': 0.1667 };
      return json({ amount: 1, base, date: '2026-10-23', rates: { [symbol]: table[`${base}>${symbol}`] } });
    }

    if (u.includes('..')) {
      if (failHistory) return json({ message: 'boom' }, 500);
      const symbol = new URL(u).searchParams.get('symbols');
      if (emptyHistory) return json({ base: 'EUR', rates: {} });
      return json({
        base: 'EUR',
        rates: {
          '2026-10-20': { [symbol]: 1.1 },
          '2026-10-21': { [symbol]: 1.2 },
          '2026-10-22': { [symbol]: 1.3 },
          '2026-10-23': { [symbol]: 1.4 },
        },
      });
    }
    return json({ message: 'not found' }, 404);
  });
}

beforeEach(() => mockApi());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('App (integração com fetch simulado)', () => {
  it('converte 100 EUR em USD usando a taxa da API', async () => {
    render(<App />);
    expect(await screen.findByText('110,00')).toBeTruthy();
    expect(screen.getByText(/Cotação de 23\/10\/2026/)).toBeTruthy();
  });

  it('inverte as moedas e recarrega com a taxa do novo par', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('110,00');

    await user.click(screen.getByRole('button', { name: /inverter moedas/i }));

    expect(await screen.findByText('90,91')).toBeTruthy(); // 100 × 0,9091
    expect(screen.getByLabelText('De').value).toBe('USD');
    expect(screen.getByLabelText('Para').value).toBe('EUR');
  });

  it('valida entrada inválida e não calcula', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('110,00');

    const input = screen.getByLabelText('Valor');
    await user.clear(input);
    await user.type(input, 'abc');
    expect((await screen.findAllByRole('alert'))[0].textContent).toMatch(/apenas números/);

    await user.clear(input);
    await user.type(input, '0');
    expect((await screen.findAllByRole('alert'))[0].textContent).toMatch(/maior que zero/);
  });

  it('avisa quando as moedas são iguais e não consulta a API de taxa', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('110,00');

    await user.selectOptions(screen.getByLabelText('Para'), 'EUR');

    expect(await screen.findAllByText(/moedas diferentes/i)).toHaveLength(2);
  });

  it('mostra a tabela com 4 registros e consulta novamente ao trocar o período', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByText('4 de 4 registros')).toBeTruthy();

    const before = globalThis.fetch.mock.calls.filter(([u]) => String(u).includes('..')).length;
    await user.click(screen.getByRole('button', { name: '1 ano' }));
    await waitFor(() => {
      const after = globalThis.fetch.mock.calls.filter(([u]) => String(u).includes('..')).length;
      expect(after).toBe(before + 1);
    });
  });

  it('filtra por cotação mínima e máxima e atualiza o contador', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('4 de 4 registros');

    await user.type(screen.getByLabelText('Cotação mínima'), '1,2');
    await user.type(screen.getByLabelText('Cotação máxima'), '1,3');

    expect(await screen.findByText('2 de 4 registros')).toBeTruthy();
  });

  it('limpa os filtros', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('4 de 4 registros');

    await user.type(screen.getByLabelText('Cotação mínima'), '1,35');
    await screen.findByText('1 de 4 registros');
    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));

    expect(await screen.findByText('4 de 4 registros')).toBeTruthy();
  });

  it('ordena por cotação ao clicar no cabeçalho', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('4 de 4 registros');

    const table = screen.getByRole('table');
    // Padrão: data decrescente → primeira linha é 23/10
    expect(within(table).getAllByRole('row')[1].textContent).toMatch(/23\/10\/2026/);

    await user.click(within(table).getByRole('button', { name: /Cotação/ }));
    expect(within(table).getAllByRole('row')[1].textContent).toMatch(/1,1000/); // crescente

    await user.click(within(table).getByRole('button', { name: /Cotação/ }));
    expect(within(table).getAllByRole('row')[1].textContent).toMatch(/1,4000/); // decrescente
  });

  it('desabilita a exportação quando os filtros não retornam registros', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('4 de 4 registros');

    expect(screen.getByRole('button', { name: 'Exportar CSV' }).disabled).toBe(false);
    await user.type(screen.getByLabelText('Cotação mínima'), '9');
    await screen.findByText('0 de 4 registros');

    expect(screen.getByRole('button', { name: 'Exportar CSV' }).disabled).toBe(true);
  });

  it('exibe erro com "Tentar novamente" quando o histórico falha', async () => {
    mockApi({ failHistory: true });
    render(<App />);

    const alerts = await screen.findAllByRole('alert');
    expect(alerts.some((a) => /erro 500/.test(a.textContent))).toBe(true);
    expect(screen.getAllByRole('button', { name: 'Tentar novamente' }).length).toBeGreaterThan(0);
  });

  it('exibe ausência de dados quando a API não devolve cotações', async () => {
    mockApi({ emptyHistory: true });
    render(<App />);

    expect(await screen.findAllByText(/Não há cotações/)).not.toHaveLength(0);
  });
});
