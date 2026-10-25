# Testes da API Frankfurter no Postman

> **Como usar este documento:** importe `postman/Frankfurter.postman_collection.json` no Postman, execute cada requisição e preencha as colunas **Resultado obtido** e **Evidência** com o que você realmente observar (prints em `docs/images/`). A coluna "Esperado" vem da documentação oficial; confirme se a API se comportou assim.

- Documentação oficial: <https://frankfurter.dev>
- Base URL usada: `https://api.frankfurter.dev/v1` (a documentação indica que a v1 foi substituída pela v2, mas continua funcionando)
- Autenticação: não há (sem chave de API)
- Fonte dos dados: taxas de referência do Banco Central Europeu, atualizadas por volta das 16h CET em dias úteis

## Requisições

| # | Requisição | Esperado (documentação) | Resultado obtido | Evidência |
| --- | --- | --- | --- | --- |
| 1 | `GET /currencies` | 200; objeto `{ "EUR": "Euro", ... }` | _preencher_ | `docs/images/postman-01.png` |
| 2 | `GET /latest?base=EUR&symbols=USD` | 200; `{ amount, base, date, rates: { USD } }` | _preencher_ | `docs/images/postman-02.png` |
| 3 | `GET /latest?base=USD&symbols=BRL` | 200; taxa BRL | _preencher_ | `docs/images/postman-03.png` |
| 4 | `GET /2026-01-01..2026-01-31?base=EUR&symbols=USD` | 200; `rates` indexado por data | _preencher_ | `docs/images/postman-04.png` |
| 5 | `GET /2026-10-01..?base=EUR&symbols=USD` | 200; série até a data mais recente | _preencher_ | `docs/images/postman-05.png` |
| 6 | `GET /2016-10-25..2026-10-25?...` (10 anos) | 200; **anotar quantos pontos retornam** | _preencher_ | `docs/images/postman-06.png` |
| 7 | `GET /2026-10-24?...` (sábado) | 200; `date` do último dia útil anterior | _preencher_ | `docs/images/postman-07.png` |
| 8 | `GET /latest?base=EUR&symbols=XXX` | 4xx com mensagem de erro | _preencher_ | `docs/images/postman-08.png` |
| 9 | `GET /latest?base=EUR&symbols=EUR` | investigar (a app bloqueia este caso) | _preencher_ | `docs/images/postman-09.png` |
| 10 | `GET /2026-13-45?...` | 4xx | _preencher_ | `docs/images/postman-10.png` |

## Estrutura do JSON

**Cotação mais recente**

```json
{
  "amount": 1.0,
  "base": "EUR",
  "date": "AAAA-MM-DD",
  "rates": { "USD": 0.0 }
}
```

**Série temporal (intervalo)**

```json
{
  "amount": 1.0,
  "base": "EUR",
  "start_date": "AAAA-MM-DD",
  "end_date": "AAAA-MM-DD",
  "rates": {
    "AAAA-MM-DD": { "USD": 0.0 },
    "AAAA-MM-DD": { "USD": 0.0 }
  }
}
```

> Os valores acima são apenas o formato. Substitua por um exemplo real copiado do Postman.

## Parâmetros

| Parâmetro | Onde | Função |
| --- | --- | --- |
| `base` | query | Moeda de origem (padrão EUR) |
| `symbols` | query | Moedas de destino (lista separada por vírgula) |
| `AAAA-MM-DD` | caminho | Cotação de uma data |
| `AAAA-MM-DD..AAAA-MM-DD` | caminho | Série temporal; o segundo valor pode ser omitido para ir até hoje |

## Descobertas que impactam a aplicação

Preencha após testar:

- **Fins de semana e feriados:** _o que a API devolveu na requisição 7?_ A aplicação não preenche dias sem cotação (RN07).
- **Granularidade em períodos longos:** _quantos pontos vieram na requisição 6?_ Se a API agrupar dados em períodos longos, a tabela e o gráfico mostram exatamente o que ela devolve.
- **Mesma moeda na origem e no destino:** _qual resposta veio na requisição 9?_ A aplicação bloqueia o caso antes de chamar a API (RN03).
- **Formato do erro:** _copie o JSON de erro das requisições 8 e 10._ O serviço `frankfurterApi.js` lê o campo `message` quando existir.
- **Data efetiva:** a data retornada em `latest` pode ser anterior a hoje; por isso a interface exibe "Cotação de DD/MM/AAAA" (RN04).

## Como a aplicação usa cada endpoint

| Função em `services/frankfurterApi.js` | Endpoint | Usado por |
| --- | --- | --- |
| `getCurrencies` | `/currencies` | `useCurrencies` → seletores |
| `getLatestRate` | `/latest?base=&symbols=` | `useLatestRate` → conversor |
| `getTimeSeries` | `/{início}..{fim}?base=&symbols=` | `useExchangeHistory` → gráfico e tabela |
