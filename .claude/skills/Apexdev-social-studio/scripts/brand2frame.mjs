#!/usr/bin/env node
/**
 * brand2frame.mjs — brands/<empresa>.json  ->  frame.md do HyperFrames.
 *
 * A ponte entre a arte estática e o vídeo: o mesmo brand.json que pinta os PNGs
 * passa a pintar as composições do HyperFrames, sem ninguém redigitar hex.
 *
 *   node brand2frame.mjs brands/apexdev.json --out=./meu-reel/frame.md
 *   node brand2frame.mjs brands/apexdev.json --unit=9:16
 *   node brand2frame.mjs --selftest
 *
 * O HyperFrames lê frame.md (camada de vídeo) como fonte de verdade da marca.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert';
import { pathToFileURL } from 'node:url';

const UNITS = {
  '16:9': { w: 1920, h: 1080, nome: 'landscape' },
  '9:16': { w: 1080, h: 1920, nome: 'vertical — Reel/Story/TikTok' },
  '1:1':  { w: 1080, h: 1080, nome: 'quadrado' },
};

/**
 * Versão translúcida de uma cor, para tints e bordas derivadas do accent.
 *
 * `color-mix` em vez de converter hex→rgba na mão: a marca pode declarar a cor
 * em hex, oklch, hsl ou var() e todas funcionam sem caso especial. A versão
 * anterior só entendia `#rrggbb` e devolvia a cor INTACTA para qualquer outro
 * formato — o que fazia toda marca em oklch receber
 * `card-bg` preto chapado e os tints do accent sólidos, em silêncio.
 */
function tint(cor, alpha) {
  return `color-mix(in oklab, ${cor.trim()} ${+(alpha * 100).toFixed(1)}%, transparent)`;
}

