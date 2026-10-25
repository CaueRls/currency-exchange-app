# Uso de IA no projeto

> **Preencha e ajuste este registro com a sua realidade.** Declare com honestidade o que foi gerado por IA e o que você revisou, alterou ou escreveu por conta própria.

## Ferramenta

- Claude (Anthropic)

## O que a IA gerou

| Parte do projeto | Uso da IA |
| --- | --- |
| Estrutura inicial do projeto (Vite + React) | Geração da estrutura de pastas, `package.json` e configuração |
| `docs/REQUIREMENTS.md` e `docs/COMPONENTS.md` | Redação inicial a partir do enunciado do projeto |
| Funções em `src/utils` e testes (Vitest) | Geração do código e dos casos de teste |
| Serviço `frankfurterApi.js` e hooks customizados | Geração do código |
| Componentes React e CSS Modules | Geração do código e do estilo |
| Collection do Postman e documentação em `docs/` | Geração inicial |

## O que eu fiz, revisei ou alterei

> _Preencher. Exemplos do que registrar:_
>
> - _Li e entendi cada função de `utils/`, e consigo explicar a conversão, os filtros, a ordenação e a geração do CSV._
> - _Executei o projeto, testei com a API real e corrigi: ..._
> - _Executei as requisições no Postman e preenchi `API_TESTS.md` com os resultados reais._
> - _Criei os protótipos no Figma._
> - _Ajustei o layout / nomes / textos: ..._

## Prompts principais

1. Enunciado completo do projeto, pedindo ajuda para desenvolver tudo do zero.

> _Acrescente aqui os prompts seguintes que você usar, e o que mudou depois de cada um._

## Limitações e cuidados

- A IA não conseguiu acessar a API Frankfurter real durante a geração; os testes automatizados de interface usam `fetch` simulado. A validação com a API real foi (ou deve ser) feita manualmente.
- O histórico de commits gerado inicialmente deve ser substituído ou complementado por commits reais do seu desenvolvimento.
- Todo código foi revisado antes da entrega: _confirme esta frase só se for verdade._
