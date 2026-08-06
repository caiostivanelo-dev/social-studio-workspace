# Orquestração — receber referência, despachar, conferir na volta

Este estúdio é **maestro, não instrumentista**. Ele não compõe vídeo, não desenha ícone, não escreve artigo. O que ele faz e ninguém mais faz: manter a marca inteira do briefing até a entrega, e não deixar o executor sair do trilho.

Três responsabilidades: **entrada** (referência vira decisão), **despacho** (o executor recebe os trilhos junto), **volta** (nada passa sem gate).

---

## 1. Entrada — o que fazer com uma referência

Referência chega como print, link, PDF, vídeo do concorrente ou "queria algo tipo aquilo". Sempre a mesma leitura:

**Olhe e escreva o que ela FAZ, não com o que ela PARECE.** "Fundo escuro com neon" é inútil. "Hook aparece antes de qualquer marca; o número grande ocupa 1/3 do slide; só 4 slides" é acionável.

| Aproveitar | Nunca copiar |
|---|---|
| Estrutura (quantos slides, o que vem em cada) | Paleta, fonte, tratamento gráfico |
| Ritmo e pacing (onde acelera, onde segura) | Logo, marca, mascote, ilustração |
| Enquadramento e hierarquia | Copy, headline, claim |
| Tipo de prova usada (número, print, depoimento) | Números e cases que não são nossos |

Registre as duas colunas na tabela de referências do `BRIEFING.md`. Se "o que aproveitar" ficou vago, a referência foi mal lida — volte.

Referência de **concorrente** é diagnóstico, não molde. Referência da **própria marca** (post antigo que foi bem) pode ser copiada em estrutura *e* estilo — é a mesma marca.

Se a referência entra como **asset** (foto do cliente, logo, screenshot de produto), ela não é referência: é material. Vai para `<peça>/assets/` e é usada de verdade.

---

## 2. Abrir a ordem de serviço

```bash
node scripts/briefing.mjs lancamento-medapex --brand=brands/apexdev.json \
  --formato=carrossel --rede=instagram \
  --objetivo="anunciar teleconsulta" \
  --ref=./refs/concorrente.png --ref=https://exemplo.com/post
```

Gera `<slug>/BRIEFING.md` com os trilhos da marca **injetados do brand.json** — cores, voz, restrições, CTAs, hashtags. É o único artefato que viaja. Todo executor lê ele.

Não sobrescreve briefing preenchido sem `--force`.

---

## 3. Despacho — o contrato

Ao acionar qualquer executor, o handoff carrega **sempre estas quatro coisas**. Handoff sem elas é onde a marca se perde:

1. Caminho do `BRIEFING.md`
2. O bloco **Trilhos da marca**, colado inteiro (não "veja o brand.json" — colado)
3. A tarefa específica, com o entregável nomeado
4. O que **não** é para fazer — as restrições da marca e o que a referência proíbe copiar

| Tarefa | Executor | Vai junto |
|---|---|---|
| Copy de venda | skill `copywriting` | trilhos + público + provas |
| Texto com cara de IA | skill `humanizer` | trilhos + `voz.evitar` |
| Arte estática | este estúdio (`shoot.mjs`) | brand.json direto na flag `--brand` |
| Direção visual ambiciosa | skill `impeccable` / `high-end-visual-design` | trilhos + o HTML da peça |
| Compor Reel | skill `hyperframes` | **`frame.md` gerado por `brand2frame.mjs`** + roteiro |
| Animar logo | skill `logo-animation` | SVG do brand.json + trilhos + duração (0.8–1.5s) |
| Cortar/legendar vídeo | skill `video-processing-editing` | arquivo + formato de saída + trilhos |
| Validar medida | skill `social-media-image-sizes` | o PNG + a spec da rede |
| Plano de várias peças | skill `marketing:campaign-plan` | brand.json + objetivo do mês |
| Publicar | skill de publicação, se houver | arquivos + legenda — **confirmar com o usuário antes** |

Vídeo tem uma regra dura: **`brand2frame.mjs` roda antes de invocar `hyperframes`.** Sem o `frame.md`, o HyperFrames escolhe a própria paleta e o Reel sai com marca diferente do post.

**Várias peças de uma vez** (calendário do mês, um post por serviço): aí sim vale despachar em paralelo — cada peça com seu `BRIEFING.md` próprio, um agente por peça. Veja `superpowers:dispatching-parallel-agents`. Uma peça só não justifica subagente.

---

## 4. Volta — o gate

O que volta do executor **não é entregável até passar no gate** do `BRIEFING.md`. O maestro confere, não o executor.

Os dois que mais falham na prática:

- **"PNG aberto e olhado"** — gerar não é conferir. Texto estourado, sobreposição e contraste ruim só aparecem na imagem. Leia o arquivo.
- **"Passou por Nunca usar"** — item por item, não por impressão. Executor com pressa reescreve "solução completa" sem perceber.

Reprovou? Devolve com o item do gate que falhou, não com "não ficou bom".

---

## 5. Quando NÃO orquestrar

- Ajuste de uma linha de legenda → faz e pronto.
- Anúncio pago → sai deste estúdio, vai para uma skill de mídia paga.
- Marca sem `brand.json` → **para**. Monta a marca primeiro, ou tudo que sair vira retrabalho.
