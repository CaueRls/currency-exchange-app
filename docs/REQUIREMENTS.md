# Requisitos — Currency Exchange App

## 1. Contexto

Uma empresa de tecnologia financeira quer centralizar em uma única Single Page Application (SPA) a consulta de taxas de câmbio, a conversão de valores e a análise histórica de moedas. Hoje os usuários consultam vários sites, convertem valores manualmente e copiam dados para planilhas.

## 2. Público-alvo

- Pessoas que viajam, importam ou compram em moeda estrangeira e precisam de uma conversão rápida.
- Analistas e estudantes de finanças que precisam observar o comportamento histórico de um par de moedas.
- Usuários que precisam levar os dados para uma planilha (exportação CSV).

## 3. Objetivo

Disponibilizar uma SPA em React que converta valores entre duas moedas, mostre a taxa e a data da cotação, apresente a evolução histórica em gráfico e tabela, permita filtrar e ordenar os dados e exportar o resultado filtrado em CSV.

## 4. Escopo

**Dentro do escopo**

- Conversor de moedas com inversão do par.
- Histórico do par em 8 períodos (7 dias a 10 anos), com gráfico.
- Tabela com filtros (datas, cotação mínima/máxima), ordenação e contador de registros.
- Exportação CSV dos registros filtrados.
- Estados de carregamento, erro e ausência de dados.
- Layout responsivo (desktop e celular).

**Fora do escopo**

Autenticação, cadastro de usuários, back-end próprio, banco de dados, pagamentos, compra ou venda real de moedas.

**Fonte de dados:** API pública Frankfurter (`https://api.frankfurter.dev/v1`), baseada em taxas de referência do Banco Central Europeu, sem chave de acesso.

## 5. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF01 | O sistema deve carregar a lista de moedas disponíveis na API e exibi-la em dois seletores (origem e destino). |
| RF02 | O usuário deve poder informar um valor a converter. |
| RF03 | O sistema deve exibir o valor convertido, a taxa utilizada e a data efetiva da cotação. |
| RF04 | O usuário deve poder inverter origem e destino com um único clique. |
| RF05 | O sistema deve validar entradas inválidas (vazio, não numérico, zero, negativo, moedas iguais) e informar o motivo. |
| RF06 | O usuário deve poder escolher o período do histórico: 7 dias, 15 dias, 30 dias, 3 meses, 6 meses, 1 ano, 5 anos ou 10 anos. |
| RF07 | O gráfico deve ser atualizado quando o par de moedas ou o período mudar. |
| RF08 | A tabela deve exibir data, moeda de origem, moeda de destino e cotação. |
| RF09 | A tabela deve permitir filtrar por intervalo de datas. |
| RF10 | A tabela deve permitir filtrar por cotação mínima e máxima. |
| RF11 | Os filtros devem poder ser combinados e limpos com uma ação. |
| RF12 | A tabela deve permitir ordenar por data e por cotação (crescente e decrescente). |
| RF13 | O sistema deve exibir a quantidade de registros encontrados após os filtros. |
| RF14 | O sistema deve exportar em CSV apenas os registros resultantes dos filtros, com cabeçalho. |
| RF15 | O sistema deve impedir a exportação quando não houver registros. |
| RF16 | O arquivo CSV deve ter nome identificável (par de moedas e intervalo de datas). |
| RF17 | O sistema deve exibir estados de loading, erro (com opção de tentar novamente) e ausência de dados. |

## 6. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF01 | Aplicação SPA em React com componentes funcionais e JSX, criada com Vite. |
| RNF02 | Estilos isolados com CSS Modules. |
| RNF03 | Lógica de consulta extraída em hooks customizados; regras de negócio em funções puras testáveis. |
| RNF04 | Layout responsivo, utilizável em telas a partir de 360 px. |
| RNF05 | Acessibilidade básica: labels associados aos campos, `aria-live` nas mensagens de resultado e erro, `aria-sort` na tabela, contraste adequado. |
| RNF06 | Requisições canceladas ao trocar parâmetros ou desmontar componentes, evitando respostas fora de ordem. |
| RNF07 | O projeto deve poder ser instalado e executado seguindo apenas o README. |
| RNF08 | Código versionado em Git com commits pequenos e semânticos. |

## 7. Regras de negócio

| ID | Regra |
| --- | --- |
| RN01 | O valor convertido é calculado pela aplicação: `valor × taxa`, onde a taxa vem da API para o par base → destino. |
| RN02 | O valor informado deve ser um número finito maior que zero. Aceita vírgula ou ponto como separador decimal. |
| RN03 | Origem e destino devem ser moedas diferentes. |
| RN04 | A data exibida é a data efetiva da cotação devolvida pela API (último dia útil publicado), não necessariamente a data de hoje. |
| RN05 | Inverter o par troca origem e destino e recalcula conversão, gráfico e tabela com a taxa do novo par. |
| RN06 | O período é contado de trás para frente a partir da data de hoje (UTC) até hoje. A API armazena datas em UTC. |
| RN07 | A API não publica cotações em fins de semana e feriados; esses dias não aparecem no histórico e não são preenchidos artificialmente. |
| RN08 | Filtros se combinam com E lógico. Datas são inclusivas. Campos vazios não filtram. |
| RN09 | Data inicial maior que a final, ou cotação mínima maior que a máxima, é inválido e não retorna registros até ser corrigido. |
| RN10 | A exportação contém exatamente os registros visíveis na tabela, na ordem atual de ordenação. |
| RN11 | A ordenação padrão é por data, da mais recente para a mais antiga. |

## 8. Critérios de aceite

| Requisito | Critério |
| --- | --- |
| RF03 | Dado EUR → USD e valor 100, quando a taxa for 1,10, então exibe `110,00 USD`, a taxa e a data da cotação. |
| RF04 | Dado EUR → USD, ao clicar em inverter, os seletores passam a USD → EUR e todos os dados são recarregados. |
| RF05 | Dado valor vazio, `abc`, `0` ou `-5`, então exibe mensagem de erro e não calcula. Dadas moedas iguais, exibe aviso e não consulta a API. |
| RF06/07 | Dado o período 1 ano, o gráfico mostra dados de aproximadamente 12 meses atrás até hoje; ao mudar para 30 dias, o gráfico é redesenhado. |
| RF09/10/11 | Dado intervalo de datas e cotação mínima preenchidos, a tabela exibe só registros que atendem aos dois; "Limpar filtros" restaura todos. |
| RF12 | Ao clicar no cabeçalho "Cotação", ordena crescente; novo clique inverte para decrescente. |
| RF13 | A tabela mostra "N de M registros" refletindo os filtros. |
| RF14/15 | Com filtros ativos, o CSV contém apenas as linhas filtradas e o cabeçalho; com 0 registros o botão fica desabilitado. |
| RF16 | O arquivo baixado segue `cotacoes_EUR-USD_AAAA-MM-DD_AAAA-MM-DD.csv`. |
| RF17 | Com a API fora do ar, aparece mensagem de erro e botão "Tentar novamente"; durante a consulta aparece indicação de carregamento. |
| RNF04 | Em 360 px de largura não há rolagem horizontal da página; a tabela rola dentro do próprio contêiner. |
