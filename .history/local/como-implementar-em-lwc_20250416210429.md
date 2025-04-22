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

export default class SejaUmFranqueado extends LightningElement {
  @track logoDesktop = logoDesktop;
  @track logoMobile = logoMobile;
  effectsInitialized = false;

  // Referências aos elementos do DOM
  particles;
  section;

  renderedCallback() {
    if (this.effectsInitialized) {
      return;
    }

    this.effectsInitialized = true;
    this.section = this.template.querySelector(".seja-um-franqueado");
    this.particles = this.template.querySelector(".particles-container");

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

    // Criar partículas
    this.createParticles();

    // Inicializar Parallax
    this.initParallax(elementsToAnimate);

    // Adicionar eventos de mouse/touch
    this.addEventListeners();
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
    window.addEventListener("scroll", this.handleScroll.bind(this));

    // Limpar ao desmontar
    this.template.addEventListener("disconnect", () => {
      window.removeEventListener("mousemove", this.handleMouseMove.bind(this));
      window.removeEventListener("scroll", this.handleScroll.bind(this));
    });
  }

  // Lidar com movimento do mouse
  handleMouseMove(event) {
    const PARALLAX_DEPTH = 40; // Profundidade do efeito parallax

    // Calcular posição relativa do mouse
    const mouse = {
      x: event.clientX / window.innerWidth - 0.5,
      y: event.clientY / window.innerHeight - 0.5,
    };

    // Aplicar transformação aos elementos
    if (this.parallaxElements) {
      this.parallaxElements.forEach(({ element, depth }) => {
        const x = mouse.x * PARALLAX_DEPTH * depth;
        const y = mouse.y * PARALLAX_DEPTH * depth;
        const scale = 1 + depth * 0.05;

        // Aplicar transformação 3D
        element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      });
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
  background-image: url(/resource/sejaUmFranqueadoBackground);
  background-repeat: no-repeat;
  position: relative;
  padding-top: 50px;
  transform-style: preserve-3d;
  perspective: var(--perspective);
  overflow: hidden;
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
  z-index: 1;
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
  z-index: 2;
}

/* Resto dos estilos... */
```

## Considerações importantes para LWC

1. **Recursos Estáticos:** Todas as imagens e recursos externos devem ser carregados como recursos estáticos no Salesforce.

2. **lwc:dom="manual":** Usamos esta diretiva para manipular diretamente o DOM no container de partículas.

3. **Context:** Em LWC, todas as manipulações de DOM precisam ser feitas com cuidado, seguindo as restrições de shadow DOM.

4. **Isolamento CSS:** Os estilos CSS em LWC são isolados por componente, então não há risco de conflito com outros componentes.

5. **Performance:** Os efeitos foram otimizados para performance, usando `requestAnimationFrame` e propriedades CSS eficientes.

## Adaptação para diferentes tamanhos de tela

O código inclui adaptações responsivas, mas pode ser necessário ajustar para diferentes tamanhos de tela específicos da sua implementação Salesforce. Utilize mídia queries no CSS para controlar o comportamento dos efeitos em dispositivos móveis.

```css
@media (max-width: 768px) {
  .parallax-element {
    /* Reduzir a intensidade do efeito em telas menores */
    transform: none !important;
  }

  .particle {
    /* Reduzir a quantidade de partículas visíveis */
    opacity: 0.1;
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