export function buildFrame(brand, unit = '9:16') {
  const u = UNITS[unit];
  if (!u) throw new Error(`Unit "${unit}" inválida. Use: ${Object.keys(UNITS).join(', ')}`);

  const c = brand.colors || {};
  const need = ['bg', 'fg', 'accent'];
  const missing = need.filter((k) => !c[k]);
  if (missing.length) throw new Error(`brand.json sem colors.${missing.join(', colors.')}`);

  const display = (brand.fonts?.['font-display'] || 'sans-serif').replace(/['"]/g, '').split(',')[0].trim();
  const body = (brand.fonts?.['font-body'] || 'sans-serif').replace(/['"]/g, '').split(',')[0].trim();
  const voz = brand.voz || {};
  const yamlList = (arr) => (arr?.length ? arr.map((x) => `\n  - ${JSON.stringify(x)}`).join('') : ' []');

  return `---
version: alpha
name: ${brand.empresa} — Frame (camada de vídeo)
description: >
  Gerado por brand2frame.mjs a partir de brands/${brand.empresa.toLowerCase()}.json.
  Mesmos átomos da arte estática do Social Studio. Não editar à mão — edite o brand.json
  e regenere, senão o vídeo e o post saem com marcas diferentes.
unit: o frame — ${u.w}x${u.h} (${u.nome})
principle: os átomos são sagrados · a composição é livre · os números vêm do roteiro

colors:
  bg: "${c.bg}"
  surface: "${c.surface || c.bg}"
  primary: "${c.accent}"
  primary-2: "${c['accent-2'] || c.accent}"
  text: "${c.fg}"
  text-muted: "${c.muted || c.fg}"
  on-primary: "${c['on-accent'] || '#ffffff'}"
  border: "${c.line || tint(c.fg, 0.15)}"
  accent-light: "${tint(c.accent, 0.08)}"
  accent-medium: "${tint(c.accent, 0.2)}"
  card-bg: "${tint(c.fg, 0.05)}"

radii:
  pill: "100px"
  card: "14px"
  bar: "6px"

typography:
  # cqw = % da largura do container; escala junto com o frame em qualquer proporção
  eyebrow: { fontFamily: "${body}", cqw: 1.1, weight: 700, tracking: "0.18em", upper: true, color: "primary" }
  body:    { fontFamily: "${body}", cqw: 2.0, weight: 400, lineHeight: 1.4, color: "text-muted" }
  h2:      { fontFamily: "${display}", cqw: 4.5, weight: 800, lineHeight: 1.05, tracking: "-0.02em", color: "text" }
  h1:      { fontFamily: "${display}", cqw: 7.5, weight: 800, lineHeight: 0.95, tracking: "-0.03em", color: "text" }
  stat:    { fontFamily: "${display}", cqw: 12.0, weight: 800, lineHeight: 0.9, color: "primary" }

spacing:
  pad-x: "7cqw"
  pad-y: "7cqw"
  gap: "3cqw"
  # topo/base cobertos pela UI do app em vertical — nada de texto ou logo aqui
  safe-top: "${unit === '9:16' ? '13cqh' : '0'}"
  safe-bottom: "${unit === '9:16' ? '22cqh' : '0'}"

logo:
  claro: ${JSON.stringify(brand.logo?.claro || '')}
  simbolo: ${JSON.stringify(brand.logo?.simbolo || '')}
---

## Marca

${brand.empresa} — ${brand.handle || ''} ${brand.site || ''}

## Voz

${voz.tom || '(sem tom definido no brand.json)'}

Pessoa: ${voz.pessoa || 'não definida'}

**Nunca usar:**${yamlList(voz.evitar)}

**Sempre buscar:**${yamlList(voz.usar)}

## Público

${brand.publico || '(não definido)'}

## Regras de frame

- Máximo **7 palavras** por cartão de texto. Se não couber, são dois cartões.
- Texto sempre dentro da área segura (\`safe-top\` / \`safe-bottom\`).
- O accent é **um só** — \`primary\`. Nada de segundo destaque competindo.
- Legenda queimada em todo Reel: 85% assiste sem som.
- Stinger de logo: 0.8–1.5s. O símbolo entra, o wordmark segue, para. Nunca girar a marca.

## Restrições da marca
${yamlList(brand.restricoes)}

## CTAs aprovados
${yamlList(brand.ctas)}
`;
}

/**
 * O HyperFrames resolve o spec com `ls frame.md design.md DESIGN.md | head -1` —
 * `frame.md` é SEMPRE minúsculo, não existe variante FRAME.md. No Windows um
 * `FRAME.md` passa por acaso; no Linux ele some e o vídeo sai com outra paleta.
 * Normaliza aqui, na raiz, para todo chamador acertar.
 */
export function normalizeSpecPath(outFile) {
  const dir = path.dirname(outFile);
  const base = path.basename(outFile);
  return /^frame\.md$/i.test(base) ? path.join(dir, 'frame.md') : outFile;
}

function write(brandFile, outFile, unit) {
  const brand = JSON.parse(fs.readFileSync(brandFile, 'utf8'));
  const md = buildFrame(brand, unit);
  const target = normalizeSpecPath(outFile);
  fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
  fs.writeFileSync(target, md);
  return target;
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
  const brand = MARCA_TESTE;

  const md = buildFrame(brand, '9:16');
  // frontmatter válido e fechado — o HyperFrames não lê frame.md sem isso
  assert.ok(md.startsWith('---\n'), 'frontmatter precisa abrir na primeira linha');
  assert.strictEqual((md.match(/^---$/gm) || []).length, 2, 'frontmatter precisa ter abertura e fechamento');
  // os átomos da marca chegaram
  assert.ok(md.includes(`primary: "${brand.colors.accent}"`), 'accent do brand.json não chegou no frame.md');
  assert.ok(md.includes('Archivo'), 'fonte display não chegou (esperado o primeiro nome da pilha)');
  // tint derivado, e translúcido de verdade — não a cor sólida
  assert.match(md, /accent-light: "color-mix\(in oklab, #c21fe0 8%, transparent\)"/, 'tint do accent errado');
  // marca em oklch precisa gerar tint igual — o bug antigo devolvia a cor cheia
  const oklch = buildFrame({ empresa: 'K', colors: { bg: '#fff', fg: 'oklch(0.215 0.012 149.7)', accent: 'oklch(0.42 0.072 149.7)' } });
  assert.ok(oklch.includes('color-mix(in oklab, oklch(0.42 0.072 149.7) 8%, transparent)'),
    'cor em oklch tem que virar tint translúcido, não voltar sólida');
  assert.ok(!/card-bg: "oklch\(0\.215 0\.012 149\.7\)"/.test(oklch), 'card-bg saiu sólido de novo');
  // vertical traz área segura; landscape não
  assert.ok(buildFrame(brand, '9:16').includes('safe-top: "13cqh"'));
  assert.ok(buildFrame(brand, '16:9').includes('safe-top: "0"'));
  // validações de entrada
  assert.throws(() => buildFrame(brand, '4:3'), /inválida/);
  assert.throws(() => buildFrame({ empresa: 'X', colors: { bg: '#000' } }), /colors\.fg/);

  // o nome do arquivo É contrato: o HyperFrames só acha `frame.md` minúsculo
  assert.strictEqual(normalizeSpecPath('a/b/FRAME.md'), path.join('a/b', 'frame.md'));
  assert.strictEqual(normalizeSpecPath('a/b/Frame.MD'), path.join('a/b', 'frame.md'));
  assert.strictEqual(normalizeSpecPath('a/b/frame.md'), path.join('a/b', 'frame.md'));
  assert.strictEqual(normalizeSpecPath('a/b/design.md'), 'a/b/design.md', 'design.md não deve ser renomeado');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'frame-'));
  const fixture = path.join(dir, 'marca.json');
  fs.writeFileSync(fixture, JSON.stringify(MARCA_TESTE));
  const escrito = write(fixture, path.join(dir, 'FRAME.md'), '9:16');
  assert.strictEqual(path.basename(escrito), 'frame.md', 'gravou com o nome que o HyperFrames não lê');
  assert.ok(fs.existsSync(path.join(dir, 'frame.md')));
  fs.rmSync(dir, { recursive: true, force: true });

  console.log('selftest ok — frontmatter, átomos da marca, tints, área segura, nome do spec e validações.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2);
  const flag = (k, d) => { const a = argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
  if (argv.includes('--selftest')) selftest();
  else {
    const brandFile = argv.find((a) => !a.startsWith('--'));
    if (!brandFile) { console.error('uso: node brand2frame.mjs brands/<empresa>.json [--out=./projeto/frame.md] [--unit=9:16|16:9|1:1]'); process.exit(1); }
    console.log(write(brandFile, flag('out', './frame.md'), flag('unit', '9:16')));
  }
}
