#!/usr/bin/env node
/**
 * briefing.mjs — abre a ordem de serviço de uma peça.
 *
 * É o artefato que viaja: todo executor (copy, arte, hyperframes, ffmpeg) lê ESTE
 * arquivo. Os trilhos da marca são injetados a partir do brand.json, então ninguém
 * precisa lembrar de copiar restrição — e ninguém tem desculpa para ignorar.
 *
 *   node briefing.mjs lancamento-medapex --brand=brands/apexdev.json \
 *     --formato=carrossel --rede=instagram --objetivo="anunciar o modulo de teleconsulta" \
 *     --ref=./refs/concorrente.png --ref=https://exemplo.com/post
 *
 *   node briefing.mjs --selftest
 *
 * Não sobrescreve briefing já existente sem --force (o preenchido vale mais que o molde).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert';
import { pathToFileURL } from 'node:url';

const FORMATOS = ['post', 'carrossel', 'story', 'reel', 'capa', 'video'];

const bullets = (arr, vazio = '_(nada definido no brand.json)_') =>
  arr?.length ? arr.map((x) => `- ${x}`).join('\n') : vazio;

export function buildBriefing({ slug, brand, brandPath, formato = 'post', rede = 'instagram', objetivo = '', refs = [] }) {
  if (!slug) throw new Error('Falta o nome da peça (slug).');
  if (!FORMATOS.includes(formato)) throw new Error(`Formato "${formato}" inválido. Use: ${FORMATOS.join(', ')}`);
  if (!brand?.empresa) throw new Error('brand.json sem "empresa" — arquivo errado?');

  const c = brand.colors || {};
  const voz = brand.voz || {};
  const precisaVideo = formato === 'reel' || formato === 'video';

  const tabelaRefs = refs.length
    ? refs.map((r, i) => `| ${i + 1} | \`${r}\` | _preencher: estrutura? ritmo? enquadramento?_ | _preencher_ |`).join('\n')
    : '| — | _nenhuma referência recebida_ | | |';

  return `# Ordem de serviço — ${slug}

| | |
|---|---|
| **Marca** | ${brand.empresa} — \`${brandPath}\` |
| **Formato** | ${formato} |
| **Rede** | ${rede} |
| **Objetivo** | ${objetivo || '_preencher_'} |

**Status:** \`[ ] copy\` → \`[ ] arte\` → \`${precisaVideo ? '[ ] vídeo' : '[—] vídeo'}\` → \`[ ] gate\` → \`[ ] entrega\`

---

## 1. Referências recebidas

Referência serve para **estrutura, ritmo e enquadramento**. Nunca para arte, cor, fonte ou copy.
Se a resposta na coluna "o que aproveitar" for "o visual", a referência foi mal lida — volte e escreva o que ela faz de certo.

| # | Origem | O que aproveitar | O que NÃO copiar |
|---|---|---|---|
${tabelaRefs}

> Referência de concorrente entra como diagnóstico, não como molde. Arte, marca e claim são dele.

---

## 2. Trilhos da marca

<!-- INJETADO de ${brandPath} por briefing.mjs — não editar aqui. Mude o brand.json e regenere. -->

**Cores:** bg \`${c.bg || '?'}\` · texto \`${c.fg || '?'}\` · accent \`${c.accent || '?'}\` · secundário \`${c.muted || '?'}\`
**Fontes:** display \`${brand.fonts?.['font-display'] || '?'}\` · corpo \`${brand.fonts?.['font-body'] || '?'}\`
**Tom:** ${voz.tom || '_não definido_'}
**Público:** ${brand.publico || '_não definido_'}

**Nunca usar (voz):**
${bullets(voz.evitar)}

**Restrições da marca:**
${bullets(brand.restricoes)}

**CTAs aprovados — escolher UM:**
${bullets(brand.ctas)}

**Hashtags:** fixas ${(brand.hashtags?.fixas || []).join(' ') || '—'} + 3 a 5 de: ${(brand.hashtags?.rotativas || []).join(' ') || '—'}

---

## 3. Copy — _executor: este estúdio (references/copy-pt.md) + \`copywriting\` se for venda direta_

**5 hooks** (escrever todos, marcar o escolhido com ✅):

1.
2.
3.
4.
5.

**Texto final:**

\`\`\`

\`\`\`

**Legenda + hashtags + alt text:**

\`\`\`

\`\`\`

---

## 4. Arte — _executor: este estúdio (\`scripts/shoot.mjs\`)_

\`\`\`bash
cp templates/archetypes.css templates/carrossel.html ./${slug}/
mv ./${slug}/carrossel.html ./${slug}/${slug}.html
node scripts/shoot.mjs ./${slug}/${slug}.html --format=<formato> --brand=${brandPath}
\`\`\`

Boards planejados: _(um por slide, uma ideia cada)_

1.
2.
3.

${precisaVideo ? `---

## 5. Vídeo — _executor: skill \`hyperframes\` (composição) + \`ffmpeg\` (finalização)_

Ponte da marca — **rodar antes de compor**:

\`\`\`bash
node scripts/brand2frame.mjs ${brandPath} --out=./${slug}/frame.md --unit=9:16
npx hyperframes init ${slug}-video --example blank
\`\`\`

Roteiro (0–2s hook · 2–8s problema · 8–20s demonstração · 20–25s prova · 25–30s CTA):

| t | Tela | Texto (máx. 7 palavras) |
|---|---|---|
| 0–2s | | |
| 2–8s | | |
| 8–20s | | |
| 20–25s | | |
| 25–30s | | |

Capa: \`node scripts/shoot.mjs ... --format=ig-reel-capa\`

` : ''}---

## ${precisaVideo ? 6 : 5}. Gate de saída

Nada sai sem todos marcados:

- [ ] Cor e fonte vieram do brand.json (não de "achei bonito")
- [ ] Passou por **Nunca usar** e **Restrições** acima, item por item
- [ ] PNG/MP4 **aberto e olhado**, não só gerado
- [ ] Medida exata da rede
- [ ] Texto fora da área segura (story/reel/tiktok)
- [ ] Um CTA só, da lista aprovada
- [ ] Alt text escrito
- [ ] Nenhuma referência foi copiada em arte, cor, fonte ou claim

## ${precisaVideo ? 7 : 6}. Entrega

\`\`\`
${slug}/
├─ out/          arquivos finais
├─ BRIEFING.md   este arquivo, preenchido
└─ ${slug}.html  fonte editável
\`\`\`

Publicar é ação externa — **confirmar com o usuário antes**.
`;
}

function write({ slug, brandPath, outDir, force, ...rest }) {
  const brand = JSON.parse(fs.readFileSync(brandPath, 'utf8'));
  const dir = outDir || path.join(process.cwd(), slug);
  const file = path.join(dir, 'BRIEFING.md');
  if (fs.existsSync(file) && !force)
    throw new Error(`${file} já existe. Use --force para sobrescrever (você perde o que já foi preenchido).`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, buildBriefing({ slug, brand, brandPath, ...rest }));
  return file;
}


/** Marca de teste embutida: o autoteste não pode depender de arquivo de
 *  cliente, senão a skill quebra ao ser distribuída sem eles. */
