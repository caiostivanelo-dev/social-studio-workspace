# Workspace de social media

Repositório pronto para criar posts, stories, carrosséis e Reels usando o
**Claude Code** — inclusive pelo **iPad ou celular**, sem instalar nada.

As peças saem em PNG na medida exata de cada rede. Nada de Canva ou Figma.

---

## Começar (uma vez só, ~10 minutos)

### 1. Faça sua cópia deste repositório

No GitHub, clique em **Use this template → Create a new repository**. Dê um nome
e deixe **privado** — suas marcas e peças ficam aqui dentro.

Se ainda não tem conta no GitHub, crie uma. É de graça e é onde seu trabalho fica
guardado.

### 2. Conecte o Claude Code ao GitHub

Abra [claude.ai/code](https://claude.ai/code) e siga o passo de conectar sua conta
do GitHub. Precisa de plano **Pro ou Max**.

### 3. Configure o ambiente (o passo que evita dor de cabeça)

Ainda em claude.ai/code, clique no **ícone de nuvem** logo acima da caixa de
mensagem, passe o mouse sobre o ambiente **Default** e clique na engrenagem.

No campo **Setup script**, cole o conteúdo do arquivo
[`scripts/setup-nuvem.sh`](scripts/setup-nuvem.sh) deste repositório. Salve.

Isso instala o navegador que gera as imagens e o `ffmpeg` para vídeo. Roda uma vez
e fica em cache — as sessões seguintes já começam prontas.

### 4. Abra o repositório e peça a primeira coisa

Em claude.ai/code, selecione seu repositório e escreva:

> Cria a marca da minha empresa. Eu te falo as cores e o tom de voz.

Pronto. A partir daí é conversa normal.

---

## Usando no dia a dia

Peça em português, sem comando nenhum:

- *"Monta um carrossel sobre \<assunto\>"*
- *"Faz um story disso"*
- *"Escreve um roteiro de Reel de 12 segundos"*
- *"Refaz o slide 3, ficou fraco"*

O Claude abre a ordem de serviço, escreve a copy, monta a arte, renderiza e
confere. No fim ele commita tudo — você vê as imagens na própria sessão e elas
ficam guardadas no repositório.

### Onde as coisas ficam

```
marcas/         uma identidade por cliente ou negócio
pecas/          uma pasta por peça, com arte, legenda e fonte
.claude/skills/ a skill (não precisa mexer)
```

---

## A primeira coisa a fazer: a marca

**Nada é produzido sem marca definida.** Não é burocracia: peça sem identidade
sai genérica, e refazer custa mais que definir.

Uma marca guarda cor, fonte, tom de voz, público, o que nunca dizer e como
assinar. Você não precisa preencher um formulário — é só conversar. O Claude
pergunta o que falta e confirma antes de produzir.

Se você já tem manual de marca, site no ar ou um arquivo do designer, diga: ele
transcreve em vez de inventar.

---

## Se algo der errado

**"Não achou Chrome"** — peça: *"roda o `scripts/preparar.sh`"*. Se persistir, o
setup script do passo 3 provavelmente não foi salvo.

**A sessão expirou** — normal. Abra de novo em claude.ai/code; a conversa volta.

**A imagem saiu fora da medida** — não sai. O renderizador falha de propósito
quando a medida não bate com a da rede. Se ele reclamou, algo no HTML quebrou.

---

## O que este workspace NÃO faz

Não publica por você. Ele entrega os arquivos e a legenda; postar é com você.
Isso é de propósito — publicar é irreversível e merece um olho humano.

Vídeo precisa do HyperFrames, que se instala sozinho na primeira vez que você
pedir um Reel.
