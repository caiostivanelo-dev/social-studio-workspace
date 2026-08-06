# Workspace de social media

Este repositório existe para produzir peças de social media com a skill
**Apexdev-social-studio**, que está em `.claude/skills/` e carrega sozinha.

## Convenções

- **Marcas** ficam em `marcas/<empresa>.json`. Uma por cliente ou negócio.
- **Peças** ficam em `pecas/AAAA-MM-DD-assunto/`, uma pasta por peça:
  `BRIEFING.md`, `legenda.md`, o HTML fonte, `assets/`, `feed/`, `story/`.
- Os caminhos são relativos à raiz do repositório.

## Comandos

O renderizador vive dentro da skill. Da raiz do repo:

```bash
node .claude/skills/Apexdev-social-studio/scripts/shoot.mjs \
  pecas/<peça>/<arquivo>.html --format=ig-post --brand=marcas/<empresa>.json \
  --out=pecas/<peça>/feed
```

Formatos disponíveis: `--formats`. Ordem de serviço: `scripts/briefing.mjs`.
Ponte para vídeo: `scripts/brand2frame.mjs`.

## Regras deste workspace

1. **Nenhuma peça começa sem marca.** Se `marcas/` estiver vazio, a primeira
   tarefa é criar uma — pergunte cor, fonte, tom de voz e restrições, e confirme
   antes de produzir. Peça sem identidade sai genérica e vira retrabalho.
2. **Commite as peças.** É assim que os arquivos chegam ao celular ou ao
   computador de quem pediu — pelo diff da sessão ou pelo GitHub.
3. **Leia o PNG antes de entregar.** Gerar não é conferir; layout estourado só
   aparece na imagem.
4. **Publicar é ação externa.** Entregue os arquivos e o texto; quem posta é a
   pessoa.

## Ambiente

Em sessão na nuvem, o hook `scripts/preparar.sh` garante o Chrome que o
renderizador usa. Se algum comando reclamar que não achou Chrome, peça para
rodar `bash scripts/preparar.sh` e tente de novo.
