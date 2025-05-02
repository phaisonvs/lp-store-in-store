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
  // (Agora também armazena valores originais dos contadores)
  setupEntranceAnimations();

  // Acionar animação de entrada imediata para elementos do topo e controlar visibilidade da prova social
  triggerImmediateEntranceAnimation();

  // Inicializar carregamento de vídeos sob demanda
  setupLazyVideoLoad();

  // Configurar efeito do botão CTA
  setupCtaButtonEffect();
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
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const animatedCounters = new Set();

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const targetElement = entry.target;
      const isVisible = entry.isIntersecting;

      // Adicionar o efeito de fade para todas as seções e contêineres principais
      if (
        targetElement.classList.contains("section-wrapper") ||
        targetElement.classList.contains("titulo-subtitulo-container") ||
        targetElement.classList.contains("cta-button-container")
      ) {
        console.log(
          `Elemento ${targetElement.className} ${
            isVisible ? "visível" : "não visível"
          }`
        );

        const title = targetElement.querySelector(".section-title");
        const subtitle = targetElement.querySelector(".section-subtitle");
        const ctaButton = targetElement.querySelector(".cta-button-custom");

        // Verificar cada elemento dentro do container e animar
        if (title) {
          title.style.transition =
            "opacity 0.8s ease-in-out, transform 0.8s ease-in-out";
          title.style.opacity = isVisible ? "1" : "0";
          title.style.transform = isVisible
            ? "translateY(0)"
            : "translateY(20px)";
        }

        if (subtitle) {
          subtitle.style.transition =
            "opacity 0.8s ease-in-out 0.2s, transform 0.8s ease-in-out 0.2s";
          subtitle.style.opacity = isVisible ? "1" : "0";
          subtitle.style.transform = isVisible
            ? "translateY(0)"
            : "translateY(20px)";
        }

        if (ctaButton) {
          ctaButton.style.transition =
            "opacity 0.8s ease-in-out 0.3s, transform 0.8s ease-in-out 0.3s";
          ctaButton.style.opacity = isVisible ? "1" : "0";
          ctaButton.style.transform = isVisible
            ? "translateY(0)"
            : "translateY(20px)";
        }

        // Se o contêiner tiver conteúdo interno adicional, também aplicar animação
        const allChildren = targetElement.children;
        Array.from(allChildren).forEach((child, index) => {
          if (
            !child.classList.contains("section-title") &&
            !child.classList.contains("section-subtitle") &&
            !child.classList.contains("cta-button-custom")
          ) {
            child.style.transition = `opacity 0.8s ease-in-out ${
              0.1 + index * 0.1
            }s, transform 0.8s ease-in-out ${0.1 + index * 0.1}s`;
            child.style.opacity = isVisible ? "1" : "0";
            child.style.transform = isVisible
              ? "translateY(0)"
              : "translateY(20px)";
          }
        });
      }

      // Lógica existente para big-numbers
      else if (targetElement.classList.contains("big-numbers")) {
        const listItems = targetElement.querySelectorAll("ul li");
        const counters = targetElement.querySelectorAll(
          ".number, .experience-years"
        );

        if (isVisible) {
          console.log(
            "Elemento .big-numbers visível, iniciando/reinciando animação para contadores em:",
            targetElement
          );

          counters.forEach((counter) => {
            const originalValue = counter.dataset.originalValue;
            if (originalValue === undefined) return;
            if (originalValue.startsWith("+")) {
              counter.textContent = "+";
            } else {
              counter.textContent = "0";
            }
            counter.classList.remove("counting", "finished");
          });

          animateCounters(counters);

          listItems.forEach((item, index) => {
            item.classList.remove("animate__fadeOut");
            item.style.visibility = "visible";
            item.classList.add("animate__animated", "animate__fadeInUp");
            item.style.animationDelay = `${index * 0.05}s`;
          });
        } else {
          listItems.forEach((item) => {
            item.style.visibility = "hidden";
            item.classList.remove("animate__animated", "animate__fadeInUp");
            item.style.animationDelay = "";
          });
          counters.forEach((counter) => {
            const originalValue = counter.dataset.originalValue;
            if (originalValue === undefined) return;
            if (originalValue.startsWith("+")) {
              counter.textContent = "+";
            } else {
              counter.textContent = "0";
            }
            counter.classList.remove("counting", "finished");
          });
        }
      } else if (targetElement.classList.contains("nossas-guides-container")) {
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

  // Ampliando os elementos para animação
  const elementsToObserve = document.querySelectorAll(
    ".big-numbers, .nossas-guides-container, .section-the-news, .carousel, .section-wrapper, .titulo-subtitulo-container, .cta-button-container"
  );

  if (elementsToObserve.length > 0) {
    elementsToObserve.forEach((el) => {
      // Preparar elementos para animação
      if (
        el.classList.contains("section-wrapper") ||
        el.classList.contains("titulo-subtitulo-container") ||
        el.classList.contains("cta-button-container")
      ) {
        // Iniciar oculto
        const title = el.querySelector(".section-title");
        const subtitle = el.querySelector(".section-subtitle");
        const ctaButton = el.querySelector(".cta-button-custom");

        if (title) {
          title.style.opacity = "0";
          title.style.transform = "translateY(20px)";
        }

        if (subtitle) {
          subtitle.style.opacity = "0";
          subtitle.style.transform = "translateY(20px)";
        }

        if (ctaButton) {
          ctaButton.style.opacity = "0";
          ctaButton.style.transform = "translateY(20px)";
        }

        // Ocultar conteúdo interno adicional
        const allChildren = el.children;
        Array.from(allChildren).forEach((child) => {
          if (
            !child.classList.contains("section-title") &&
            !child.classList.contains("section-subtitle") &&
            !child.classList.contains("cta-button-custom")
          ) {
            child.style.opacity = "0";
            child.style.transform = "translateY(20px)";
          }
        });
      }

      // Lógica existente para big-numbers
      if (el.classList.contains("big-numbers")) {
        const listItems = el.querySelectorAll("ul li");
        listItems.forEach((item) => (item.style.visibility = "hidden"));

        const counters = el.querySelectorAll(".number, .experience-years");
        counters.forEach((counter) => {
          let originalValue = "";
          if (counter.classList.contains("experience-years")) {
            const inaugurationYear = 1958;
            const currentYear = new Date().getFullYear();
            const experienceYears = currentYear - inaugurationYear;
            originalValue = `+${experienceYears}`;
          } else {
            originalValue = counter.textContent.trim();
          }

          counter.dataset.originalValue = originalValue;

          if (originalValue.startsWith("+")) {
            counter.textContent = "+";
          } else {
            counter.textContent = "0";
          }
          console.log(
            `Contador preparado: ${counter.className}, Valor Original: ${originalValue}, Texto Inicial: ${counter.textContent}`
          );
        });
      }

      // Observar o elemento
      observer.observe(el);
    });
    console.log(
      "IntersectionObserver ampliado configurado:",
      elementsToObserve
    );
  } else {
    console.warn("Nenhum elemento encontrado para observar animações.");
  }
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

class Carousel {
  constructor() {
    this.scrollSpeed = 0.5;
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

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
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

function setupCtaButtonEffect() {
  const ctaButton = document.querySelector(".cta-button-custom");

  if (!ctaButton) {
    console.warn("CTA Button não encontrado");
    return;
  }

  console.log("CTA button encontrado, configurando efeitos");

  // Reiniciar animação de luz ao deixar o hover
  ctaButton.addEventListener("mouseleave", function () {
    this.classList.remove("hover-active");
    void this.offsetWidth; // Forçar reflow
    this.classList.add("hover-active");
  });

  // Adicionar animação de clique com propagação do evento
  ctaButton.addEventListener("mousedown", function (e) {
    console.log("Botão pressionado");
    this.classList.add("button-pressed");

    // Garantir que o efeito permaneça mesmo que o mouse seja movido
    const buttonRef = this;
    function removePress() {
      console.log("Removendo efeito pressionado");
      buttonRef.classList.remove("button-pressed");
      document.removeEventListener("mouseup", removePress);
    }

    document.addEventListener("mouseup", removePress);
  });

  // Adicionar também para interação touch
  ctaButton.addEventListener("touchstart", function (e) {
    console.log("Botão tocado (touch)");
    this.classList.add("button-pressed");
    e.preventDefault(); // Prevenir comportamento de scroll/zoom
  });

  ctaButton.addEventListener("touchend", function () {
    console.log("Toque finalizado (touch)");
    this.classList.remove("button-pressed");
  });

  console.log("CTA button effects initialized");
}

// Adiciona animação fade-in à form-container
function setupFormContainerFadeIn() {
  const formContainer = document.querySelector('.form-container');
  if (formContainer) {
    formContainer.classList.add('fade-in');
  }
}

// Scroll suave ao clicar no botão 'Quero um representante'
function setupScrollToForm() {
  const btn = document.querySelector(".cta-button-representante");
  const formSection = document.querySelector(".form-container");
  if (btn && formSection) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      formSection.scrollIntoView({ behavior: "smooth" });
    });
  }
}

