#!/bin/bash
# Roda no início de toda sessão. Local: não faz nada. Nuvem: garante o Chrome.
set -u
[ "${CLAUDE_CODE_REMOTE:-}" != "true" ] && exit 0

acha() {
  ls -d "$HOME"/.cache/puppeteer/chrome-headless-shell/*/chrome-headless-shell-linux64/chrome-headless-shell \
     /root/.cache/puppeteer/chrome-headless-shell/*/chrome-headless-shell-linux64/chrome-headless-shell \
     /usr/bin/chromium /usr/bin/chromium-browser /usr/bin/google-chrome 2>/dev/null | head -1
}

BIN="$(acha)"
if [ -z "$BIN" ]; then
  # Baixa de storage.googleapis.com, que está na allowlist padrão do ambiente.
  # O CDN do Playwright não está — por isso @puppeteer/browsers e não playwright.
  npx -y @puppeteer/browsers install chrome-headless-shell@stable >/dev/null 2>&1 || true
  BIN="$(acha)"
fi

# $CLAUDE_ENV_FILE persiste a variável para os comandos seguintes da sessão
[ -n "$BIN" ] && [ -n "${CLAUDE_ENV_FILE:-}" ] && echo "SOCIAL_STUDIO_CHROME=$BIN" >> "$CLAUDE_ENV_FILE"
exit 0
