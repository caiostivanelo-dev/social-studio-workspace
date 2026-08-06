# Copy pt-BR — hook, legenda, roteiro

Regra que vale mais que todas: **antes de escrever, ler `voz`, `publico`, `provas` e `restricoes` do brand.json.** Copy que ignora o brand.json é copy genérica.

## Hook (o que decide tudo)

Os 3 primeiros segundos / a primeira linha carregam 80% do resultado. Escreva **5 hooks**, escolha 1, guarde os outros para variações de teste.

Padrões que funcionam, do mais forte pro mais fraco:

| Padrão | Molde | Exemplo |
|---|---|---|
| Custo escondido | "Você está pagando X sem saber" | "Sua agenda no WhatsApp custa 2 clientes por semana" |
| Contraste antes/depois | "Era X. Virou Y em Z" | "Era planilha. Virou sistema em 3 semanas" |
| Erro nomeado | "O erro que quase todo [público] comete" | "O erro que toda clínica comete no primeiro sistema" |
| Número específico | "[N] [coisas] que [resultado]" | "4 telas que cortaram 6h/semana da recepção" |
| Contra-consenso | "Todo mundo diz X. Não é bem assim" | "Não, você não precisa de app. Precisa de link" |

Proibido como hook: pergunta retórica ("Você sabia que...?"), saudação ("Fala pessoal!"), autoelogio ("Somos referência em...").

## Legenda (Instagram/LinkedIn)

Estrutura em 5 blocos:

1. **Hook** — 1 linha. É o que aparece antes do "mais".
2. **Quebra** — linha em branco. Sem isso o Instagram corta no meio da frase.
3. **Corpo** — 3 a 6 linhas curtas, uma ideia por linha. Concreto: número, prazo, nome da ferramenta.
4. **CTA** — um só, do array `ctas` do brand.json. Dois CTAs = zero CTA.
5. **Hashtags** — `fixas` + 3 a 5 das `rotativas`. Nunca 30. Ao final, depois de uma linha em branco.

Tamanho: 400–800 caracteres no IG, 900–1300 no LinkedIn (lá o texto é o post).

## Roteiro de Reel / Story (15–30s)

```
0–2s   HOOK visual + texto na tela. Sem intro, sem logo.
2–8s   PROBLEMA — mostra a dor acontecendo, não descreve.
8–20s  DEMONSTRAÇÃO — a tela real, o antes/depois, o número.
20–25s PROVA — case, print, métrica.
25–30s CTA — uma frase, texto grande, congela 2s.
```

Texto na tela: **máximo 7 palavras por cartão**. Legenda queimada sempre (85% assiste sem som).

## Carrossel

- Slide 1 = capa: hook + "arrasta". Nada além disso.
- Slides 2..n-1 = uma ideia por slide. Se precisou de duas, são dois slides.
- Último slide = CTA. Não repetir o conteúdo.
- 5 a 8 slides. Mais que isso, a taxa de conclusão despenca.

## Antes de publicar

- [ ] O hook faz sentido lido sozinho, sem a imagem?
- [ ] Tem um número, um prazo ou um nome próprio no corpo?
- [ ] Passou por `voz.evitar` do brand.json?
- [ ] Um CTA só?
- [ ] Alt text escrito (acessibilidade + alcance)?
