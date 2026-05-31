# Atualizações realizadas

Este README descreve as alterações feitas até agora no projeto `SITE 1.0`.

## 1. Habilitação de áudio no vídeo principal

No arquivo `index.html`, o bloco do vídeo principal foi ajustado para permitir áudio e controles do usuário.

Antes:
```html
<video autoplay muted loop playsinline preload="metadata" aria-label="Vídeo mostrando o Esterco Turbinado Frutífera">
```

Depois:
```html
<video controls autoplay loop playsinline preload="metadata" aria-label="Vídeo mostrando o Esterco Turbinado Frutífera">
```

### Por que isso foi feito
- O atributo `muted` faz com que o navegador reproduza o vídeo sem som.
- Ao remover `muted`, o áudio pode ser reproduzido se o arquivo de vídeo contiver uma trilha sonora.
- Adicionamos `controls` para que o visitante possa ver o play/pause e controlar o volume.

### Observação
- Muitos navegadores bloqueiam `autoplay` com som. Portanto, o usuário pode precisar clicar no botão play para ouvir o áudio.
- Se o arquivo `mp4/video1.mp4` não tiver trilha de áudio, o vídeo continuará mudo, mesmo sem `muted`.

## 2. Correção do bloqueio de clique no vídeo

No arquivo `css/styles.css`, a camada `.hero-video-overlay` foi atualizada para não bloquear os eventos de clique.

Antes:
```css
.hero-video-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(8, 12, 8, .8) 100%);
}
```

Depois:
```css
.hero-video-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(8, 12, 8, .8) 100%);
    pointer-events: none;
}
```

### Por que isso foi feito
- A overlay ficava sobre o elemento `<video>` e interceptava o clique do usuário.
- Com `pointer-events: none;`, o clique passa através da overlay e atinge os controles do vídeo.

## 3. Resultado esperado

- O vídeo principal deve exibir os controles de reprodução.
- O play deve funcionar normalmente, sem ficar travado pela overlay.
- O áudio será reproduzido se o arquivo tiver trilha sonora e se o navegador permitir.

## Arquivos alterados

- `index.html`
- `css/styles.css`

## Próximo passo sugerido

- Verificar se `mp4/video1.mp4` contém áudio.
- Testar em um navegador para confirmar que o botão play funciona e o áudio está ativado.
