# Identidade — quando o cliente já tem uma

O caso comum não é marca em branco. É cliente com identidade pronta: manual de marca, site no ar, arquivo do designer, ou só "essas são minhas cores". O trabalho é **transcrever**, não criar.

## 1. Onde procurar, nesta ordem

| Fonte | O que dá | Confiança |
|---|---|---|
| `DESIGN.md` / `design.md` / `frame.md` no repo do projeto | tudo, com o porquê | **máxima** — usar e parar de procurar |
| Manual de marca (PDF) | cor, fonte, uso do logo, proibições | alta |
| CSS/Tailwind do site no ar (`@theme`, `:root`) | tokens exatos | alta |
| Perfil no sistema do cliente (ex.: ApexRealty `brandColor`) | a cor que **ele mesmo escolheu** | alta |
| Print, foto de cartão, "acho que é esse verde" | nada exato | **baixa** — confirmar antes de usar |

Nunca tire cor de screenshot com conta-gotas se existir arquivo. Compressão e perfil de cor mentem.

> Caso real: um projeto já tinha um `DESIGN.md` de 16KB com os hex oficiais, a escala de raio, o papel de cada cor e as armadilhas de contraste. Adivinhar a paleta "olhando o site" teria produzido texto ilegível — o verde da marca reprovava como texto em 2,22:1 e só servia como preenchimento.

## 2. O que a brand.json precisa carregar

Três camadas, e as três importam. Marca não é paleta.

```jsonc
"colors": { "bg","surface","line","fg","muted","accent","accent-2","on-accent" },
"fonts":  { "font-display","font-body","font-marca" },   // font-marca é opcional
"style":  { "radius-chip","radius-card","radius-frame","borda","sombra",
            "ambiente","display-w","display-track" }
```

**`style` é o que impede duas marcas de saírem iguais.** Mesma composição com raio 26 + sombra suave + superfície tingida numa marca clara, e raio 10 + zero sombra + superfície `#141414` numa marca escura, produz peças que não parecem parentes. Sem `style`, todo cliente vira a mesma peça pintada de outra cor.

### Os dois papéis do accent

Erro que já custou meia dúzia de falhas de contraste: **cor de marca como preenchimento e como texto quase nunca é o mesmo valor.**

- `accent` → a marca quando é **texto** (kicker, link, número). Precisa de 4,5:1 sobre o fundo.
- `accent-2` → a marca quando é **preenchimento** (bloco, botão).
- `on-accent` → o texto **por cima** do preenchimento. Em marca clara é escuro; em marca escura é claro. Não é opcional e não é sempre branco.

Confundir os dois é o que faz botão bonito e ilegível.

### Fonte com uso restrito

Se o manual diz "esta fonte só no logotipo" ou "só em preço", **ela não é `font-display`** — vira `font-marca`, um token separado que só a assinatura consome. Deixá-la em `font-display` obriga cada peça a se lembrar de sobrescrever, e uma hora alguém esquece — já aconteceu.

## 3. O que NÃO vai para a brand.json

Regra que não é valor de CSS vira prosa em `restricoes` ou `$composicao`, para o agente ler:

- "foto sempre em moldura, nunca sangrada"
- "o logo nunca é recolorido"
- "CRECI obrigatório em toda peça publicitária"
- "fundo branco puro, nunca bege"

## 4. Confirmar antes de produzir

Marca nova ou transcrita, mostre ao usuário antes da primeira peça: as cores com seu papel, as fontes, e as restrições que você extraiu. Errar a identidade contamina tudo que sair depois — e é o retrabalho mais caro do fluxo.

Faltou cor ou logo? **Pergunte.** Não invente e não pegue "um verde parecido".
