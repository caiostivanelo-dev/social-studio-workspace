#!/bin/bash
# COLE ESTE ARQUIVO no campo "Setup script" do ambiente em claude.ai/code.
# Roda como root, uma vez por ambiente, e o resultado fica em cache.
# Precisa sair com zero, senão a sessão nem inicia — daí o `|| true`.

apt-get update -qq || true
apt-get install -y -qq ffmpeg fonts-liberation ca-certificates || true

# Chrome de teste para o renderizador de PNG.
npx -y @puppeteer/browsers install chrome-headless-shell@stable || true

exit 0
