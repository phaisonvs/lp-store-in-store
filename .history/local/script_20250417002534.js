/**
 * @description Script principal para os componentes da página "Seja um Franqueado"
 * @author Dev ABC da Construção
 */
document.addEventListener("DOMContentLoaded", () => {
  // Estado global dos carrosséis e controles
  const state = {
    guideShopCarousel: {
      scrollSpeed: 0.5,
      currentTranslate: 0,
      animationId: null,
      isDragging: false,
      startPosition: 0,
      prevTranslate: 0,
      cardWidth: 0,
      cloneCount: 0,
    },
    animations: {
      observer: null,
      initialized: false,
      sections: [
        ".big-numbers",
        ".section-the-news",
        ".nossas-guides-container",
        ".carousel",
        ".card-prova-social",
        ".big-numbers ul li",
      ],
    },
    isInitialized: false,
  };

  /**
   * @description Configura o IntersectionObserver para animar elementos ao entrarem no viewport
   */
  const setupScrollAnimations = () => {
    if (state.animations.initialized) return;

    // Adicionar classe necessária para os elementos animados
    const elementsToAnimate = document.querySelectorAll(
      state.animations.sections.join(", ")
    );
    elementsToAnimate.forEach((element) => {
      element.classList.add("animate-on-scroll");
    });

    // Criar um IntersectionObserver com configurações otimizadas
    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.1, // 10% do elemento visível antes de disparar
    };

    state.animations.observer = new IntersectionObserver((entries) => {
      // Primeiro verifica se algum elemento está visível
      const anyVisible = entries.some((entry) => entry.isIntersecting);

      if (anyVisible) {
        // Usa requestAnimationFrame para sincronizar todas as animações
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            } else {
              entry.target.classList.remove("is-visible");
            }
          });
        });
      }
    }, observerOptions);

    // Observar todos os elementos que devem ser animados
    elementsToAnimate.forEach((element) => {
      state.animations.observer.observe(element);
    });

    state.animations.initialized = true;
  };

  /**
   * @description Inicializa o parallax simples
   * @returns {void}
   */
  const setupParallax = () => {
    const section = document.querySelector(".seja-um-franqueado");
    if (!section) return;

    // Remove os botões de controle se existirem
    const existingToggle = document.querySelector(".bg-toggle-container");
    if (existingToggle) {
      existingToggle.remove();
    }

    // Configurar o efeito de parallax simples com maior suavidade
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const speed = 0.08; // Velocidade reduzida para maior suavidade

      // Calcula o deslocamento do fundo com base no scroll
      const yPos = -scrollPosition * speed;

      // Aplica o efeito parallax
      section.style.backgroundPosition = `center ${yPos}px`;
    };

    // Adiciona o listener de scroll com throttling para melhor desempenho
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Inicializa a posição
    handleScroll();
  };

  /**
   * @description Detecta elementos no viewport para aplicar animações
   * @returns {void}
   */
  const checkElementsInViewport = () => {
    const animatedElements = document.querySelectorAll(
      ".big-numbers, .section-the-news, .nossas-guides-container, .carousel, .card-prova-social"
    );

    animatedElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isInViewport =
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
        rect.bottom >= 0;

      if (isInViewport) {
        element.style.animationPlayState = "running";
      }
    });
  };

  /**
   * @description Inicializa o carrossel de Guide Shops
   * @returns {void}
   */
  const initGuideShopCarousel = () => {
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");

    if (!carousel || !track) return;

    const cards = track.querySelectorAll(".carousel__card");
    if (cards.length === 0) return;

    // Clone cards para criar um efeito de loop contínuo
    cloneCards(cards, track);

    // Iniciar a animação contínua
    startContinuousAnimation(track);

    // Configurar listeners de eventos
    setupGuideShopCarouselEventListeners(carousel, track);
  };

  /**
   * @description Clona cartões para criar um efeito infinito
   * @param {NodeList} cards - Cartões a serem clonados
   * @param {HTMLElement} track - Container dos cartões
   * @returns {void}
   */
  const cloneCards = (cards, track) => {
    const cardsToClone = Array.from(cards).slice(0, 4); // Clonar apenas os primeiros 4
    state.guideShopCarousel.cloneCount = cardsToClone.length;

    cardsToClone.forEach((card) => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    // Obter a largura de um cartão para cálculos de animação
    if (cards.length > 0) {
      state.guideShopCarousel.cardWidth = cards[0].offsetWidth;
    }
  };

  /**
   * @description Inicia a animação contínua do carrossel
   * @param {HTMLElement} track - Container dos cartões
   * @returns {void}
   */
  const startContinuousAnimation = (track) => {
    if (state.guideShopCarousel.animationId) {
      cancelAnimationFrame(state.guideShopCarousel.animationId);
    }
    animate(track);
  };

  /**
   * @description Função de animação do carrossel
   * @param {HTMLElement} track - Container dos cartões
   * @returns {void}
   */
  const animate = (track) => {
    const { currentTranslate, scrollSpeed, cardWidth } =
      state.guideShopCarousel;
    const cards = track.querySelectorAll(".carousel__card");

    // Calcula o limite para o reset
    const resetPoint =
      -cardWidth * (cards.length - state.guideShopCarousel.cloneCount);

    // Atualiza a posição
    state.guideShopCarousel.currentTranslate -= scrollSpeed;

    // Verifica se precisa resetar para criar loop infinito
    if (currentTranslate <= resetPoint) {
      state.guideShopCarousel.currentTranslate = 0;
    }

    // Aplica a transformação
    track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;

    // Continua a animação
    state.guideShopCarousel.animationId = requestAnimationFrame(() =>
      animate(track)
    );
  };

  /**
   * @description Configura os eventos do carrossel
   * @param {HTMLElement} carousel - Container do carrossel
   * @param {HTMLElement} track - Container dos cartões
   * @returns {void}
   */
  const setupGuideShopCarouselEventListeners = (carousel, track) => {
    const prevButton = carousel.querySelector(".guide-shop-prev");
    const nextButton = carousel.querySelector(".guide-shop-next");

    // Handlers para desktop
    const pointerStart = (e) => {
      state.guideShopCarousel.isDragging = true;
      state.guideShopCarousel.startPosition = e.pageX;
      state.guideShopCarousel.prevTranslate =
        state.guideShopCarousel.currentTranslate;

      cancelAnimationFrame(state.guideShopCarousel.animationId);

      track.style.cursor = "grabbing";
    };

    const pointerMove = (e) => {
      if (!state.guideShopCarousel.isDragging) return;

      const currentPosition = e.pageX;
      const diff = currentPosition - state.guideShopCarousel.startPosition;

      state.guideShopCarousel.currentTranslate =
        state.guideShopCarousel.prevTranslate + diff;
      track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
    };

    const pointerEnd = () => {
      handleDragEnd(track);
    };

    // Eventos para desktop
    track.addEventListener("mousedown", pointerStart);
    window.addEventListener("mousemove", pointerMove);
    window.addEventListener("mouseup", pointerEnd);

    // Eventos para dispositivos móveis
    track.addEventListener("touchstart", (e) => {
      pointerStart({ pageX: e.touches[0].pageX });
    });

    window.addEventListener("touchmove", (e) => {
      pointerMove({ pageX: e.touches[0].pageX });
    });

    window.addEventListener("touchend", pointerEnd);

    // Botões de navegação
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        cancelAnimationFrame(state.guideShopCarousel.animationId);
        state.guideShopCarousel.currentTranslate +=
          state.guideShopCarousel.cardWidth;
        track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
        startContinuousAnimation(track);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        cancelAnimationFrame(state.guideShopCarousel.animationId);
        state.guideShopCarousel.currentTranslate -=
          state.guideShopCarousel.cardWidth;
        track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
        startContinuousAnimation(track);
      });
    }
  };

  /**
   * @description Finaliza o arrastar e reinicia a animação
   * @param {HTMLElement} track - Container dos cartões
   * @returns {void}
   */
  const handleDragEnd = (track) => {
    state.guideShopCarousel.isDragging = false;
    track.style.cursor = "grab";
    startContinuousAnimation(track);
  };

  /**
   * @description Configura os controles do carrossel de vídeos
   * @returns {void}
   */
  const setupVideoCarouselControls = () => {
    const carousel = document.querySelector(".carrossel-prova-social-1");
    const prevButton = document.querySelector(
      ".container-prova-social-1 .container-seta-esquerda"
    );
    const nextButton = document.querySelector(
      ".container-prova-social-1 .container-seta-direita"
    );

    if (!carousel || !prevButton || !nextButton) return;

    const cards = carousel.querySelectorAll(".card-prova-social");
    if (cards.length === 0) return;

    const scrollAmount = cards[0].offsetWidth + 20; // largura + margem

    prevButton.addEventListener("click", () => {
      carousel.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    });

    nextButton.addEventListener("click", () => {
      carousel.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    });
  };

  /**
   * @description Atualiza os anos de experiência
   * @returns {void}
   */
  const updateExperienceYears = () => {
    const currentYear = new Date().getFullYear();
    const foundingYear = 2014; // Ano de fundação da ABC
    const yearsOfExperience = currentYear - foundingYear;

    const experienceElements = document.querySelectorAll(".experience-years");
    experienceElements.forEach((el) => {
      el.textContent = `+${yearsOfExperience}`;
    });
  };

  /**
   * @description Inicializa todos os componentes
   * @returns {void}
   */
  const init = () => {
    if (state.isInitialized) return;

    // Configurar animações de scroll
    setupScrollAnimations();

    // Aplicar o efeito de parallax simples
    setupParallax();

    // Inicializar carrossel de guide shops
    initGuideShopCarousel();

    // Inicializar controles do carrossel de vídeos
    setupVideoCarouselControls();

    // Atualizar anos de experiência
    updateExperienceYears();

    state.isInitialized = true;
  };

  // Inicializar quando o DOM estiver carregado
  init();
});