// Remove fade do botão 'Quero ser representante'
function removeFadeFromQueroSerRepBtn() {
  const btn = document.querySelector('.cta-button-quero-ser-representante');
  if (btn) {
    btn.classList.remove('fade-in', 'visible');
    btn.style.opacity = '';
    btn.style.transform = '';
  }
}
})

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

class Carousel {
  constructor() {
    this.scrollSpeed = 0.5;
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

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
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

function setupCtaButtonEffect() {
  const ctaButton = document.querySelector(".cta-button-custom");

  if (!ctaButton) {
    console.warn("CTA Button não encontrado");
    return;
  }

  console.log("CTA button encontrado, configurando efeitos");

  // Reiniciar animação de luz ao deixar o hover
  ctaButton.addEventListener("mouseleave", function () {
    this.classList.remove("hover-active");
    void this.offsetWidth; // Forçar reflow
    this.classList.add("hover-active");
  });

  // Adicionar animação de clique com propagação do evento
  ctaButton.addEventListener("mousedown", function (e) {
    console.log("Botão pressionado");
    this.classList.add("button-pressed");

    // Garantir que o efeito permaneça mesmo que o mouse seja movido
    const buttonRef = this;
    function removePress() {
      console.log("Removendo efeito pressionado");
      buttonRef.classList.remove("button-pressed");
      document.removeEventListener("mouseup", removePress);
    }

    document.addEventListener("mouseup", removePress);
  });

  // Adicionar também para interação touch
  ctaButton.addEventListener("touchstart", function (e) {
    console.log("Botão tocado (touch)");
    this.classList.add("button-pressed");
    e.preventDefault(); // Prevenir comportamento de scroll/zoom
  });

  ctaButton.addEventListener("touchend", function () {
    console.log("Toque finalizado (touch)");
    this.classList.remove("button-pressed");
  });

  console.log("CTA button effects initialized");
}
