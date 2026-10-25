# Currency Exchange App

SPA em **React + JavaScript** para converter moedas, acompanhar o histórico de cotações, filtrar e ordenar os dados e exportar o resultado em CSV. Usa a API pública [Frankfurter](https://frankfurter.dev) (taxas de referência do Banco Central Europeu, sem chave de acesso).

> Projeto individual — [Projeto 01] Currency Exchange App.

## Funcionalidades

- **Conversor:** escolha moeda de origem e destino, informe o valor e veja o resultado, a taxa e a data da cotação. Botão para inverter as moedas e validação de entradas inválidas.
- **Histórico e gráfico:** 7 dias, 15 dias, 30 dias, 3 meses, 6 meses, 1 ano, 5 anos e 10 anos. O gráfico atualiza ao trocar o par ou o período.
- **Tabela:** data, origem, destino e cotação, com filtro por intervalo de datas, cotação mínima e máxima (combináveis), botão de limpar, ordenação por data e cotação e contador de registros.
- **Exportação CSV:** exporta apenas os registros filtrados, com cabeçalho, gerado no navegador, com nome identificável (`cotacoes_EUR-USD_2026-01-01_2026-03-31.csv`). Desabilitada quando não há registros.
- **Estados de interface:** loading, erro (com "Tentar novamente") e ausência de dados.
- **Responsivo:** desktop e celular.

## Tecnologias

React 18 · Vite · JavaScript (ES Modules) · CSS Modules · Recharts · Fetch + async/await · Vitest e Testing Library · Postman · Git/GitHub

## Pré-requisitos

- Node.js 18 ou superior (testado com Node 22)
- npm

## Instalação e execução

```bash
git clone <URL-DO-SEU-REPOSITORIO>
cd currency-exchange-app
npm install
npm run dev
```

Abra o endereço exibido no terminal (normalmente <http://localhost:5173>).

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção em `dist/` |
| `npm run preview` | Serve a build localmente |
| `npm test` | Executa os testes (Vitest) |

## Arquitetura

```
src/
  components/     Componentes React (cada um com .jsx e .module.css)
  hooks/          useCurrencies, useLatestRate, useExchangeHistory, useRecordFilters
  services/       frankfurterApi.js (fetch + async/await)
  utils/          Funções puras: conversão, datas, filtros, ordenação, CSV (com testes)
  constants/      Períodos e moedas padrão
  App.jsx         Raiz: guarda o par de moedas (lifting state up)
docs/             Requisitos, componentes, Figma, testes de API e de funções, uso de IA
postman/          Collection exportada
```

Fluxo de dados:

1. `App` carrega as moedas (`useCurrencies`) e guarda o par `from`/`to`.
2. `ConverterCard` busca a taxa (`useLatestRate`) e calcula `valor × taxa` na própria aplicação.
3. `HistorySection` busca a série (`useExchangeHistory`), aplica filtros e ordenação (`useRecordFilters`) e alimenta o gráfico, a tabela e a exportação.
4. A regra de negócio fica em `utils/` (funções puras e testadas); os componentes só exibem e disparam eventos.

Detalhes em [docs/COMPONENTS.md](docs/COMPONENTS.md).

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | Requisitos, regras de negócio e critérios de aceite |
| [docs/COMPONENTS.md](docs/COMPONENTS.md) | Componentes, estados, props e hooks |
| [docs/FIGMA.md](docs/FIGMA.md) | Link e evidências dos protótipos |
| [docs/API_TESTS.md](docs/API_TESTS.md) | Investigação da API no Postman |
| [docs/FUNCTION_TESTS.md](docs/FUNCTION_TESTS.md) | Testes das funções JavaScript |
| [docs/AI_USAGE.md](docs/AI_USAGE.md) | Registro do uso de IA |
| [postman/](postman/) | Collection do Postman (JSON) |

## Capturas de tela

Adicione prints em `docs/images/` e referencie aqui:

```md
![Desktop](docs/images/app-desktop.png)
![Mobile](docs/images/app-mobile.png)
```

## Fluxo Git

- `main`: versão estável
- `dev`: integração
- branches `feat/*` e `refactor/*` quando necessário
- commits semânticos (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`)

## Limitações conhecidas

- A API não publica cotações em fins de semana e feriados; esses dias não aparecem no histórico.
- Em períodos longos, a quantidade de pontos devolvida pela API pode variar; a aplicação exibe o que a API retorna (veja `docs/API_TESTS.md`).
- A Frankfurter documenta a v1 como substituída pela v2, mas ainda em funcionamento. O projeto usa `https://api.frankfurter.dev/v1`; a URL base está em `src/services/frankfurterApi.js`.
- Os valores são informativos e não representam operações reais de câmbio.
