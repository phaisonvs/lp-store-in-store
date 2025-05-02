// Carrossel para o site Seja um Franqueado ABC da Construção
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar carrossel
  const carouselTrack = document.querySelector(".carousel__track");
  const carousel = new Carousel(carouselTrack);

  // Inicializar efeitos de entrada
  setupEntranceAnimations();

  // Configurar efeito do botão CTA
  setupCtaButtonEffect();

  // Inicializar o efeito de parallax
  setupParallax();

  // Inicializar controle das setas do slider de prova social
  setupProvaSocialArrows();

  // Inicializar animação de entrada para elementos observados
  // (Agora também armazena valores originais dos contadores)
  setupEntranceAnimations();

  // Acionar animação de entrada imediata para elementos do topo e controlar visibilidade da prova social
  triggerImmediateEntranceAnimation();

  // Inicializar carregamento de vídeos sob demanda
  setupLazyVideoLoad();

  // Configurar animação fade-in para o form-container
  setupFormContainerFadeIn();
});

/**
 * @description Adiciona classes Animate.css para animação imediata em elementos específicos.
 */
function triggerImmediateEntranceAnimation() {
  const mainElements = document.querySelectorAll(
    ".svg-suf-desk, .svg-suf-mobile, .texto-faca-parte" // Seleciona os elementos principais
  );

  const storeImage = document.querySelector(".loja-store-in-store-image"); // Seleciona a imagem separadamente

  // Animar também o botão CTA que está visível inicialmente
  const ctaButton = document.querySelector(".cta-button-custom");
  if (ctaButton && isElementInViewport(ctaButton)) {
    console.log("Ativando animação imediata para botão CTA");
    ctaButton.style.opacity = "1";
    ctaButton.style.transform = "translateY(0)";
  }

  // Animação para a imagem da loja (fadeInDown)
  if (storeImage) {
    setTimeout(() => {
      storeImage.style.setProperty("--animate-duration", "1.5s"); // Duração um pouco diferente
      storeImage.style.visibility = "visible";
      storeImage.classList.add("animate__animated", "animate__fadeInDown"); // Aplica fadeInDown
      console.log(
        `Animação Animate.css acionada para: ${storeImage.className}`
      );
    }, 50); // Pequeno delay
  }

  // Animação para os elementos principais (zoomIn)
  if (mainElements.length > 0) {
    setTimeout(() => {
      mainElements.forEach((el) => {
        el.style.setProperty("--animate-duration", "2s");
        el.style.visibility = "visible";
        el.classList.add("animate__animated", "animate__zoomIn"); // Mantém zoomIn
        console.log(`Animação Animate.css acionada para: ${el.className}`);
      });
    }, 150); // Atraso um pouco maior para os SVGs
  } else {
    console.warn(
      "Elementos para animação imediata Animate.css não encontrados."
    );
  }
}

// Função auxiliar para verificar se um elemento está visível na viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * @description Configura IntersectionObserver para animações de entrada.
 *              Armazena o valor original dos contadores e define o texto inicial.
 */
function setupEntranceAnimations() {
  // Selecionando todas as seções e elementos que devem ter animações de entrada
  const sections = [
    ".cabecalho-principal-container",
    ".cta-button-container",
    ".nossas-guides-container",
  ];

  // Configurar observador de interseção para cada seção
  sections.forEach((sectionSelector) => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.style.setProperty("--animate-duration", "1.2s");
            section.style.visibility = "visible";
            section.classList.add("animate__animated", "animate__fadeIn");

            // Desconectar o observer após a animação ser aplicada
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    // Começar a observar a seção
    observer.observe(section);
  });
}

/**
 * @description Anima os contadores, incrementando de 0 até o valor final.
 *              Lê o valor final de data-original-value.
 * @param {NodeList} elements - Elementos com .number ou .experience-years
 */
