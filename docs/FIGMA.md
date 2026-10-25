# Figma — protótipos

> **Pendente:** os protótipos precisam ser criados por você no Figma. Este arquivo traz o roteiro do que desenhar (alinhado com a aplicação) e o espaço para colar o link e as imagens.

**Link do arquivo Figma:** _colar aqui (permissão de visualização pública)_

## Páginas sugeridas no arquivo

1. **Wireframe (baixa fidelidade)** — desktop e mobile
2. **Protótipo (média fidelidade)** — desktop
3. **Mobile** — adaptação em 360 px
4. **Estados** — loading, erro e ausência de dados
5. **Design guide** — cores, tipografia, componentes

## Telas e estados a desenhar

| Tela | Conteúdo |
| --- | --- |
| Desktop principal | Cabeçalho; cartão do conversor à esquerda; histórico à direita (períodos, gráfico, filtros, tabela, botão exportar) |
| Mobile principal | Tudo em uma coluna: conversor → períodos → gráfico → filtros → tabela com rolagem horizontal interna |
| Loading | Spinner e texto "Carregando..." no conversor, no gráfico e na tabela |
| Erro | Mensagem em vermelho com botão "Tentar novamente" |
| Ausência de dados | Mensagem "Não há cotações para este par e período" e "Nenhum registro encontrado com os filtros atuais" |
| Validação | Campo de valor inválido com borda e mensagem em vermelho; moedas iguais |
| Exportação desabilitada | Botão "Exportar CSV" cinza quando há 0 registros |

## Design guide usado na implementação

| Item | Valor |
| --- | --- |
| Cor primária | `#1D4ED8` (hover/escuro `#1E3A8A`, suave `#E6EDFF`) |
| Cor de destaque (exportar) | `#0F9D8A` |
| Erro | `#B42318` sobre `#FDECEA` |
| Fundo / superfície | `#F3F5FA` / `#FFFFFF` |
| Texto / texto secundário | `#14213D` / `#5B6785` |
| Borda | `#D9DFEC` |
| Raio dos cartões | 12 px |
| Fonte | Inter (fallback: fonte do sistema) |
| Largura máxima do conteúdo | 1100 px |
| Breakpoints | 900 px (uma coluna) e 600 px (campos empilhados) |

## Evidências

Coloque os prints em `docs/images/` e referencie aqui:

```md
![Wireframe desktop](images/figma-wireframe-desktop.png)
![Protótipo desktop](images/figma-prototipo-desktop.png)
![Mobile](images/figma-mobile.png)
![Estados](images/figma-estados.png)
```
