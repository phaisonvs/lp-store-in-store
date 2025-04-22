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
});

/**
 * @description Adiciona classe para iniciar animação imediata em elementos específicos.
 */
function triggerImmediateEntranceAnimation() {
  const elements = document.querySelectorAll(
    ".svg-suf-desk, .svg-suf-mobile, .maior-rede-de-acabamentos"
  );
  if (elements.length > 0) {
    // Pequeno delay para garantir que o CSS foi parseado antes de adicionar a classe
    setTimeout(() => {
      elements.forEach((el) => el.classList.add("is-loaded-visible"));
      console.log("Animação de entrada imediata acionada para:", elements);
    }, 50); // 50ms delay
  } else {
    console.warn("Elementos para animação imediata não encontrados.");
  }
}

/**
 * @description Configura IntersectionObserver para animações de entrada
 */
function setupEntranceAnimations() {
  const observerOptions = {
    root: null, // Observa em relação à viewport
    rootMargin: "0px",
    threshold: 0.15, // Trigger quando 15% do elemento está visível (ajustado)
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const targetElement = entry.target;

        // Adiciona classe genérica para animação de entrada
        targetElement.classList.add("is-visible");

        // Anima os contadores dentro de .big-numbers ul li
        if (targetElement.matches(".big-numbers ul li")) {
          const numberElement = targetElement.querySelector(".number");
          if (numberElement && !numberElement.dataset.animated) {
            animateCounter(numberElement);
            numberElement.dataset.animated = "true"; // Marca como animado
          }
          // Não desconectar aqui, pois observamos o LI, não o .big-numbers
          // observer.unobserve(targetElement);
        }
        // Anima os itens dentro de .nossas-guides-container (mantido)
        else if (targetElement.classList.contains("nossas-guides-container")) {
          const title = targetElement.querySelector("h3");
          const subtitle = targetElement.querySelector(".subtexto-guide");
          if (title) title.classList.add("is-visible");
          if (subtitle) subtitle.classList.add("is-visible");
          observer.unobserve(targetElement);
        }
        // Anima os cards dentro de .section-the-news (mantido)
        else if (targetElement.classList.contains("section-the-news")) {
          const cards = targetElement.querySelectorAll(
            ".card-main, .card-secondary"
          );
          cards.forEach((card) => card.classList.add("is-visible"));
          observer.unobserve(targetElement);
        }
        // Anima os cards dentro de .carousel (mantido)
        else if (targetElement.classList.contains("carousel")) {
          const cards = targetElement.querySelectorAll(".carousel__card");
          cards.forEach((card) => card.classList.add("is-visible"));
          observer.unobserve(targetElement);
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Modificar para observar os LIs diretamente, e os outros containers
  const elementsToObserve = document.querySelectorAll(
    ".big-numbers ul li, .nossas-guides-container, .section-the-news, .carousel"
    // Note: Adicionei .animate-on-scroll aos LIs no HTML, podemos usar isso:
    // ".animate-on-scroll, .nossas-guides-container, .section-the-news, .carousel"
  );

  if (elementsToObserve.length > 0) {
    elementsToObserve.forEach((el) => observer.observe(el));
    console.log("IntersectionObserver configurado para:", elementsToObserve);
  } else {
    console.warn(
      "Nenhum elemento encontrado para observar animações de entrada."
    );
  }
}

/**
 * @description Anima um contador numérico de 0 até o valor alvo.
 */
function animateCounter(element) {
  const textContent = element.textContent;
  const targetValue = parseInt(
    textContent.replace(/[^\d.,-]/g, "").replace(/[.,](?=\d{3})/g, ""),
    10
  );
  const prefix = textContent.match(/^[^\d.,]*/)?.[0] || ""; // Captura +, etc. no início
  const suffix = textContent.match(/[^\d.,]*$/)?.[0] || ""; // Captura %, anos, etc. no fim

  if (isNaN(targetValue)) {
    console.warn(
      "animateCounter: Target value is not a number for element:",
      element,
      "Text:",
      textContent
    );
    element.textContent = textContent; // Garante que o texto original seja exibido
    return;
  }

  const duration = 1500; // Duração da animação em ms
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Usar easing function para suavizar (ex: easeOutQuad)
    const easedProgress = progress * (2 - progress);
    const currentValue = Math.floor(easedProgress * targetValue);

    // Formatar o número se necessário (ex: para milhares com ponto)
    // const formattedValue = currentValue.toLocaleString('pt-BR');
    const formattedValue = currentValue; // Simples por agora

    element.textContent = `${prefix}${formattedValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  // Inicia com 0 ou prefixo/sufixo
  element.textContent = `${prefix}0${suffix}`;
  requestAnimationFrame(step);
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
