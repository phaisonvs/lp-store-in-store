// Carrossel para o site Seja um Franqueado ABC da Construção
document.addEventListener("DOMContentLoaded", function () {
  // Inicialização do carrossel de Guide Shops
  const carousel = new Carousel();
  carousel.init();

  // Inicializar o efeito de parallax
  setupParallax();

  // Inicializar controle das setas do slider de prova social
  setupProvaSocialArrows();

  // Inicializar animação de entrada para elementos observados
  setupEntranceAnimations();

  // Acionar animação de entrada imediata para elementos do topo
  triggerImmediateEntranceAnimation();

  // Atualizar o contador de anos de experiência
  updateExperienceYears();
});

/**
 * @description Adiciona classes Animate.css para animação imediata em elementos específicos.
 */
function triggerImmediateEntranceAnimation() {
  const elements = document.querySelectorAll(
    // Selecionar os SVGs e o container .texto-faca-parte
    ".svg-suf-desk, .svg-suf-mobile, .texto-faca-parte"
  );
  if (elements.length > 0) {
    // Pequeno delay opcional, pode ser removido se não necessário
    setTimeout(() => {
      elements.forEach((el) => {
        // Remover classe antiga se existir
        // el.classList.remove("is-loaded-visible");

        // Definir duração
        el.style.setProperty("--animate-duration", "2s");

        // Tornar visível antes de animar
        el.style.visibility = "visible";

        // Adicionar classes Animate.css
        el.classList.add("animate__animated", "animate__fadeInDownBig"); // Ou outra animação

        console.log(`Animação Animate.css acionada para: ${el.className}`);

        // Opcional: Remover classes após a animação para limpar o DOM
        // el.addEventListener('animationend', () => {
        //   el.classList.remove('animate__animated', 'animate__fadeInDownBig');
        // }, { once: true });
      });
    }, 50); // Manter delay?
  } else {
    console.warn(
      "Elementos para animação imediata Animate.css não encontrados."
    );
  }
}

/**
 * @description Configura IntersectionObserver para animações de entrada.
 *              Para .big-numbers, usa animate.css nos LIs.
 *              Para outros elementos, alterna a classe 'is-visible'.
 */
function setupEntranceAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15, // Gatilho quando 15% está visível
  };

  const animatedCounters = new Set();

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const targetElement = entry.target;
      const isVisible = entry.isIntersecting;

      // Lógica específica para .big-numbers (agora usa animate.css)
      if (targetElement.classList.contains("big-numbers")) {
        const listItems = targetElement.querySelectorAll("ul li");

        if (isVisible) {
          // Animar contadores apenas na primeira vez
          if (!animatedCounters.has(targetElement)) {
            const numberElements = targetElement.querySelectorAll(".number");
            animateCounters(numberElements);
            animatedCounters.add(targetElement);
          }
          // Aplicar classes animate.css a todos os LIs
          listItems.forEach((item, index) => {
            // Limpar classes de animação anteriores (saída)
            item.classList.remove("animate__fadeOut"); // Exemplo de classe de saída, ajuste se usar outra

            // Adicionar classes de entrada
            // Usar um pequeno delay escalonado do próprio animate.css se desejado
            // item.style.setProperty('--animate-delay', `${index * 0.05}s`); // Opcional: pequeno delay
            item.classList.add("animate__animated", "animate__fadeInUp");
            item.style.visibility = "visible"; // Garante visibilidade
          });
        } else {
          // Remover classes animate.css quando sair da view
          listItems.forEach((item) => {
            // Poderia adicionar classe de fadeOut aqui se quisesse animação de saída
            // item.classList.add("animate__animated", "animate__fadeOut");
            // Por agora, apenas removemos as de entrada e escondemos
            item.classList.remove("animate__animated", "animate__fadeInUp");
            // Opcional: esconder imediatamente ou após animação de saída
            item.style.visibility = "hidden";
          });
        }
      }
      // Lógica para outros elementos (mantida)
      else if (targetElement.classList.contains("nossas-guides-container")) {
        const title = targetElement.querySelector("h3");
        const subtitle = targetElement.querySelector(".subtexto-guide");
        if (title) title.classList.toggle("is-visible", isVisible);
        if (subtitle) subtitle.classList.toggle("is-visible", isVisible);
      } else if (targetElement.classList.contains("section-the-news")) {
        const cards = targetElement.querySelectorAll(
          ".card-main, .card-secondary"
        );
        cards.forEach((card) => card.classList.toggle("is-visible", isVisible));
      } else if (targetElement.classList.contains("carousel")) {
        const cards = targetElement.querySelectorAll(".carousel__card");
        cards.forEach((card) => card.classList.toggle("is-visible", isVisible));
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const elementsToObserve = document.querySelectorAll(
    ".big-numbers, .nossas-guides-container, .section-the-news, .carousel"
  );

  if (elementsToObserve.length > 0) {
    elementsToObserve.forEach((el) => {
      // Garantir estado inicial escondido para LIs antes de observar
      if (el.classList.contains("big-numbers")) {
        const listItems = el.querySelectorAll("ul li");
        listItems.forEach((item) => (item.style.visibility = "hidden"));
      }
      observer.observe(el);
    });
    console.log(
      "IntersectionObserver configurado (usando animate.css para .big-numbers li):",
      elementsToObserve
    );
  } else {
    console.warn("Nenhum elemento encontrado para observar animações.");
  }
}

