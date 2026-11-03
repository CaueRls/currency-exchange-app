# Testes da API Frankfurter no Postman

> **Como usar este documento:** importe `postman/Frankfurter.postman_collection.json` no Postman, execute cada requisição e preencha as colunas **Resultado obtido** e **Evidência** com o que você realmente observar (prints em `docs/images/`). A coluna "Esperado" vem da documentação oficial; confirme se a API se comportou assim.

- Documentação oficial: <https://frankfurter.dev>
- Base URL usada: `https://api.frankfurter.dev/v1` (a documentação indica que a v1 foi substituída pela v2, mas continua funcionando)
- Autenticação: não há (sem chave de API)
- Fonte dos dados: taxas de referência do Banco Central Europeu, atualizadas por volta das 16h CET em dias úteis

## Requisições

| # | Requisição | Esperado (documentação) | Resultado obtido | Evidência |
| --- | --- | --- | --- | --- |
| 1 | `GET /currencies` | 200; objeto código → nome | 200 OK. Lista de moedas, incluindo BRL, EUR e USD. Testes 2/2. | ![print](images/postman-01.png) |
| 2 | `GET /latest?base=EUR&symbols=USD` | 200; `{ amount, base, date, rates }` | 200 OK. `date: 2026-10-27`, `USD: 1.115`. Testes 2/2. | ![print](images/postman-02.png) |
| 3 | `GET /latest?base=USD&symbols=BRL` | 200; taxa BRL | 200 OK. `date: 2026-10-27`, `BRL: 5.3474`. Testes 2/2. | ![print](images/postman-03.png) |
| 4 | `GET /2026-01-01..2026-01-31?base=EUR&symbols=USD` | 200; `rates` indexado por data | 200 OK. Veio `start_date: 2025-12-31` e `end_date: 2026-01-30`. Testes 2/2. | ![print](images/postman-04.png) |
| 5 | `GET /2026-10-01..?base=EUR&symbols=USD` | 200; série até a data mais recente | 200 OK. De 2026-10-01 a 2026-10-27, sem sábados e domingos. Testes 1/1. | ![print](images/postman-05.png) |
| 6 | `GET /2016-10-25..2026-10-25?...` (10 anos) | 200; anotar quantos pontos retornam | 200 OK, 880 ms, 12,24 KB. `start_date: 2016-10-25`, `end_date: 2026-10-23`. Pontos retornados: **X**. Testes 2/2. | ![print](images/postman-06.png) |
| 7 | `GET /2026-10-24?...` (sábado) | 200; `date` do último dia útil anterior | 200 OK. Pedi sábado 24/10 e veio `date: 2026-10-23`, `USD: 1.1193`. Testes 2/2. | ![print](images/postman-07.png) |
| 8 | `GET /latest?base=EUR&symbols=XXX` | 4xx com mensagem | 404 Not Found. `{"message": "not found"}`. Testes 1/1. | ![print](images/postman-08.png) |
| 9 | `GET /latest?base=EUR&symbols=EUR` | investigar | 422 Unprocessable Entity. `{"message": "bad currency pair"}`. | ![print](images/postman-09.png) |
| 10 | `GET /2026-13-45?...` | 4xx | 422 Unprocessable Entity. `{"message": "invalid date"}`. | ![print](images/postman-10.png) |

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

- **Fins de semana e feriados:** ao pedir um sábado (requisição 7), a API devolveu a cotação da sexta-feira anterior (`date: 2026-10-23`). A aplicação não preenche dias sem cotação (RN07).
- **Início e fim de intervalo sem cotação:** na requisição 4 pedi de 01/01 (feriado) a 31/01 (sábado) e a API devolveu de 31/12 a 30/01. Aparentemente o primeiro registro pode ser o dia útil anterior ao início pedido. Na aplicação, a tabela pode mostrar um registro um dia antes do início do período.
- **Granularidade em períodos longos:** na requisição 6 vieram X pontos para 10 anos. _(complete com o que você observou)_
- **Mesma moeda na origem e no destino:** a API responde 422 `bad currency pair` (requisição 9). A aplicação bloqueia esse caso antes de chamar a API (RN03).
- **Formato do erro:** a API devolve JSON com o campo `message`: 404 `not found` (moeda inexistente) e 422 `invalid date` (data inválida). O serviço `frankfurterApi.js` lê esse campo e trata erros por `response.ok`.
- **Data efetiva:** a data retornada em `latest` pode ser anterior a hoje; por isso a interface exibe "Cotação de DD/MM/AAAA" (RN04).

## Como a aplicação usa cada endpoint

| Função em `services/frankfurterApi.js` | Endpoint | Usado por |
| --- | --- | --- |
| `getCurrencies` | `/currencies` | `useCurrencies` → seletores |
| `getLatestRate` | `/latest?base=&symbols=` | `useLatestRate` → conversor |
| `getTimeSeries` | `/{início}..{fim}?base=&symbols=` | `useExchangeHistory` → gráfico e tabela |