function animateCounters(elements) {
  if (!elements || elements.length === 0) {
    console.log("animateCounters chamado sem elementos.");
    return;
  }

  elements.forEach((counterElement) => {
    const targetText = counterElement.dataset.originalValue;

    if (targetText === undefined || targetText === null) {
      console.warn(
        "Valor original não encontrado em data-original-value para:",
        counterElement
      );
      return;
    }

    console.log(
      `Animando contador: ${counterElement.className}, Valor Alvo: ${targetText}`
    );

    let finalValueText = targetText;
    let prefix = "";
    let suffix = "";

    if (finalValueText.startsWith("+")) {
      prefix = "+";
      finalValueText = finalValueText.substring(1);
    }
    if (finalValueText.endsWith("x")) {
      suffix = "x";
      finalValueText = finalValueText.substring(0, finalValueText.length - 1);
    } else if (finalValueText.endsWith("%")) {
      suffix = "%";
      finalValueText = finalValueText.substring(0, finalValueText.length - 1);
    }

    const cleanedValueText = finalValueText.replace(/\./g, "");
    const numericValue = parseFloat(cleanedValueText);

    if (isNaN(numericValue)) {
      console.warn(
        "Valor não numérico encontrado:",
        cleanedValueText,
        "Original:",
        targetText
      );
      counterElement.textContent = targetText;
      return;
    }

    const finalIntegerValue = Math.round(numericValue);
    counterElement.classList.add("counting");
    const duration = 4500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = easeOutQuart(progress);
      let currentValue = Math.min(
        finalIntegerValue * easedProgress,
        finalIntegerValue
      );
      const displayValue = Math.floor(currentValue);
      const formattedDisplayValue = displayValue.toLocaleString("pt-BR");

      counterElement.textContent = `${prefix}${formattedDisplayValue}${suffix}`;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        counterElement.textContent = targetText;
        counterElement.classList.remove("counting");
        counterElement.classList.add("finished");
        setTimeout(() => {
          counterElement.classList.remove("finished");
        }, 600);
      }
    };

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
 * @description Configura as setas de navegação e eventos touch para o carrossel de prova social
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
    const gap = parseFloat(window.getComputedStyle(carousel).gap);
    return firstCard.offsetWidth + (isNaN(gap) ? 16 : gap);
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

  let startX = 0;
  let startScrollLeft = 0;
  let isDragging = false;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      startX = e.touches[0].pageX;
      startScrollLeft = carousel.scrollLeft;
      e.preventDefault();
    },
    { passive: false }
  );

  carousel.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX;
      const distance = x - startX;
      carousel.scrollLeft = startScrollLeft - distance;
      e.preventDefault();
    },
    { passive: false }
  );

  carousel.addEventListener("touchend", () => {
    isDragging = false;
  });

  carousel.addEventListener("touchcancel", () => {
    isDragging = false;
  });

  console.log(
    "Setas e eventos touch do Carrossel de Prova Social configurados."
  );
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

  handleScroll();
}

/**
 * Classe para controlar o carrossel de imagens
 */
class Carousel {
  constructor(element) {
    this.element = element;
    this.scrollPosition = 0;
    this.scrollSpeed = 0.5;
    this.isAutoScrolling = true;
    this.lastTimestamp = 0;
    this.isPaused = false;
    this.cards = Array.from(this.element.querySelectorAll(".carousel__card"));

    this.setupEventListeners();
    this.startAutoScroll();
  }

  setupEventListeners() {
    this.element.addEventListener("mouseenter", () => {
      this.isPaused = true;
    });

    this.element.addEventListener("mouseleave", () => {
      this.isPaused = false;
    });

    this.element.addEventListener("touchstart", () => {
      this.isPaused = true;
    });

    this.element.addEventListener("touchend", () => {
      setTimeout(() => {
        this.isPaused = false;
      }, 1000);
    });
  }

  startAutoScroll() {
    // Iniciar animação usando requestAnimationFrame para performance
    requestAnimationFrame(this.autoScroll.bind(this));
  }

  autoScroll(timestamp) {
    if (this.lastTimestamp === 0) {
      this.lastTimestamp = timestamp;
    }

    const elapsed = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    if (!this.isPaused && this.isAutoScrolling) {
      this.scrollPosition += this.scrollSpeed * (elapsed / 16); // Normalizar para aprox. 60fps

      // Verificar se chegou ao final do carrossel
      const elementWidth = this.getCarouselWidth();
      if (this.scrollPosition >= elementWidth) {
        this.scrollPosition = 0;
      }

      this.updatePosition();
    }

    requestAnimationFrame(this.autoScroll.bind(this));
  }

