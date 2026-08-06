---
name: Apexdev-social-studio
description: Orquestrador de social media para uma empresa — recebe o pedido e as referências, abre a ordem de serviço com os trilhos da marca, despacha para quem executa (copy, arte, HyperFrames, ffmpeg, publicação) e confere tudo na volta. Cria post, carrossel, story, capa e roteiro de Reel, anima logo, edita vídeo e escreve a legenda com hashtags. Use quando pedirem "cria um post", "monta um carrossel", "faz um story", "roteiro de Reel", "anima o logo", "edita esse vídeo", "calendário de conteúdo", "conteúdo para o Instagram/LinkedIn/TikTok", ou quando mandarem uma referência de post/vídeo pedindo algo parecido. Renderiza PNG nas medidas exatas de cada rede sem depender de Canva, Figma ou MCP externo.
---

# Social Studio

**Este estúdio é maestro, não instrumentista.** Ele não compõe vídeo nem desenha ícone — quem faz isso é o `hyperframes`, o `ffmpeg`, o `logo-animation`. O que ele faz e ninguém mais faz: **manter a marca inteira do briefing até a entrega**, e não deixar o executor sair do trilho.

O ciclo:

**Marca → Referências → Ordem de serviço → Despacho → Gate → Entrega.**

Detalhe de como receber referência, o contrato de despacho e o gate de volta: [references/orquestracao.md](references/orquestracao.md).

---

## 0. A marca vem primeiro (obrigatório)

Toda peça sai de um `brands/<empresa>.json` com três camadas: **`colors`, `fonts` e `style`** (raio, borda, sombra, superfície de ambiente), mais tom de voz, público, provas, CTAs e restrições.

- Já existe? Leia antes de escrever qualquer coisa.
- **O cliente já tem identidade visual?** É o caso comum. Leia [references/identidade.md](references/identidade.md) — onde procurar, o que transcrever, e os dois erros que mais custam (os dois papéis do accent; fonte de uso restrito).
- Não existe nada? Copie `brands/_template.json`, preencha com o que o usuário contar e **confirme com ele** antes de produzir. Se faltar cor ou logo, pergunte — não invente.
- Neste workspace as marcas ficam em `marcas/<empresa>.json`, na raiz do repositório.

`style` não é enfeite: é o que impede duas marcas de saírem como a mesma peça pintada de outra cor.

<HARD-GATE>
Antes de escrever copy ou HTML, você precisa ter o brand.json na mão. Se estiver alcançando `#3b82f6`, `Roboto` ou "solução completa", você pulou esta etapa.
</HARD-GATE>

---

## 1. Briefing e referências

Pergunte só o que muda a peça (uma mensagem, não um formulário):

1. **Objetivo** — vender, ensinar, provar autoridade ou anunciar?
2. **Formato** — post, carrossel, story, Reel, ou "decide você"?
3. **Rede** — Instagram, LinkedIn, TikTok, mais de uma?
4. **Assunto** — o que precisa estar na peça?

Se o usuário já disse tudo isso, não pergunte nada. Comece.

### Veio referência junto?

Print, link, PDF, vídeo do concorrente ou "queria algo tipo aquilo". **Olhe e escreva o que ela FAZ, não com o que ela PARECE** — "fundo escuro com neon" é inútil; "o hook aparece antes de qualquer marca, só 4 slides" é acionável.

| Aproveitar | Nunca copiar |
|---|---|
| Estrutura, ritmo, enquadramento, tipo de prova | Paleta, fonte, logo, copy, claim, números alheios |

Referência de concorrente é diagnóstico, não molde. Referência da própria marca pode ser copiada em estrutura *e* estilo. Se veio foto/logo/screenshot do cliente, não é referência: é **material**, vai para `<peça>/assets/`.

### Abra a ordem de serviço

```bash
node scripts/briefing.mjs lancamento-medapex --brand=brands/apexdev.json \
  --formato=carrossel --rede=instagram --objetivo="anunciar teleconsulta" \
  --ref=./refs/concorrente.png --ref=https://exemplo.com/post
```

Gera `<slug>/BRIEFING.md` com os trilhos da marca **injetados do brand.json** — cores, voz, `evitar`, restrições, CTAs, hashtags — mais a tabela de referências e o gate de saída. **É o único artefato que viaja: todo executor lê ele.** Não sobrescreve briefing preenchido sem `--force`.

Para **calendário/plano** (várias peças), use `marketing:campaign-plan` para a grade, depois um `BRIEFING.md` por peça. Aí sim vale despachar em paralelo (`superpowers:dispatching-parallel-agents`) — uma peça só não justifica subagente.

