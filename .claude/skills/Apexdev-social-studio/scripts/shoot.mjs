#!/usr/bin/env node
/**
 * shoot.mjs — renderiza HTML em PNG nos formatos das redes sociais.
 *
 * ponytail: zero dependência npm. Usa o chrome-headless-shell que o Playwright já
 * baixou nesta máquina (ou o Chrome do sistema). Nada de puppeteer/playwright.
 *
 *   node shoot.mjs peca.html --format=ig-post
 *   node shoot.mjs peca.html --format=ig-story --out=./saida --brand=../brands/apexdev.json
 *   node shoot.mjs peca.html --format=ig-post --boards=1,3   # só slides 1 e 3
 *   node shoot.mjs --formats                                  # lista os formatos
 *   node shoot.mjs --selftest                                 # autoteste
 *
 * Carrossel: cada <section class="board"> vira um PNG. O script chama a página com
 * ?board=N e o template mostra só aquele slide (ver templates/carrossel.html).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FORMATS = JSON.parse(fs.readFileSync(path.join(HERE, 'formats.json'), 'utf8'));

// ---------- chrome ----------

function findChrome() {
  if (process.env.SOCIAL_STUDIO_CHROME) return process.env.SOCIAL_STUDIO_CHROME;
  const home = os.homedir();
  const roots = [
    path.join(home, 'AppData/Local/ms-playwright'),      // win
    path.join(home, 'Library/Caches/ms-playwright'),     // mac
    path.join(home, '.cache/ms-playwright'),             // linux
    // Puppeteer/chrome-for-testing. Importa em sandbox de nuvem: ele baixa de
    // storage.googleapis.com, que costuma estar liberado onde o CDN do
    // Playwright não está.
    path.join(home, '.cache/puppeteer/chrome-headless-shell'),
    path.join(home, '.cache/puppeteer/chrome'),
  ];
  const leaves = [
    'chrome-headless-shell-win64/chrome-headless-shell.exe',
    'chrome-headless-shell-mac-arm64/chrome-headless-shell',
    'chrome-headless-shell-mac-x64/chrome-headless-shell',
    'chrome-headless-shell-linux/chrome-headless-shell',
    'chrome-win64/chrome.exe',
    'chrome-win/chrome.exe',
    'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
    'chrome-linux/chrome',
    'chrome-headless-shell-linux64/chrome-headless-shell',
    'chrome-linux64/chrome',
  ];
  const found = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root)) {
      for (const leaf of leaves) {
        const p = path.join(root, dir, leaf);
        if (fs.existsSync(p)) found.push(p);
      }
    }
  }
  // versão mais nova primeiro (chromium_headless_shell-1228 > -1208)
  found.sort((a, b) => (num(b) - num(a)) || (rank(a) - rank(b)));
  if (found.length) return found[0];

  const system = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ].find((p) => fs.existsSync(p));
  if (system) return system;

  throw new Error(
    'Nenhum Chrome encontrado. Instale com `npx playwright install chromium`, ou ' +
    '`npx @puppeteer/browsers install chrome-headless-shell@stable` (funciona onde o ' +
    'CDN do Playwright está bloqueado), ou aponte SOCIAL_STUDIO_CHROME para um binário.'
  );
  function num(p) { const m = p.match(/-(\d+)[\\/]/); return m ? +m[1] : 0; }
  function rank(p) { return p.includes('headless-shell') ? 0 : 1; }
}

function chromeRun(chrome, args) {
  return execFileSync(chrome, ['--disable-gpu', '--hide-scrollbars', '--no-sandbox', ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  });
}

// ---------- helpers ----------

const pngSize = (file) => {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

/** Conta <section class="board"> depois do JS rodar. 0 = página de imagem única. */
function countBoards(chrome, url) {
  const dom = chromeRun(chrome, ['--dump-dom', '--virtual-time-budget=3000', url]);
  return (dom.match(/class="[^"]*\bboard\b[^"]*"/g) || []).length;
}

/**
 * brand.json -> brand.css ao lado do HTML, para o template linkar.
 *
 * `style` entra junto com cores e fontes porque identidade não é só paleta:
 * raio, espessura de borda, elevação e cor de ambiente são o que faz duas
 * marcas com o mesmo layout não parecerem a mesma peça. Os arquétipos em
 * templates/archetypes.css consomem tudo isso e não decidem nada por conta.
 */