/**
 * @description Anima os contadores, incrementando de 0 até o valor final
 * @param {NodeList} elements - Elementos com a classe .number para animar
 */
function animateCounters(elements) {
  if (!elements || elements.length === 0) return;

  elements.forEach((counterElement) => {
    // Guardar o valor original para restaurar no final
    const originalText = counterElement.textContent.trim();

    // Obter o valor final do contador
    let finalValueText = originalText;
    let prefix = "";
    let suffix = "";

    // Detectar prefixos
    if (finalValueText.startsWith("+")) {
      prefix = "+";
      finalValueText = finalValueText.substring(1);
    }
    // Adicione mais prefixos se necessário (ex: '-')

    // Detectar sufixos
    if (finalValueText.endsWith("x")) {
      suffix = "x";
      finalValueText = finalValueText.substring(0, finalValueText.length - 1);
    } else if (finalValueText.endsWith("%")) {
      suffix = "%";
      finalValueText = finalValueText.substring(0, finalValueText.length - 1);
    }
    // Adicione mais sufixos se necessário

    // **Correção:** Remover separadores de milhar (pontos) ANTES de converter
    const cleanedValueText = finalValueText.replace(/\./g, "");

    // Converter para número
    const numericValue = parseFloat(cleanedValueText); // Usar o texto limpo

    if (isNaN(numericValue)) {
      console.warn(
        "Valor não numérico encontrado após limpeza:",
        cleanedValueText,
        "Original:",
        originalText
      );
      return;
    }

    // Garantir que é um inteiro para a lógica de contagem
    if (!Number.isInteger(numericValue)) {
      console.warn(
        "Contador animado funciona melhor com inteiros. Valor encontrado:",
        numericValue,
        "Original:",
        originalText
      );
      // Poderia optar por arredondar ou tratar diferente, mas por ora, vamos continuar
      // Se for o caso do 10x, ele cairá aqui. Vamos tratar como inteiro por enquanto.
    }
    const finalIntegerValue = Math.round(numericValue); // Usar valor arredondado para a animação

    // Adicionar classe de contagem
    counterElement.classList.add("counting");

    // Definir parâmetros da animação
    const duration = 4500; // duração em ms
    const frameDuration = 1000 / 60; // ~60fps
    const totalFrames = Math.round(duration / frameDuration);

    // Ajustar incremento para garantir que chegue ao valor final
    const increment = finalIntegerValue / totalFrames;
    let currentValue = 0;
    let frame = 0;

    // Função para animar o contador
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = easeOutQuart(progress);

      // Calcular o valor atual (sempre como número)
      currentValue = Math.min(
        finalIntegerValue * easedProgress,
        finalIntegerValue
      );

      // Arredondar para exibição (sempre inteiro neste caso)
      const displayValue = Math.floor(currentValue);

      // Formatar o número para exibição com separador de milhares
      const formattedDisplayValue = displayValue.toLocaleString("pt-BR");

      // Atualizar o texto
      counterElement.textContent = `${prefix}${formattedDisplayValue}${suffix}`;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        // Garantir que o valor final seja exatamente o original
        counterElement.textContent = originalText;

        // Remover classe de contagem e adicionar classe de finalizado
        counterElement.classList.remove("counting");
        counterElement.classList.add("finished");

        // Remover a classe 'finished' após a animação de pulso
        setTimeout(() => {
          counterElement.classList.remove("finished");
        }, 600); // Tempo um pouco maior que a duração da animação de pulso
      }
    };

    // Iniciar animação
    requestAnimationFrame(animate);
  });
}

