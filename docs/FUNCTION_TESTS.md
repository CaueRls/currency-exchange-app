# Testes das funções JavaScript

Os testes automatizados usam **Vitest** e rodam com:

```bash
npm test
```

Resultado da última execução: **5 arquivos, 55 testes, todos aprovados**.

## Funções puras (`src/utils`)

| Arquivo de teste | Função | Cenários cobertos |
| --- | --- | --- |
| `amount.test.js` | `parseAmount` | inteiro; vírgula decimal; ponto decimal; vazio; só espaços; texto (`abc`, `12abc`, `1,2,3`); zero; negativo |
| | `convertAmount` | 100 × 1,1; taxa menor que 1 |
| | `formatMoney` | formato pt-BR com duas casas (`1.234,50`) |
| `dates.test.js` | `getStartDateForPeriod` | os 8 períodos a partir de 25/10/2026; fim de mês curto (31/05 − 3 meses = 28/02); ano bissexto (29/02/2028 − 1 ano) |
| | `formatDateBR`, `toISODate` | conversão de formatos |
| `filters.test.js` | `filterRecords` | sem filtros; data inicial; data final; cotação mínima e máxima (com vírgula e ponto); combinação de filtros; nenhum resultado; datas invertidas; mínima > máxima |
| | `validateFilters`, `hasActiveFilters` | datas invertidas; cotação inválida; filtros vazios |
| | `sortRecords` | data decrescente; cotação crescente; não altera o array original |
| `csv.test.js` | `recordsToCsv` | cabeçalho + linhas; lista vazia |
| | `buildCsvFileName` | par e intervalo de datas; lista vazia |
| | `downloadCsv` | bloqueia exportação vazia |
| | `normalizeTimeSeries` | converte e ordena; resposta sem `rates`; dia sem a moeda de destino |

## Integração com a interface (`src/App.test.jsx`)

Usa `fetch` simulado (mock), pois os testes não dependem da internet. Verifica o comportamento da aplicação completa:

| Cenário | Resultado esperado |
| --- | --- |
| Conversão 100 EUR → USD com taxa 1,10 | Exibe `110,00` e a data da cotação |
| Inverter moedas | Seletores trocam e conversão usa a taxa de USD → EUR |
| Entrada inválida (`abc`, `0`) | Mensagem de erro e nenhum cálculo |
| Moedas iguais | Aviso no conversor e no histórico |
| Troca de período | Nova consulta à API |
| Filtro de cotação mínima e máxima | Contador atualizado (`2 de 4 registros`) |
| Limpar filtros | Volta a `4 de 4 registros` |
| Ordenação por cotação | Crescente no primeiro clique, decrescente no segundo |
| Filtros sem resultado | Botão "Exportar CSV" desabilitado |
| API retorna erro 500 | Mensagem de erro e botão "Tentar novamente" |
| API retorna série vazia | Mensagem de ausência de dados |

## O que os testes automatizados não cobrem (fazer manualmente)

Registre aqui o resultado dos testes manuais com a API real:

- [ ] Conversão entre duas moedas com a API real
- [ ] Inversão das moedas
- [ ] Os 8 períodos históricos (gráfico e tabela com dados reais)
- [ ] Download real do CSV e abertura no Excel/Planilhas (conferir nome e conteúdo do arquivo)
- [ ] Falha na API (desligar a internet ou bloquear a requisição nas DevTools)
- [ ] Responsividade (DevTools em 360 px e em desktop)
- [ ] Instalação a partir do README em uma pasta limpa