function writeBrandCss(brandFile, htmlFile) {
  const b = JSON.parse(fs.readFileSync(brandFile, 'utf8'));
  const vars = Object.entries({ ...b.colors, ...b.fonts, ...b.style })
    .filter(([k]) => !k.startsWith('$'))
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');
  const css = `/* gerado por shoot.mjs a partir de ${path.basename(brandFile)} — não editar à mão */\n:root {\n${vars}\n}\n`;
  const out = path.join(path.dirname(htmlFile), 'brand.css');
  fs.writeFileSync(out, css);
  return out;
}

// ---------- render ----------

export function shoot({ html, format, out, boards, scale = 1, brand }) {
  const spec = FORMATS[format];
  if (!spec) throw new Error(`Formato "${format}" não existe. Rode --formats para ver a lista.`);
  if (!fs.existsSync(html)) throw new Error(`HTML não encontrado: ${html}`);

  const chrome = findChrome();
  const outDir = out || path.join(path.dirname(html), 'out');
  fs.mkdirSync(outDir, { recursive: true });
  if (brand) writeBrandCss(brand, html);

  const safe = spec.safe || {};
  const q = new URLSearchParams({
    format, w: spec.w, h: spec.h,
    st: safe.top || 0, sb: safe.bottom || 0, sl: safe.left || 0, sr: safe.right || 0,
  });
  const base = pathToFileURL(path.resolve(html)).href;
  const urlFor = (n) => `${base}?${q}&board=${n}`;

  const total = countBoards(chrome, urlFor(1));
  const list = boards?.length ? boards : (total ? range(1, total) : [1]);
  const stem = path.basename(html, path.extname(html));

  const written = [];
  for (const n of list) {
    const name = total > 1 ? `${stem}-${format}-${String(n).padStart(2, '0')}.png` : `${stem}-${format}.png`;
    const file = path.join(outDir, name);
    chromeRun(chrome, [
      `--window-size=${spec.w},${spec.h}`,
      `--force-device-scale-factor=${scale}`,
      `--screenshot=${file}`,
      '--virtual-time-budget=4000',
      urlFor(n),
    ]);
    if (!fs.existsSync(file)) throw new Error(`Chrome não gerou ${file}`);
    const got = pngSize(file);
    // A garantia que importa: a rede rejeita/recorta o que sai da medida.
    assert.deepStrictEqual(got, { w: spec.w * scale, h: spec.h * scale },
      `${name} saiu ${got.w}x${got.h}, esperado ${spec.w * scale}x${spec.h * scale}`);
    written.push(file);
  }
  return written;
}

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// ---------- selftest ----------

function selftest() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-studio-'));
  const html = path.join(dir, 'teste.html');
  fs.writeFileSync(html, `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0}.board{width:100vw;height:100vh;display:none;place-items:center;
background:#0a0a0a;color:#C21FE0;font:800 120px system-ui}.board.on{display:grid}</style>
<section class="board">1</section><section class="board">2</section>
<script>const n=+new URLSearchParams(location.search).get('board')||1;
document.querySelectorAll('.board')[n-1]?.classList.add('on');</script>`);

  const files = shoot({ html, format: 'ig-post', out: path.join(dir, 'out') });
  assert.strictEqual(files.length, 2, 'devia render 2 slides do carrossel');
  for (const f of files) assert.deepStrictEqual(pngSize(f), { w: 1080, h: 1350 });

  const one = shoot({ html, format: 'ig-story', boards: [2], out: path.join(dir, 'out') });
  assert.strictEqual(one.length, 1);
  assert.deepStrictEqual(pngSize(one[0]), { w: 1080, h: 1920 });

  assert.throws(() => shoot({ html, format: 'nao-existe' }), /não existe/);

  fs.rmSync(dir, { recursive: true, force: true });
  console.log('selftest ok — carrossel, slide avulso, formatos e medidas exatas.');
}

// ---------- cli ----------

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2);
  const flag = (k, d) => { const a = argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };

  if (argv.includes('--selftest')) { selftest(); }
  else if (argv.includes('--formats')) {
    for (const [k, v] of Object.entries(FORMATS)) console.log(`${k.padEnd(14)} ${v.w}x${v.h}  ${v.nome}`);
  } else {
    const html = argv.find((a) => !a.startsWith('--'));
    if (!html) { console.error('uso: node shoot.mjs <arquivo.html> --format=ig-post [--out=dir] [--brand=brand.json] [--boards=1,3] [--scale=1]'); process.exit(1); }
    const boards = flag('boards')?.split(',').map(Number).filter(Boolean);
    const files = shoot({
      html, format: flag('format', 'ig-post'), out: flag('out'),
      boards, scale: +flag('scale', 1), brand: flag('brand'),
    });
    files.forEach((f) => console.log(f));
  }
}