/**
 * @description Função de easing para desacelerar a animação no final
 * @param {number} x - Valor de progresso entre 0 e 1
 * @return {number} - Valor com easing aplicado
 */
function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

/**
 * @description Configura as setas de navegação para o carrossel de prova social
 */
function setupProvaSocialArrows() {
  const carousel = document.querySelector(".carrossel-prova-social-1");
  const leftArrow = document.querySelector(".container-seta-esquerda");
  const rightArrow = document.querySelector(".container-seta-direita");

  if (!carousel || !leftArrow || !rightArrow) {
    console.warn(
      "Elementos do carrossel de prova social ou setas não encontrados."
    );
    return;
  }

  const getCardWidth = () => {
    const firstCard = carousel.querySelector(".card-prova-social");
    if (!firstCard) return 0;
    const cardStyle = window.getComputedStyle(firstCard);
    const cardMargin =
      parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
    // Considera a largura do card + gap (obtido do estilo do carrossel)
    const gap = parseFloat(window.getComputedStyle(carousel).gap);
    return firstCard.offsetWidth + (isNaN(gap) ? 16 : gap); // Usa 1rem (16px) como fallback para gap
  };

  leftArrow.addEventListener("click", () => {
    const cardWidth = getCardWidth();
    if (cardWidth > 0) {
      carousel.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  });

  rightArrow.addEventListener("click", () => {
    const cardWidth = getCardWidth();
    if (cardWidth > 0) {
      carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  });

  console.log("Setas do Carrossel de Prova Social configuradas.");
}

/**
 * @description Inicializa o efeito parallax refinado ajustando background-position.
 */
function setupParallax() {
  const section = document.querySelector(".seja-um-franqueado");
  if (!section) return;

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const speed = 0.06;
    const yPos = -scrollPosition * speed;

    requestAnimationFrame(() => {
      section.style.backgroundPosition = `center ${yPos}px`;
    });
  };

  // Throttling otimizado para scroll
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Inicializa a posição
  handleScroll();
}

class Carousel {
  constructor() {
    this.scrollSpeed = 1;
    this.currentTranslate = 0;
    this.animationId = null;
    this.isDragging = false;
    this.startPosition = 0;
    this.prevTranslate = 0;
    this.cardWidth = 0;
    this.cloneCount = 0;
    this.isListenersRegistered = false;
  }

  init() {
    if (this.isListenersRegistered) return;
    this.isListenersRegistered = true;

    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");

    if (!carousel || !track) {
      console.error("Elementos do carrossel não encontrados.");
      return;
    }

    const cards = Array.from(track.children);
    if (cards.length === 0) {
      console.error("Nenhum card encontrado no carrossel.");
      return;
    }

    this.cardWidth = cards[0].getBoundingClientRect().width;
    const visibleCardsCount = Math.ceil(carousel.offsetWidth / this.cardWidth);
    this.cloneCount = visibleCardsCount * 2;

    this.cloneCards(cards, track);
    this.startContinuousAnimation();
    this.setupEventListeners(carousel, track);
    this.addArrowScrollSupport();
    this.updateExperienceYears();
  }

  cloneCards(cards, track) {
    const clonesToStart = cards.slice(-this.cloneCount);
    const clonesToEnd = cards.slice(0, this.cloneCount);

    clonesToStart.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add("clone");
      track.prepend(clone);
    });

    clonesToEnd.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add("clone");
      track.appendChild(clone);
    });

    this.currentTranslate = -this.cardWidth * this.cloneCount;
    track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  startContinuousAnimation() {
    cancelAnimationFrame(this.animationId);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  animate() {
    const track = document.querySelector(".carousel__track");
    if (!track) return;

    const totalCards = track.children.length;
    const maxTranslate = -this.cardWidth * (totalCards - this.cloneCount);
    const resetTranslate = -this.cardWidth * this.cloneCount;

    if (!this.isDragging) {
      this.currentTranslate -= this.scrollSpeed;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    if (this.currentTranslate <= maxTranslate) {
      this.currentTranslate = resetTranslate;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    if (this.currentTranslate >= 0) {
      this.currentTranslate = maxTranslate;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  setupEventListeners(carousel, track) {
    carousel.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.startPosition = e.pageX;
      this.prevTranslate = this.currentTranslate;
      cancelAnimationFrame(this.animationId);
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      const delta = e.pageX - this.startPosition;

      if (Math.abs(delta) > this.cardWidth * this.cloneCount) return;

      this.currentTranslate = this.prevTranslate + delta;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    });

    carousel.addEventListener("mouseup", () => this.handleDragEnd(track));
    carousel.addEventListener("mouseleave", () => this.handleDragEnd(track));

    carousel.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      this.startPosition = e.touches[0].clientX;
      this.prevTranslate = this.currentTranslate;
      cancelAnimationFrame(this.animationId);
    });

    carousel.addEventListener("touchmove", (e) => {
      if (!this.isDragging) return;
      const delta = e.touches[0].clientX - this.startPosition;

      if (Math.abs(delta) > this.cardWidth * this.cloneCount) return;

      this.currentTranslate = this.prevTranslate + delta;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    });

    carousel.addEventListener("touchend", () => this.handleDragEnd(track));
    carousel.addEventListener("touchcancel", () => this.handleDragEnd(track));

    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    carousel.addEventListener("mouseenter", () => {
      this.scrollSpeed /= 2;
    });

    carousel.addEventListener("mouseleave", () => {
      this.scrollSpeed *= 2;
    });
  }

  handleDragEnd(track) {
    if (this.isDragging) {
      this.isDragging = false;
      this.startContinuousAnimation();
    }
  }

  addArrowScrollSupport() {
    const carousel = document.querySelector(".carrossel-prova-social-1");
    const leftArrow = document.querySelector(".container-seta-esquerda");
    const rightArrow = document.querySelector(".container-seta-direita");
    const cards = document.querySelectorAll(".card-prova-social");

    if (!carousel || cards.length === 0) {
      console.error(
        "Elemento .carrossel-prova-social-1 ou .card-prova-social não encontrado."
      );
      return;
    }

    const cardWidth = cards[0].offsetWidth + 12;

    if (leftArrow) {
      leftArrow.addEventListener("click", () => {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      });
    }

    if (rightArrow) {
      rightArrow.addEventListener("click", () => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        carousel.scrollTo({ left: maxScroll, behavior: "smooth" });
      });
    }
  }

  updateExperienceYears() {
    // Lógica para calcular a idade da ABC
    const inaugurationYear = 1958;
    const currentYear = new Date().getFullYear();
    const experienceYears = currentYear - inaugurationYear;

    const experienceElements = document.querySelectorAll(".experience-years");
    if (experienceElements.length > 0) {
      experienceElements.forEach((element) => {
        element.textContent = `+${experienceYears}`;
      });
    } else {
      console.error(
        "Nenhum elemento com a classe 'experience-years' foi encontrado."
      );
    }
  }

  // Método para limpar recursos quando necessário
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
