# Mapeamento de componentes

## Árvore de componentes

```
App
├── Header
├── ConverterCard
│   └── CurrencySelect (origem) · CurrencySelect (destino) · botão inverter
└── HistorySection
    ├── PeriodSelector
    ├── RateChart
    ├── FiltersPanel
    └── RatesTable
        └── ExportButton
StatusMessage  (usado por ConverterCard, RateChart e RatesTable)
```

## Onde cada estado mora (lifting state up)

| Estado | Dono | Motivo |
| --- | --- | --- |
| `from`, `to` (par de moedas) | `App` | O conversor e o histórico usam o mesmo par; ao inverter, os dois reagem. |
| `amount` (texto digitado) | `ConverterCard` | Só o conversor usa. |
| `periodId` | `HistorySection` | Controla gráfico e tabela, que estão na mesma seção. |
| `filters`, `sort` | `HistorySection` | Compartilhado entre `FiltersPanel` (altera) e `RatesTable` (lê). |

## Componentes

| Componente | Responsabilidade | JSX | CSS Module | Principais props | Estados / hooks | Relação |
| --- | --- | --- | --- | --- | --- | --- |
| `App` | Raiz; guarda o par de moedas e a lista de moedas; compõe a página. | `src/App.jsx` | `src/App.module.css` | — | `from`, `to`; `useCurrencies` | Pai de todos. Passa o par e o `onSwap`. |
| `Header` | Título e subtítulo da aplicação. | `components/Header/Header.jsx` | `Header.module.css` | — | — | Filho de `App`. |
| `CurrencySelect` | Seletor de moeda com label acessível. | `components/CurrencySelect/CurrencySelect.jsx` | `CurrencySelect.module.css` | `id`, `label`, `value`, `currencies`, `onChange` | — (controlado) | Usado 2× no `ConverterCard`. |
| `ConverterCard` | Entrada do valor, seletores, inversão, validação e resultado da conversão. | `components/ConverterCard/ConverterCard.jsx` | `ConverterCard.module.css` | `from`, `to`, `currencies`, `onChangeFrom`, `onChangeTo`, `onSwap` | `amount`; `useLatestRate` | Filho de `App`. Usa `CurrencySelect` e `StatusMessage`. |
| `HistorySection` | Orquestra histórico: período, filtros, ordenação, dados derivados. | `components/HistorySection/HistorySection.jsx` | `HistorySection.module.css` | `from`, `to` | `periodId`, `filters`, `sort`; `useExchangeHistory` | Filho de `App`. Pai de `PeriodSelector`, `RateChart`, `FiltersPanel`, `RatesTable`. |
| `PeriodSelector` | Botões dos 8 períodos. | `components/PeriodSelector/PeriodSelector.jsx` | `PeriodSelector.module.css` | `periods`, `value`, `onChange` | — | Filho de `HistorySection`. |
| `RateChart` | Gráfico de linha da cotação ao longo do tempo. | `components/RateChart/RateChart.jsx` | `RateChart.module.css` | `records`, `from`, `to`, `status`, `error`, `onRetry` | — | Filho de `HistorySection`. Usa Recharts e `StatusMessage`. |
| `FiltersPanel` | Campos de filtro (datas, cotação mín./máx.) e botão limpar. | `components/FiltersPanel/FiltersPanel.jsx` | `FiltersPanel.module.css` | `filters`, `errors`, `onChange`, `onClear` | — (controlado) | Filho de `HistorySection`. |
| `RatesTable` | Tabela, ordenação por cabeçalho, contador de registros. | `components/RatesTable/RatesTable.jsx` | `RatesTable.module.css` | `records`, `totalCount`, `sort`, `onSortChange`, `status`, `error`, `onRetry`, `exportButton` | — | Filho de `HistorySection`. Usa `StatusMessage`. |
| `ExportButton` | Gera e baixa o CSV dos registros filtrados; desabilita se vazio. | `components/ExportButton/ExportButton.jsx` | `ExportButton.module.css` | `records`, `from`, `to` | — | Renderizado dentro de `HistorySection`/`RatesTable`. |
| `StatusMessage` | Mensagem padronizada de loading, erro (com retry) e vazio. | `components/StatusMessage/StatusMessage.jsx` | `StatusMessage.module.css` | `type` (`loading`/`error`/`empty`), `message`, `onRetry` | — | Reutilizado. |

## Hooks customizados

| Hook | Arquivo | Responsabilidade |
| --- | --- | --- |
| `useCurrencies` | `hooks/useCurrencies.js` | Busca a lista de moedas uma vez. Retorna `{ currencies, status, error, reload }`. |
| `useLatestRate` | `hooks/useLatestRate.js` | Busca a taxa mais recente do par. Retorna `{ rate, date, status, error, reload }`. |
| `useExchangeHistory` | `hooks/useExchangeHistory.js` | Busca a série histórica do par/período. Retorna `{ records, status, error, reload }`. |
| `useRecordFilters` | `hooks/useRecordFilters.js` | Estado de filtros e ordenação, validação e lista derivada. Retorna `{ filters, sort, errors, visibleRecords, setFilter, clearFilters, toggleSort }`. |

Todos os hooks de rede usam `AbortController` para cancelar requisições obsoletas e expõem `status` ∈ `idle | loading | success | error`.

## Camadas fora de componentes

| Pasta | Conteúdo |
| --- | --- |
| `services/frankfurterApi.js` | Funções `fetch` com `async/await`: `getCurrencies`, `getLatestRate`, `getTimeSeries`, e o erro `ApiError`. |
| `utils/amount.js` | `parseAmount`, `convertAmount`, `formatMoney`, `formatRate`. |
| `utils/dates.js` | `toISODate`, `getStartDateForPeriod`, `formatDateBR`. |
| `utils/rates.js` | `normalizeTimeSeries` (JSON da API → lista de registros). |
| `utils/filters.js` | `filterRecords`, `sortRecords`, `validateFilters`, `hasActiveFilters`. |
| `utils/csv.js` | `recordsToCsv`, `buildCsvFileName`, `downloadCsv`. |
| `constants/periods.js` | Definição dos 8 períodos. |