---

## 1.5 Contrato de despacho

Ao acionar qualquer executor, o handoff carrega **sempre estas quatro coisas**. Handoff sem elas é onde a marca se perde:

1. Caminho do `BRIEFING.md`
2. O bloco **Trilhos da marca**, colado inteiro — não "veja o brand.json", **colado**
3. A tarefa específica, com o entregável nomeado
4. O que **não** é para fazer — restrições da marca + o que a referência proíbe copiar

Tabela completa de executores em [references/orquestracao.md](references/orquestracao.md).

---

## 2. Copy

Leia [references/copy-pt.md](references/copy-pt.md) — hooks, estrutura de legenda, roteiro de Reel, checklist.

Escreva **5 hooks, escolha 1**. Entregue sempre: hook, texto dos slides/tela, legenda completa, hashtags e alt text.

Skills que somam:
- `copywriting` — quando a peça é de venda direta.
- `humanizer` — passe a legenda por ela se o texto saiu com cara de IA.
- uma skill de conteúdo SEO, se houver — quando o post vira também artigo/blog.

---

## 3. Arte estática (post, carrossel, story, capa)

O renderizador é local: HTML → PNG na medida exata. Sem Canva, sem Figma, sem MCP.

```bash
node scripts/shoot.mjs --formats
```

### Arquétipos: composição vem da biblioteca, estilo vem da marca

`templates/archetypes.css` é a biblioteca de layouts. **Ela não decide cor, raio, borda nem sombra** — só onde as coisas sentam. Tudo o mais vem do `brand.css` gerado da identidade. Se você escrever um hex ou um `border-radius` literal numa peça, o próximo cliente herda a marca do anterior.

| Classe no `<section>` | Quando usar |
|---|---|
| `a-capa-tipo` | capa em que a frase é o produto |
| `a-capa-foto` | capa com moldura de foto no topo |
| `a-declaracao` | uma frase só ocupando o frame |
| `a-dados` | grade de números — substitui adjetivo |
| `a-lista` | uma ideia por linha, numerada |
| `a-foto-cheia` | foto sangrada com texto sobreposto |
| `a-numero` | uma métrica carrega o board |
| `a-cta` | bloco de ação no fim |

**A variedade do carrossel vem de alternar arquétipos, não da marca.** Seis boards com o mesmo arquétipo saem seis peças iguais, por mais rica que seja a identidade.

Estrutura de um board: `.kicker` (topo) · `.corpo` (elástico) · `.sig` (rodapé). O corpo é `1fr` num grid de três faixas — foi o `flex + spacer no fim` que produzia metade da peça em branco.

Peças prontas: `.moldura` (foto), `.painel` (superfície de ambiente), `.bloco` (preenchimento com accent), `.chips`, `.grade`.

### Fluxo

```bash
# 1. leve a biblioteca e crie o HTML da peça
cp templates/archetypes.css templates/carrossel.html ./minha-peca/

# 2. cada <section class="board a-*"> é um slide. Escolha o arquétipo por slide.
#    O HTML linka archetypes.css e brand.css, nessa ordem.

# 3. renderize — o --brand gera o brand.css com cor, fonte e style da marca
node scripts/shoot.mjs ./minha-peca/carrossel.html --format=ig-post --brand=brands/apexdev.json
```

Saem `lancamento-ig-post-01.png`, `-02.png`, ... um por board, em `./minha-peca/out/`.

Flags: `--out=dir` · `--boards=1,3` (só alguns slides) · `--scale=2` (2x, para anúncio) · `--format=` qualquer chave de `scripts/formats.json`.

**Conferir o resultado**: abra o HTML sem query string no navegador (`?` vazio) para ver todos os boards empilhados com as guias de área segura. E **sempre leia o PNG gerado** antes de entregar — layout que estourou só aparece na imagem.

### Regras de arte que não se negociam

- **Área segura**: story, Reel e TikTok têm topo e base cobertos pela UI do app. O `shoot.mjs` injeta as margens; o template já as respeita. Nunca coloque texto ou logo lá.
- **Uma ideia por board.** Se precisou de duas, são dois boards.
- **Contraste**: meça o texto contra o fundo real dele (o card, não a página). Mínimo AA.
- **Legibilidade no feed**: o título precisa ser legível na miniatura. Se some a 1/4 do tamanho, está pequeno.
- Não recolorir o logo. Não usar marca de terceiros.

Para direção visual mais ambiciosa, invoque `impeccable` ou `high-end-visual-design`. Para conferir se a imagem bate com a spec da rede, a skill `social-media-image-sizes` valida e redimensiona.