  updatePosition() {
    this.element.style.transform = `translateX(calc(-50% - ${this.scrollPosition}px))`;
  }

  getCarouselWidth() {
    // Calcular a largura total do carrossel
    // Baseado na largura e margem de todos os cards
    let totalWidth = 0;

    this.cards.forEach((card) => {
      const style = window.getComputedStyle(card);
      const width = parseFloat(style.width);
      const marginRight = parseFloat(style.marginRight);
      totalWidth += width + marginRight;
    });

    return totalWidth;
  }
}

/**
 * @description Configura o carregamento sob demanda de vídeos do YouTube.
 *              Os vídeos serão carregados apenas quando o usuário clicar na thumbnail.
 */
function setupLazyVideoLoad() {
  const videoCards = document.querySelectorAll(".card-prova-social");

  if (videoCards.length === 0) {
    console.warn(
      "Nenhum card de vídeo encontrado para configurar carregamento sob demanda."
    );
    return;
  }

  videoCards.forEach((card) => {
    card.addEventListener("click", function () {
      if (this.classList.contains("video-playing")) return;

      const iframe = this.querySelector("iframe");

      if (!iframe) {
        console.warn("Iframe não encontrado no card de vídeo.");
        return;
      }

      const videoSrc = iframe.getAttribute("data-src");

      if (!videoSrc) {
        console.warn("Atributo data-src não encontrado no iframe.");
        return;
      }

      const autoplaySrc = videoSrc.includes("?")
        ? `${videoSrc}&autoplay=1`
        : `${videoSrc}?autoplay=1`;

      iframe.setAttribute("src", autoplaySrc);
      this.classList.add("video-playing");

      console.log(`Vídeo carregado e iniciado: ${videoSrc}`);
    });
  });

  console.log(
    "Carregamento sob demanda de vídeos configurado para",
    videoCards.length,
    "cards."
  );
}

/**
 * @description Configura efeito para o botão CTA e adiciona rolagem suave até o formulário
 */
function setupCtaButtonEffect() {
  const ctaButton = document.querySelector(".cta-button-custom");
  if (!ctaButton) {
    console.warn("Botão CTA não encontrado.");
    return;
  }

  // Adicionar efeito de clique
  ctaButton.addEventListener("mousedown", function () {
    console.log("Botão clicado (mouse)");
    this.classList.add("button-pressed");
  });

  ctaButton.addEventListener("mouseup", function () {
    console.log("Clique finalizado (mouse)");
    this.classList.remove("button-pressed");
  });

  ctaButton.addEventListener("mouseleave", function () {
    console.log("Mouse saiu do botão");
    this.classList.remove("button-pressed");
  });

  // Suporte para dispositivos touch
  ctaButton.addEventListener("touchstart", function (e) {
    console.log("Botão tocado (touch)");
    this.classList.add("button-pressed");
  });

  ctaButton.addEventListener("touchend", function (e) {
    console.log("Toque finalizado (touch)");
    this.classList.remove("button-pressed");
  });

  console.log("CTA button effects initialized");
}

/**
 * @description Adiciona animação fade-in à form-container
 */
function setupFormContainerFadeIn() {
  // Seleciona o elemento form-container
  const formContainer = document.querySelector(".form-container");

  if (!formContainer) {
    console.warn("Elemento form-container não encontrado.");
    return;
  }

  // Configurar o observer para o form-container
  const formObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Quando o elemento estiver visível na viewport
          formContainer.style.setProperty("--animate-duration", "1.2s");
          formContainer.style.visibility = "visible";
          formContainer.classList.add("animate__animated", "animate__fadeIn");
          console.log("Animação fade-in aplicada ao form-container");

          // Desconectar o observer após a animação ser aplicada
          formObserver.disconnect();
        }
      });
    },
    {
      threshold: 0.2, // Aciona quando 20% do elemento estiver visível
    }
  );

  // Iniciar a observação do elemento
  formObserver.observe(formContainer);
  console.log("Observer configurado para form-container");
}
