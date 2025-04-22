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

    // Criar um IntersectionObserver baseado nas diretrizes do Framer
    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.15, // 15% do elemento visível antes de disparar
    };

    state.animations.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Quando elemento está visível (entrando ou já visível)
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          // Opcional: parar de observar após o elemento ser animado
          // state.animations.observer.unobserve(entry.target);
        } else {
          // Quando o elemento sai do viewport - remover classe para animar novamente
          // quando voltar a estar visível (scroll para cima)
          entry.target.classList.remove("is-visible");
        }
      });
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

    // Configurar listeners de eventos (MODIFICADO)
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
   * @description Configura os eventos do carrossel (MODIFICADO)
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

      carousel.style.cursor = "grabbing"; // Mudar cursor no container
      track.style.transition = "none"; // Remover transição durante o drag
    };

    const pointerMove = (e) => {
      if (!state.guideShopCarousel.isDragging) return;

      const currentPosition = e.pageX;
      const diff = currentPosition - state.guideShopCarousel.startPosition;

      // Calcula a nova posição do track
      state.guideShopCarousel.currentTranslate =
        state.guideShopCarousel.prevTranslate + diff;
      track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
    };

    const pointerEnd = () => {
      if (!state.guideShopCarousel.isDragging) return;
      handleDragEnd(carousel, track);
    };

    // Eventos para desktop (MODIFICADO - listeners no carousel)
    carousel.addEventListener("mousedown", pointerStart);
    window.addEventListener("mousemove", pointerMove); // Mantém no window para capturar fora do elemento
    window.addEventListener("mouseup", pointerEnd); // Mantém no window para capturar fora do elemento
    carousel.addEventListener("mouseleave", pointerEnd); // Adiciona mouseleave no carousel

    // Eventos para dispositivos móveis (MODIFICADO - listeners no carousel)
    carousel.addEventListener(
      "touchstart",
      (e) => {
        pointerStart({ pageX: e.touches[0].pageX });
      },
      { passive: true }
    ); // Otimização para scroll

    window.addEventListener("touchmove", (e) => {
      if (!state.guideShopCarousel.isDragging) return;
      // Prevenir scroll da página enquanto arrasta o carrossel horizontalmente
      // e.preventDefault();
      pointerMove({ pageX: e.touches[0].pageX });
    }); // Opcional: { passive: false } se usar preventDefault

    window.addEventListener("touchend", pointerEnd);
    window.addEventListener("touchcancel", pointerEnd); // Lidar com cancelamentos

    // Evitar seleção de texto/imagens durante o drag
    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    // Botões de navegação (sem mudanças)
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        cancelAnimationFrame(state.guideShopCarousel.animationId);
        state.guideShopCarousel.currentTranslate +=
          state.guideShopCarousel.cardWidth;
        track.style.transition = "transform 0.5s var(--ease-out-smooth)"; // Adicionar transição de volta
        track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
        // A animação contínua não deve ser reiniciada aqui, apenas o snap
        // Idealmente, adicionar lógica de snap para o card mais próximo
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        cancelAnimationFrame(state.guideShopCarousel.animationId);
        state.guideShopCarousel.currentTranslate -=
          state.guideShopCarousel.cardWidth;
        track.style.transition = "transform 0.5s var(--ease-out-smooth)"; // Adicionar transição de volta
        track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
        // A animação contínua não deve ser reiniciada aqui, apenas o snap
      });
    }
  };

  /**
   * @description Finaliza o arrastar e reinicia a animação (MODIFICADO)
   * @param {HTMLElement} carousel - Container do carrossel
   * @param {HTMLElement} track - Container dos cartões
   * @returns {void}
   */
  const handleDragEnd = (carousel, track) => {
    state.guideShopCarousel.isDragging = false;
    carousel.style.cursor = "grab"; // Mudar cursor no container
    track.style.transition = "transform 0.5s var(--ease-out-smooth)"; // Adicionar transição de volta

    // Implementar lógica de Snap para o card mais próximo (opcional, mas recomendado)
    // const snapPosition = Math.round(state.guideShopCarousel.currentTranslate / state.guideShopCarousel.cardWidth) * state.guideShopCarousel.cardWidth;
    // state.guideShopCarousel.currentTranslate = snapPosition;
    // track.style.transform = `translateX(${snapPosition}px)`;

    // Reiniciar a animação contínua APÓS o snap (se houver)
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