---

## 4. Vídeo, Reel e animação de logo

Leia [references/motion.md](references/motion.md).

**Este estúdio não monta a composição do vídeo — o HyperFrames monta.** O que ele faz é entregar a marca e o roteiro prontos, para o vídeo não sair com identidade diferente do post. A ponte é obrigatória e vem antes de tudo:

```bash
node scripts/brand2frame.mjs brands/apexdev.json --out=./meu-reel/frame.md --unit=9:16
```

Isso gera o `frame.md` que o HyperFrames lê como fonte de verdade: mesmas cores, mesma fonte, área segura, limite de 7 palavras por cartão, restrições e CTAs aprovados. Depois disso, invoque a skill `hyperframes` e componha. Nunca edite o `frame.md` à mão — edite o `brand.json` e regenere.

| Pedido | Ferramenta |
|---|---|
| Roteiro, hook, texto de tela | aqui — [references/copy-pt.md](references/copy-pt.md) |
| Marca dentro do vídeo | aqui — `scripts/brand2frame.mjs` |
| Compor e renderizar o Reel | skill `hyperframes` → `npx hyperframes render` |
| Animar o logo | skill `logo-animation`; Lottie, MP4 ou WebM alpha |
| Cortar, legendar, converter vídeo existente | skill `video-processing-editing` + `ffmpeg` |
| Princípios de motion (timing, easing, peso) | skill `video-motion-graphics` |
| Capa do Reel | aqui — `shoot.mjs --format=ig-reel-capa` |

---

## 5. Entrega

Entregue sempre um pacote, não arquivos soltos:

```
minha-peca/
├─ out/            PNGs / MP4 nas medidas certas
├─ BRIEFING.md     a ordem de serviço, preenchida e com o gate marcado
├─ assets/         material recebido (fotos, logos, screenshots)
└─ lancamento.html fonte editável (dá pra ajustar e re-renderizar)
```

Publicação: se houver uma skill de publicação instalada, use-a. **Publicar é ação externa — confirme com o usuário antes.** Sem ela, entregue os arquivos e o texto para o usuário postar à mão, que é o caminho padrão.

Se a peça virar anúncio pago, o caminho é uma skill de mídia paga (ex.: `claude-ads:ads-creative`), não este estúdio.

---

## O gate — antes de dizer "pronto"

**O gate vive no `BRIEFING.md` da peça.** Marque item por item lá, não de cabeça. O maestro confere, não o executor — o que volta do executor não é entregável até passar.

Os dois que mais falham:

- **"PNG aberto e olhado"** — gerar não é conferir. Texto estourado e contraste ruim só aparecem na imagem. Leia o arquivo.
- **"Passou por Nunca usar"** — item por item. Executor com pressa reescreve "solução completa" sem perceber.

Reprovou? Devolve nomeando o item do gate que falhou, não "não ficou bom".

---

## Skills que este estúdio chama

Ele é maestro: delega. Confira o que existe antes de prometer ao usuário, e **degrade
para o caminho inline** quando faltar.

**Nada é obrigatório para arte estática.** Post, carrossel, story e capa saem só com
`scripts/shoot.mjs`, que não depende de skill nenhuma.

| Para | Skill | Se não existir |
|---|---|---|
| Reel, motion, animação | `hyperframes` | sem vídeo — entregue a arte estática e diga por quê |
| Animar logo | `logo-animation` | o `hyperframes` cobre o essencial |
| Cortar/legendar vídeo | `video-processing-editing` | `ffmpeg` direto ([references/motion.md](references/motion.md)) |
| Princípios de motion | `video-motion-graphics` | opcional |
| Validar medida | `social-media-image-sizes` | o `shoot.mjs` já falha se sair fora |
| Copy de venda | `copywriting` | escreva por [references/copy-pt.md](references/copy-pt.md) |
| Texto com cara de IA | `humanizer` | reescreva pela lista `voz.evitar` |
| Direção visual ambiciosa | `impeccable` / `high-end-visual-design` | opcional |
| Plano de várias peças | `marketing:campaign-plan` | monte a grade à mão |
| Despacho paralelo | `superpowers:dispatching-parallel-agents` | faça em série |
| Publicar | skill de publicação, se houver | entregue os arquivos para postar à mão |

## Manutenção

Três autotestes, rode se mexer nos scripts:

```bash
node scripts/shoot.mjs --selftest       # carrossel, slide avulso, medidas exatas
node scripts/brand2frame.mjs --selftest # frontmatter, átomos da marca, área segura
node scripts/briefing.mjs --selftest    # trilhos injetados, referências, sem clobber
```
