# Implementação de efeitos 3D e partículas em LWC

Este guia explica como implementar os efeitos de partículas e parallax 3D em Lightning Web Components (LWC).

## Estrutura de arquivos em LWC

Para implementar estes efeitos em LWC, você precisará dos seguintes arquivos:

1. **sejaUmFranqueado.html** - Estrutura HTML do componente
2. **sejaUmFranqueado.js** - JavaScript do componente
3. **sejaUmFranqueado.css** - Estilos CSS do componente
4. **sejaUmFranqueadoEffects.js** - Arquivo de recursos estáticos para os efeitos

## Passo a passo para implementação

### 1. Criar o arquivo de recursos estáticos

Primeiro, crie um arquivo estático chamado `sejaUmFranqueadoEffects.js` com o código do arquivo `script.js`. Este arquivo será carregado como um recurso estático no Salesforce.

Upload no Salesforce:

1. Acesse **Setup > Custom Code > Static Resources**
2. Clique em **New**
3. Dê um nome ao recurso (ex: `sejaUmFranqueadoEffects`)
4. Faça upload do arquivo JavaScript
5. Defina o tipo de conteúdo como `text/javascript`
6. Clique em **Save**

### 2. Criar o componente LWC

#### HTML (sejaUmFranqueado.html)

```html
<template>
  <section class="seja-um-franqueado bg-expanded">
    <!-- Camadas para efeito de parallax no background -->
    <div class="parallax-bg" lwc:dom="manual"></div>
    <div class="parallax-overlay" lwc:dom="manual"></div>

    <div class="particles-container" lwc:dom="manual"></div>

    <div class="conteudo-seja-um-franqueado-abc">
      <!-- SVG e conteúdo original -->
      <img
        class="svg-suf-desk parallax-element"
        src="{logoDesktop}"
        alt="Seja um franqueado"
      />
      <img
        class="svg-suf-mobile parallax-element"
        src="{logoMobile}"
        alt="Seja um franqueado"
      />

      <div class="faca-parte">
        <div class="texto-faca-parte">
          <h1 class="sr-only">Seja um Franqueado ABC da Construção</h1>
          <h2 class="maior-rede-de-acabamentos parallax-element">
            O modelo de negócio que está transformando o mercado da construção
            no Brasil: inovação e rentabilidade em um setor que não para de
            evoluir.
          </h2>
        </div>
      </div>

      <!-- Resto do conteúdo... -->
    </div>
  </section>
</template>
```

#### JavaScript (sejaUmFranqueado.js)