const MARCA_TESTE = {
  empresa: 'Marca Teste',
  colors: { bg: '#ffffff', surface: '#f5f5f5', line: '#e5e5e5', fg: '#111111',
            muted: '#666666', accent: '#c21fe0', 'accent-2': '#7a1de0', 'on-accent': '#ffffff' },
  fonts: { 'font-display': "'Archivo', sans-serif", 'font-body': "'Inter', sans-serif" },
  voz: { tom: 'Direto.', pessoa: 'nós', evitar: ['revolucionário', 'excelência'], usar: ['números'] },
  publico: 'Quem decide.',
  ctas: ['Manda um direct'],
  restricoes: ['Nunca recolorir a marca'],
  hashtags: { fixas: ['#teste'], rotativas: ['#a', '#b'] },
};

function selftest() {
  const tmpBrand = fs.mkdtempSync(path.join(os.tmpdir(), 'marca-'));
  const brandPath = path.join(tmpBrand, 'marca.json');
  fs.writeFileSync(brandPath, JSON.stringify(MARCA_TESTE));
  const brand = MARCA_TESTE;

  const md = buildBriefing({
    slug: 'teste', brand, brandPath, formato: 'reel',
    objetivo: 'testar', refs: ['./a.png', 'https://b.com'],
  });

  // os trilhos precisam chegar literalmente, senão o executor não os vê
  assert.ok(md.includes(brand.colors.accent), 'accent não foi injetado');
  assert.ok(md.includes(brand.restricoes[0]), 'restrições não chegaram');
  assert.ok(md.includes(brand.ctas[0]), 'CTAs não chegaram');
  assert.ok(brand.voz.evitar.every((e) => md.includes(e)), 'lista "nunca usar" incompleta');
  // referências viram linhas da tabela, com as duas colunas de decisão
  assert.ok(md.includes('`./a.png`') && md.includes('`https://b.com`'), 'referências não listadas');
  assert.match(md, /O que NÃO copiar/, 'falta a coluna que segura a cópia');
  // reel ganha seção de vídeo; post não
  assert.ok(md.includes('brand2frame.mjs'), 'reel precisa da ponte da marca');
  assert.ok(!buildBriefing({ slug: 't', brand, brandPath, formato: 'post' }).includes('brand2frame.mjs'),
    'post não deve carregar seção de vídeo');
  // sem referência, a tabela ainda é válida
  assert.ok(buildBriefing({ slug: 't', brand, brandPath }).includes('nenhuma referência recebida'));
  // validações
  assert.throws(() => buildBriefing({ brand, brandPath }), /slug/);
  assert.throws(() => buildBriefing({ slug: 't', brand, brandPath, formato: 'tiktok' }), /inválido/);
  assert.throws(() => buildBriefing({ slug: 't', brand: {}, brandPath }), /empresa/);

  // não sobrescreve trabalho preenchido
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'briefing-'));
  write({ slug: 't', brandPath, outDir: dir });
  fs.appendFileSync(path.join(dir, 'BRIEFING.md'), '\nCONTEUDO PREENCHIDO');
  assert.throws(() => write({ slug: 't', brandPath, outDir: dir }), /já existe/);
  assert.ok(fs.readFileSync(path.join(dir, 'BRIEFING.md'), 'utf8').includes('CONTEUDO PREENCHIDO'));
  write({ slug: 't', brandPath, outDir: dir, force: true }); // --force passa
  fs.rmSync(dir, { recursive: true, force: true });

  console.log('selftest ok — trilhos injetados, referências registradas, vídeo condicional, sem clobber.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2);
  const flag = (k, d) => { const a = argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
  if (argv.includes('--selftest')) selftest();
  else {
    const slug = argv.find((a) => !a.startsWith('--'));
    if (!slug) {
      console.error('uso: node briefing.mjs <slug> --brand=brands/<empresa>.json [--formato=post|carrossel|story|reel|capa|video]');
      console.error('     [--rede=instagram] [--objetivo="..."] [--ref=arquivo-ou-link] (repetível) [--out=dir] [--force]');
      process.exit(1);
    }
    console.log(write({
      slug,
      brandPath: flag('brand', 'brands/apexdev.json'),
      formato: flag('formato', 'post'),
      rede: flag('rede', 'instagram'),
      objetivo: flag('objetivo', ''),
      refs: argv.filter((a) => a.startsWith('--ref=')).map((a) => a.slice(6)),
      outDir: flag('out'),
      force: argv.includes('--force'),
    }));
  }
}
