# Reels, animação de logo e edição de vídeo

Três caminhos. Escolha pelo que já existe, não pelo que é mais bonito.

## Divisão de responsabilidade

O Social Studio **não** monta a composição do vídeo — o HyperFrames monta, e faz melhor. O que o Studio faz é garantir que o vídeo saia com a mesma marca do post:

| Camada | Dono |
|---|---|
| Marca (cor, fonte, logo, voz, restrições) | **Social Studio** — `brands/<empresa>.json` |
| Roteiro, hook, texto de tela, CTA | **Social Studio** — [copy-pt.md](copy-pt.md) |
| Composição, timing, easing, transição, render | **HyperFrames** — skills `hyperframes*` |
| Capa do Reel, thumbnail | **Social Studio** — `shoot.mjs --format=ig-reel-capa` |
| Corte, legenda queimada, export final | **ffmpeg** — skill `video-processing-editing` |

## 1. Reel / motion graphics do zero → HyperFrames

HTML + GSAP renderizado em MP4. Verificado nesta máquina: 300 frames em ~16s, Chrome e ffmpeg locais, sem conta na nuvem.

```bash
# 1. gere o frame.md a partir da marca — ESTA ETAPA VEM PRIMEIRO
node scripts/brand2frame.mjs brands/apexdev.json --out=./reel-lancamento/frame.md --unit=9:16

# 2. crie o projeto (init exige --example; sem ele o comando falha)
npx hyperframes init reel-lancamento --example blank
cd reel-lancamento

# 3. componha, veja e renderize
npx hyperframes preview                                  # studio ao vivo
npx hyperframes render -o reel.mp4 --width 1080 --height 1920
npx hyperframes render --format webm -o overlay.webm     # fundo transparente
```

O `frame.md` é a ponte: o HyperFrames lê esse arquivo como fonte de verdade da marca na camada de vídeo, então o Reel sai com o mesmo `#c21fe0`, a mesma Archivo e as mesmas restrições do carrossel. Ele carrega também a área segura, o limite de 7 palavras por cartão e os CTAs aprovados. **Não edite o frame.md à mão** — edite o `brand.json` e regenere, senão post e vídeo divergem.

Antes de escrever a composição, invoque a skill **`hyperframes`** (é o ponto de entrada obrigatório dela; roteia para `hyperframes-core`, `-animation`, `-creative`, `-keyframes` e `media-use`, que o `init` instala).

Duração: Reel de 15–30s. Renderize a 30fps; 60fps só se houver movimento rápido de câmera.

> Se o render morrer com "JavaScript heap out of memory", passe `--workers 5` ou `NODE_OPTIONS=--max-old-space-size=8192`. O CLI avisa antes quando o heap não comporta os 6 workers padrão.

## 2. Animação de logo

Invoque a skill **`logo-animation`** — ela cobre reveal, stinger, splash, loader e draw-on de SVG, com entrega para web (SVG/Lottie), vídeo e splash de app.

Decisão prática:

| Onde vai rodar | Formato | Como |
|---|---|---|
| Site / app | Lottie ou SVG animado | skill `lottie` ou `logo-animation` |
| Intro/outro de Reel | MP4 ou WebM alpha | HyperFrames → `render --format webm` |
| Sobrepor a um vídeo | WebM com alpha | HyperFrames + ffmpeg overlay (abaixo) |

Duração de stinger: **0.8–1.5s**. Mais que isso o público pula. O símbolo entra, o wordmark segue, para. Nunca girar o logo.

Use os `.svg` apontados em `logo` no brand.json. Logo com textura embutida como imagem não anima bem — prefira a versão de traço plano e colora com CSS.

## 3. Editar vídeo que já existe → ffmpeg

Invoque a skill **`video-processing-editing`** para casos além destes. Os quatro que resolvem 90%:

```bash
# cortar (rápido, sem reencodar)
ffmpeg -ss 00:00:12 -to 00:00:27 -i bruto.mp4 -c copy corte.mp4

# vertical 9:16 a partir de horizontal, cortando o centro
ffmpeg -i bruto.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy vertical.mp4

# overlay do logo animado (WebM alpha) sobre o vídeo
ffmpeg -i base.mp4 -i logo.webm -filter_complex "[0][1]overlay=W-w-60:H-h-60" saida.mp4

# legenda queimada
ffmpeg -i vertical.mp4 -vf "subtitles=legenda.srt:force_style='FontName=Archivo,FontSize=22,Outline=2'" legendado.mp4
```

Transcrição para gerar a legenda:

```bash
npx hyperframes transcribe audio.mp4 -o legenda.srt
```

Exportação final para o Instagram: H.264, yuv420p, AAC, ≤ 30Mbps.

```bash
ffmpeg -i entrada.mp4 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart reel-final.mp4
```

`-pix_fmt yuv420p` não é opcional: sem ele o Instagram entrega vídeo verde ou não processa.

## Capa do Reel

A capa é uma imagem estática — gere pelo `shoot.mjs` com `--format=ig-reel-capa`, que já aplica a área segura (o topo e a base ficam cobertos pela UI do app).