```javascript
import { LightningElement, wire, api, track } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import sejaUmFranqueadoEffects from "@salesforce/resourceUrl/sejaUmFranqueadoEffects";
import logoDesktop from "@salesforce/resourceUrl/sejaUmFranqueadoLogoDesktop";
import logoMobile from "@salesforce/resourceUrl/sejaUmFranqueadoLogoMobile";
import bgImage from "@salesforce/resourceUrl/sejaUmFranqueadoBackground";

export default class SejaUmFranqueado extends LightningElement {
  @track logoDesktop = logoDesktop;
  @track logoMobile = logoMobile;
  @track bgImage = bgImage;
  effectsInitialized = false;

  // Referências aos elementos do DOM
  particles;
  section;
  parallaxBg;
  parallaxOverlay;

  // Variáveis para efeitos
  mouse = { x: 0, y: 0 };
  scrollPosition = 0;
  ticking = false;
  parallaxElements = [];
  BG_PARALLAX_FACTOR = 0.1;
  PARALLAX_DEPTH = 40;

  renderedCallback() {
    if (this.effectsInitialized) {
      return;
    }

    this.effectsInitialized = true;
    this.section = this.template.querySelector(".seja-um-franqueado");
    this.particles = this.template.querySelector(".particles-container");
    this.parallaxBg = this.template.querySelector(".parallax-bg");
    this.parallaxOverlay = this.template.querySelector(".parallax-overlay");

    // Carregar script de efeitos
    loadScript(this, sejaUmFranqueadoEffects)
      .then(() => {
        this.initializeEffects();
      })
      .catch((error) => {
        console.error("Erro ao carregar os efeitos:", error);
        // Implementar fallback para compatibilidade
        this.createBasicEffects();
      });
  }

  // Inicializar efeitos usando a biblioteca carregada
  initializeEffects() {
    // Em LWC, precisamos passar o contexto do componente para a biblioteca
    const elementsToAnimate = this.getParallaxElements();

    // Configurar background para o parallax
    this.setupParallaxBackground();

    // Criar partículas
    this.createParticles();

    // Inicializar Parallax
    this.initParallax(elementsToAnimate);

    // Adicionar eventos de mouse/touch
    this.addEventListeners();

    // Configuração inicial
    this.handleScrollPosition();
    this.handleResize();
  }

  // Configurar background com parallax
  setupParallaxBackground() {
    if (this.parallaxBg && this.parallaxOverlay && this.bgImage) {
      // Definir o background da imagem
      this.parallaxBg.style.backgroundImage = `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.5)), url('${this.bgImage}')`;
      this.parallaxBg.style.backgroundSize = "cover";
      this.parallaxBg.style.backgroundPosition = "center";
      this.parallaxBg.style.transform = "translateZ(-50px) scale(1.5)";

      // Configurar o overlay
      this.parallaxOverlay.style.background =
        "radial-gradient(circle at center, transparent, rgba(0,0,0,0.7))";
      this.parallaxOverlay.style.opacity = "0.7";
      this.parallaxOverlay.style.transform = "translateZ(-30px) scale(1.3)";
    }
  }

  // Obter elementos para o efeito Parallax
  getParallaxElements() {
    const elements = [];
    const selectors = [
      { selector: ".svg-suf-desk, .svg-suf-mobile", depth: 0.5 },
      { selector: ".maior-rede-de-acabamentos", depth: 0.3 },
      { selector: ".subtexto", depth: 0.2 },
      { selector: ".big-numbers", depth: 0.1 },
    ];

    selectors.forEach((item) => {
      const els = this.template.querySelectorAll(item.selector);
      if (els && els.length) {
        els.forEach((el) => {
          elements.push({
            element: el,
            depth: item.depth,
          });

          // Configurar para animação
          el.style.transition = "transform 0.2s ease-out";
          el.style.willChange = "transform";
        });
      }
    });

    return elements;
  }

  // Criar partículas manualmente
  createParticles() {
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Posição aleatória
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      // Tamanho aleatório
      const size = Math.random() * 4 + 1;

      // Opacidade aleatória
      const opacity = Math.random() * 0.5 + 0.1;

      // Configurar estilos
      particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                background-color: white;
                border-radius: 50%;
                opacity: ${opacity};
                box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
            `;

      this.particles.appendChild(particle);

      // Animar partícula
      this.animateParticle(particle);
    }
  }

  // Animar partículas individuais
  animateParticle(particle) {
    const duration = Math.random() * 10 + 10; // 10-20 segundos
    const xMove = Math.random() * 20 - 10; // -10 a +10
    const yMove = Math.random() * 20 - 10; // -10 a +10

    particle.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-in-out`;
    particle.style.transform = `translate(${xMove}vw, ${yMove}vh)`;

    // Alterar opacidade aleatoriamente
    setTimeout(() => {
      particle.style.opacity = Math.random() * 0.5 + 0.1;
    }, Math.random() * 5000);

    // Reiniciar animação quando terminar
    setTimeout(() => {
      particle.style.transition = "none";
      particle.style.transform = "translate(0, 0)";

      setTimeout(() => {
        this.animateParticle(particle);
      }, 50);
    }, duration * 1000);
  }

  // Inicializar efeito Parallax
  initParallax(elements) {
    this.parallaxElements = elements;

    // Posição inicial
    this.handleMouseMove({
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
    });
  }

  // Adicionar ouvintes de eventos
  addEventListeners() {
    // Para o efeito Parallax
    window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    window.addEventListener("scroll", this.handleScrollRequest.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));

    // Limpar ao desmontar
    this.template.addEventListener("disconnect", () => {
      window.removeEventListener("mousemove", this.handleMouseMove.bind(this));
      window.removeEventListener("scroll", this.handleScrollRequest.bind(this));
      window.removeEventListener("resize", this.handleResize.bind(this));
    });
  }

  // Gerenciar scroll com melhor performance
  handleScrollRequest() {
    this.scrollPosition = window.scrollY;

    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.handleScrollPosition();
        this.ticking = false;
      });

      this.ticking = true;
    }
  }

  // Aplicar efeito parallax no scroll
  handleScrollPosition() {
    // Efeito parallax no background baseado no scroll
    if (this.parallaxBg && this.parallaxOverlay) {
      const yOffset = this.scrollPosition * this.BG_PARALLAX_FACTOR;

      // Mover o background mais lentamente que a página
      this.parallaxBg.style.transform = `translateZ(-50px) translateY(${-yOffset}px) scale(1.5)`;
      this.parallaxOverlay.style.transform = `translateZ(-30px) translateY(${
        -yOffset * 0.5
      }px) scale(1.3)`;
    }

    // Atualizar elementos de conteúdo também
    this.handleScroll();
  }

  // Ajustar para o tamanho da tela
  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.parallaxBg && this.parallaxOverlay && this.section) {
      const sectionHeight = this.section.offsetHeight;

      this.parallaxBg.style.width = `${width * 1.2}px`;
      this.parallaxBg.style.height = `${sectionHeight * 1.2}px`;

      this.parallaxOverlay.style.width = `${width * 1.2}px`;
      this.parallaxOverlay.style.height = `${sectionHeight * 1.2}px`;
    }
  }

  // Lidar com movimento do mouse
  handleMouseMove(event) {
    // Calcular posição relativa do mouse
    this.mouse = {
      x: event.clientX / window.innerWidth - 0.5,
      y: event.clientY / window.innerHeight - 0.5,
    };

    // Aplicar transformação aos elementos de conteúdo
    if (this.parallaxElements) {
      this.parallaxElements.forEach(({ element, depth }) => {
        const x = this.mouse.x * this.PARALLAX_DEPTH * depth;
        const y = this.mouse.y * this.PARALLAX_DEPTH * depth;
        const scale = 1 + depth * 0.05;

        // Aplicar transformação 3D
        element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      });
    }

    // Efeito parallax no background baseado no movimento do mouse
    if (this.parallaxBg && this.parallaxOverlay) {
      const bgX = -this.mouse.x * 20;
      const bgY = -this.mouse.y * 20;

      const overlayX = -this.mouse.x * 10;
      const overlayY = -this.mouse.y * 10;

      const yOffset = this.scrollPosition * this.BG_PARALLAX_FACTOR;

      this.parallaxBg.style.transform = `translateZ(-50px) translate(${bgX}px, ${
        bgY - yOffset
      }px) scale(1.5)`;
      this.parallaxOverlay.style.transform = `translateZ(-30px) translate(${overlayX}px, ${
        overlayY - yOffset * 0.5
      }px) scale(1.3)`;
    }
  }

  // Lidar com evento de scroll
  handleScroll() {
    const windowHeight = window.innerHeight;

    // Aplicar efeito de profundidade com base no scroll
    if (this.parallaxElements) {
      this.parallaxElements.forEach(({ element, depth }) => {
        const elementRect = element.getBoundingClientRect();
        const elementCenter = elementRect.top + elementRect.height / 2;

        // Distância do centro da viewport
        const distanceFromCenter =
          (elementCenter - windowHeight / 2) / (windowHeight / 2);

        // Se o elemento estiver visível na viewport
        if (elementRect.top < windowHeight && elementRect.bottom > 0) {
          const z = -distanceFromCenter * depth * 20;
          const currentTransform = element.style.transform;

          if (currentTransform.includes("translate3d")) {
            const match = currentTransform.match(
              /translate3d\(([^,]+),\s*([^,]+),\s*[^)]+\)/
            );
            if (match) {
              const x = match[1];
              const y = match[2];
              element.style.transform = `translate3d(${x}, ${y}, ${z}px)`;
            }
          }
        }
      });
    }
  }
}
```

#### CSS (sejaUmFranqueado.css)

```css
/* Variáveis de design */
:host {
  --destaque: #e5e5e5;
  --fonte: "Salesforce Sans", sans-serif;
  --background-light: #ebf0f4;
  --neutral-dark: #333333;
  --perspective: 1000px;
  --transition-duration: 0.2s;

  display: block;
}

/* Principal */
.seja-um-franqueado {
  position: relative;
  padding-top: 50px;
  transform-style: preserve-3d;
  perspective: var(--perspective);
  overflow: hidden;
}

/* Backgrounds com parallax */
.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 120%;
  height: 120%;
  background-size: cover;
  background-position: center;
  transform: translateZ(-50px) scale(1.5);
  will-change: transform;
  z-index: 0;
  transition: transform var(--transition-duration) ease-out;
}

.parallax-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 120%;
  height: 120%;
  background: radial-gradient(
    circle at center,
    transparent,
    rgba(0, 0, 0, 0.7)
  );
  opacity: 0.7;
  transform: translateZ(-30px) scale(1.3);
  will-change: transform;
  z-index: 1;
  transition: transform var(--transition-duration) ease-out;
}

/* Opções de visualização */
.bg-contain {
  background-size: contain;
  background-position: top center;
}

.bg-expanded {
  background-size: 110%;
  background-position: center top;
}

.bg-proportional {
  background-size: auto 100%;
  background-position: center;
}

/* Container de partículas */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

/* Partículas individuais */
.particle {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  opacity: 0.3;
  pointer-events: none;
  will-change: transform, opacity;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out,
    box-shadow 0.3s ease-out;
}

/* Elementos com efeito parallax */
.parallax-element {
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform var(--transition-duration) ease-out;
  backface-visibility: hidden;
}

/* Garantir que o conteúdo fique acima das partículas */
.conteudo-seja-um-franqueado-abc {
  position: relative;
  z-index: 3;
}

/* Responsividade para os efeitos */
@media (max-width: 768px) {
  .parallax-element {
    /* Reduzir a intensidade do efeito em telas menores */
    transform: none !important;
  }

  .particle {
    /* Reduzir a quantidade de partículas visíveis */
    opacity: 0.1;
  }

  .parallax-bg,
  .parallax-overlay {
    /* Desativar efeito em dispositivos móveis */
    transform: none !important;
  }
}

/* Resto dos estilos... */
```

## Efeito Parallax para Background

### Como funciona o parallax no background

O efeito de parallax no background é criado usando múltiplas camadas que se movem em velocidades diferentes:

1. **Camada de fundo (parallax-bg)**: Contém a imagem principal e se move mais lentamente que o conteúdo principal.
2. **Camada de overlay (parallax-overlay)**: Adiciona profundidade visual com um gradiente e se move em uma velocidade intermediária.
3. **Conteúdo principal**: Se move na velocidade normal de scroll.

### Implementação em LWC

Para implementar o efeito de parallax no background em um componente LWC:

1. **Recursos estáticos**: Armazene a imagem de fundo como um recurso estático no Salesforce.
2. **DOM manual**: Use a diretiva `lwc:dom="manual"` para manipular diretamente os elementos de background.
3. **Transform 3D**: Utilize transformações CSS 3D para criar o efeito de profundidade.
4. **RequestAnimationFrame**: Para melhor performance, use `requestAnimationFrame` ao manipular o scroll.

### Otimização para LWC

Os seguintes ajustes devem ser feitos para melhor compatibilidade com LWC:

1. **Bind de eventos**: Sempre use `bind(this)` ao adicionar event listeners em LWC.
2. **Limpeza de eventos**: Remova todos os event listeners no desconectar do componente.
3. **Ajuste dinâmico**: Use `handleResize()` para adaptar a renderização em diferentes tamanhos de tela.
4. **Performance**: Use `will-change` e transformações 3D para aproveitar a aceleração de hardware.

### Fallbacks e compatibilidade

Para garantir que o componente funcione em diferentes dispositivos:

1. **Detecção de suporte**: Verifique se o navegador suporta as transformações 3D necessárias.
2. **Versão simplificada**: Ofereça uma versão sem os efeitos para dispositivos ou navegadores incompatíveis.
3. **Media queries**: Use CSS para desabilitar os efeitos em dispositivos móveis ou de baixo desempenho.

```css
@media (max-width: 768px) or (prefers-reduced-motion: reduce) {
  .parallax-bg,
  .parallax-overlay,
  .parallax-element {
    transform: none !important;
    transition: none !important;
  }
}
```

## Suporte de navegadores

Estes efeitos são compatíveis com navegadores modernos que suportam:

- CSS 3D Transforms
- requestAnimationFrame
- ES6 JavaScript

Para garantir compatibilidade com navegadores mais antigos, o código inclui fallbacks que desabilitam os efeitos avançados quando necessário.

## Testando em ambiente Salesforce

Após implementar, teste o componente em diferentes ambientes (Sandbox, Produção) e diferentes dispositivos para garantir que os efeitos funcionem corretamente sem comprometer a performance.
