# Referências e adaptações de interface

As cenas de serviços adaptam as ideias visuais e de movimento abaixo para a identidade da Noxora. O código de apresentação foi reescrito para coordenadas SVG estáveis, CSS e o PlayFigure existente; não são instalações integrais dos pacotes upstream. Nenhuma dependência Motion, medição de layout, script remoto ou rastreador foi adicionado.

- Safari, Animated Beam, Animated List e Orbiting Circles — Magic UI, publicados também no 21st.dev. Autoria: Magic UI / Dillion Verma.
  Fontes: https://magicui.design/docs/components/safari, https://magicui.design/r/animated-beam.json, https://magicui.design/r/animated-list.json, https://magicui.design/docs/components/orbiting-circles.
  Alterações: moldura de navegador em HTML, conteúdo editorial próprio, caminhos SVG fixos com pulso CSS, sequência finita de eventos e órbita curta. As sequências respeitam pausa, visibilidade e movimento reduzido.
- Notificação de confirmação — kennyotsu (kotsu): https://uiverse.io/kennyotsu/short-ape-5.
- Check animado — uiverse-astronaut (Astronaut): https://uiverse.io/uiverse-astronaut/fluffy-panther-21.
- Botão com seta — zaby_4213 (Ferro): https://uiverse.io/zaby_4213/tough-lionfish-7.
  Alterações Uiverse: composição simplificada, paleta monocromática, check desenhado em SVG e botão de navegação sem controles fictícios. Referências aplicadas em ServiceDemos.tsx, service-scenes.css e Services.tsx.

## MIT License

Copyright (c) Magic UI
Copyright - 2026 kennyotsu (kotsu)
Copyright - 2026 uiverse-astronaut (Astronaut)
Copyright - 2026 zaby_4213 (Ferro)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
