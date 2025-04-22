/**
 * @description Script principal para os componentes da página "Seja um Franqueado"
 * @author Dev ABC da Construção
 */
document.addEventListener("DOMContentLoaded", () => {
  // Estado global dos carrosséis
  const state = {
    guideShopCarousel: {
      scrollSpeed: 1,
      currentTranslate: 0,
      animationId: null,
      isDragging: false,
      startPosition: 0,
      prevTranslate: 0,
      cardWidth: 0,
      cloneCount: 0,
    },
    isInitialized: false,
    zoomEffect: {
      active: false,
      minZoom: 100,
      maxZoom: 115,
      currentZoom: 100,
    },
  };

  /**
   * @description Configura os eventos para alternar estilos de visualização do background
   * @returns {void}
   */
  const setupBackgroundToggle = () => {
    const section = document.querySelector(".seja-um-franqueado");
    const toggleButtons = document.querySelectorAll(
      ".bg-toggle-container button"
    );

    if (!section || toggleButtons.length === 0) return;

    // Configurar efeito de zoom paralaxe
    const setupZoomEffect = () => {
      const { zoomEffect } = state;

      // Resetar o zoom quando desativado
      if (!zoomEffect.active) {
        section.style.backgroundSize = "110%";
        return;
      }

      // Função que atualiza o zoom com base na posição de rolagem
      const updateZoom = () => {
        if (!zoomEffect.active) return;

        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const sectionOffset = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        // Calcular a porcentagem de visibilidade da seção na tela
        const scrollPercentage = Math.max(
          0,
          Math.min(
            1,
            (scrollPosition - sectionOffset + windowHeight) /
              (sectionHeight + windowHeight)
          )
        );

        // Calcular o zoom com base na posição de rolagem
        const zoomValue =
          zoomEffect.minZoom +
          (zoomEffect.maxZoom - zoomEffect.minZoom) * scrollPercentage;

        zoomEffect.currentZoom = zoomValue;
        section.style.backgroundSize = `${zoomValue}%`;
      };

      // Adicionar listener para o evento de rolagem
      window.addEventListener("scroll", updateZoom);

      // Atualizar o zoom inicialmente
      updateZoom();
    };

    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remover classe ativa de todos os botões
        toggleButtons.forEach((btn) => btn.classList.remove("active"));

        // Adicionar classe ativa ao botão clicado
        button.classList.add("active");

        // Obter o estilo do atributo data
        const style = button.getAttribute("data-style");

        // Remover todas as classes de estilo
        section.classList.remove(
          "bg-contain",
          "bg-expanded",
          "bg-proportional",
          "bg-zoom-active"
        );

        // Controlar o estado do efeito zoom
        const isZoomActive = style === "zoom-active";
        state.zoomEffect.active = isZoomActive;

        // Adicionar a classe selecionada
        if (style) {
          section.classList.add(`bg-${style}`);

          // Configurar o efeito de zoom, se necessário
          if (isZoomActive) {
            setupZoomEffect();
          } else {
            // Resetar tamanho do background quando não estiver em modo zoom
            section.style.backgroundSize = "";
          }
        }
      });
    });

    // Verificar se o botão de zoom já está ativo no carregamento
    const activeZoomButton = document.querySelector(
      '.bg-toggle-btn[data-style="zoom-active"].active'
    );
    if (activeZoomButton) {
      state.zoomEffect.active = true;
      setupZoomEffect();
    }
  };

  /**
   * @description Inicializa o carrossel de Guide Shops
   * @returns {void}
   */
  const initGuideShopCarousel = () => {
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");
    const prevButton = document.querySelector(".guide-shop-prev");
    const nextButton = document.querySelector(".guide-shop-next");

    if (!carousel || !track) {
      console.error("Elementos do carrossel não encontrados.");
      return;
    }

    const cards = Array.from(track.children);
    if (cards.length === 0) {
      console.error("Nenhum cartão encontrado no carrossel.");
      return;
    }

    const { guideShopCarousel } = state;
    guideShopCarousel.cardWidth = cards[0].getBoundingClientRect().width;

    const visibleCardsCount = Math.ceil(
      carousel.offsetWidth / guideShopCarousel.cardWidth
    );
    guideShopCarousel.cloneCount = visibleCardsCount * 2;

    cloneCards(cards, track);
    startContinuousAnimation(track);
    setupGuideShopCarouselEventListeners(carousel, track);

    // Configurar eventos de clique nos botões de navegação
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        moveCarousel(track, "prev");
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        moveCarousel(track, "next");
      });
    }
  };

  /**
   * @description Move o carrossel na direção especificada
   * @param {HTMLElement} track - O elemento track do carrossel
   * @param {string} direction - A direção para mover (prev ou next)
   * @returns {void}
   */
  const moveCarousel = (track, direction) => {
    const { guideShopCarousel } = state;

    // Pausar a animação automática
    if (guideShopCarousel.animationId) {
      cancelAnimationFrame(guideShopCarousel.animationId);
    }

    // Calcular a quantidade de deslocamento (3 cards)
    const moveAmount = guideShopCarousel.cardWidth * 3;

    if (direction === "prev") {
      guideShopCarousel.currentTranslate += moveAmount;
    } else {
      guideShopCarousel.currentTranslate -= moveAmount;
    }

    // Aplicar a transformação com animação suave
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(${guideShopCarousel.currentTranslate}px)`;

    // Reiniciar a animação automática após o movimento
    setTimeout(() => {
      track.style.transition = "transform 0.3s ease";
      startContinuousAnimation(track);
    }, 500);
  };

  /**
   * @description Clona os cards para criar um efeito infinito no carrossel
   * @param {Array} cards - Os cards originais do carrossel
   * @param {HTMLElement} track - O elemento track do carrossel
   * @returns {void}
   */
  const cloneCards = (cards, track) => {
    const { guideShopCarousel } = state;
    const { cloneCount } = guideShopCarousel;

    const clonesToStart = cards.slice(-cloneCount);
    const clonesToEnd = cards.slice(0, cloneCount);

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

    guideShopCarousel.currentTranslate =
      -guideShopCarousel.cardWidth * cloneCount;
    track.style.transform = `translateX(${guideShopCarousel.currentTranslate}px)`;
  };

  /**
   * @description Inicia a animação contínua do carrossel
   * @param {HTMLElement} track - O elemento track do carrossel
   * @returns {void}
   */
  const startContinuousAnimation = (track) => {
    const { guideShopCarousel } = state;

    if (guideShopCarousel.animationId) {
      cancelAnimationFrame(guideShopCarousel.animationId);
    }

    guideShopCarousel.animationId = requestAnimationFrame(() => animate(track));
  };

  /**
   * @description Função de animação do carrossel
   * @param {HTMLElement} track - O elemento track do carrossel
   * @returns {void}
   */
  const animate = (track) => {
    const { guideShopCarousel } = state;
    const { scrollSpeed, isDragging, cloneCount, cardWidth } =
      guideShopCarousel;

    const totalCards = track.children.length;
    const maxTranslate = -cardWidth * (totalCards - cloneCount);
    const resetTranslate = -cardWidth * cloneCount;

    if (!isDragging) {
      guideShopCarousel.currentTranslate -= scrollSpeed;
      track.style.transform = `translateX(${guideShopCarousel.currentTranslate}px)`;
    }

    // Resetar a posição quando chegar ao fim para criar loop infinito
    if (guideShopCarousel.currentTranslate <= maxTranslate) {
      guideShopCarousel.currentTranslate = resetTranslate;
      track.style.transform = `translateX(${guideShopCarousel.currentTranslate}px)`;
    }

    if (guideShopCarousel.currentTranslate >= 0) {
      guideShopCarousel.currentTranslate = maxTranslate;
      track.style.transform = `translateX(${guideShopCarousel.currentTranslate}px)`;
    }

    guideShopCarousel.animationId = requestAnimationFrame(() => animate(track));
  };

  /**
   * @description Configura os listeners de eventos para o carrossel
   * @param {HTMLElement} carousel - O elemento carousel
   * @param {HTMLElement} track - O elemento track do carrossel
   * @returns {void}
   */
  const setupGuideShopCarouselEventListeners = (carousel, track) => {
    // Mouse events
    carousel.addEventListener("mousedown", (e) => {
      const { guideShopCarousel } = state;
      guideShopCarousel.isDragging = true;
      guideShopCarousel.startPosition = e.pageX;
      guideShopCarousel.prevTranslate = guideShopCarousel.currentTranslate;
      cancelAnimationFrame(guideShopCarousel.animationId);
    });

    carousel.addEventListener("mousemove", (e) => {
      const { guideShopCarousel } = state;
      if (!guideShopCarousel.isDragging) return;

      const delta = e.pageX - guideShopCarousel.startPosition;
      if (
        Math.abs(delta) >
        guideShopCarousel.cardWidth * guideShopCarousel.cloneCount
      )
        return;

      guideShopCarousel.currentTranslate =
        guideShopCarousel.prevTranslate + delta;
      track.style.transform = `translateX(${guideShopCarousel.currentTranslate}px)`;
    });

    carousel.addEventListener("mouseup", () => handleDragEnd(track));
    carousel.addEventListener("mouseleave", () => handleDragEnd(track));

    // Touch events
    carousel.addEventListener("touchstart", (e) => {
      const { guideShopCarousel } = state;
      guideShopCarousel.isDragging = true;
      guideShopCarousel.startPosition = e.touches[0].clientX;
      guideShopCarousel.prevTranslate = guideShopCarousel.currentTranslate;
      cancelAnimationFrame(guideShopCarousel.animationId);
    });

    carousel.addEventListener("touchmove", (e) => {
      const { guideShopCarousel } = state;
      if (!guideShopCarousel.isDragging) return;

      const delta = e.touches[0].clientX - guideShopCarousel.startPosition;
      if (
        Math.abs(delta) >
        guideShopCarousel.cardWidth * guideShopCarousel.cloneCount
      )
        return;

      guideShopCarousel.currentTranslate =
        guideShopCarousel.prevTranslate + delta;
      track.style.transform = `translateX(${guideShopCarousel.currentTranslate}px)`;
    });

    carousel.addEventListener("touchend", () => handleDragEnd(track));
    carousel.addEventListener("touchcancel", () => handleDragEnd(track));
    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    // Velocidade do carrossel
    carousel.addEventListener("mouseenter", () => {
      state.guideShopCarousel.scrollSpeed /= 2;
    });

    carousel.addEventListener("mouseleave", () => {
      state.guideShopCarousel.scrollSpeed *= 2;
    });
  };

  /**
   * @description Manipula o fim do arrastar
   * @param {HTMLElement} track - O elemento track do carrossel
   * @returns {void}
   */
  const handleDragEnd = (track) => {
    const { guideShopCarousel } = state;
    if (guideShopCarousel.isDragging) {
      guideShopCarousel.isDragging = false;
      startContinuousAnimation(track);
    }
  };

  /**
   * @description Configura os botões de seta para o carrossel de provas sociais
   * @returns {void}
   */
  const setupVideoCarouselControls = () => {
    const carousel = document.querySelector(".carrossel-prova-social-1");
    const leftArrow = document.querySelector(
      ".container-prova-social-1 .container-seta-esquerda"
    );
    const rightArrow = document.querySelector(
      ".container-prova-social-1 .container-seta-direita"
    );
    const cards = document.querySelectorAll(".card-prova-social");

    if (!carousel || cards.length === 0) {
      console.error(
        "Elemento .carrossel-prova-social-1 ou .card-prova-social não encontrado."
      );
      return;
    }

    // Calcular a largura de um card mais margem
    const cardWidth = cards[0]?.offsetWidth + 20; // 20px para margens/gap

    const scrollAmount = cardWidth * 2; // Rolar 2 cards por vez

    if (leftArrow) {
      leftArrow.addEventListener("click", () => {
        const currentScroll = carousel.scrollLeft;
        carousel.scrollTo({
          left: Math.max(currentScroll - scrollAmount, 0),
          behavior: "smooth",
        });
      });
    }

    if (rightArrow) {
      rightArrow.addEventListener("click", () => {
        const currentScroll = carousel.scrollLeft;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        carousel.scrollTo({
          left: Math.min(currentScroll + scrollAmount, maxScroll),
          behavior: "smooth",
        });
      });
    }
  };

  /**
   * @description Atualiza os anos de experiência da empresa
   * @returns {void}
   */
  const updateExperienceYears = () => {
    const inaugurationYear = 1958;
    const currentYear = new Date().getFullYear();
    const experienceYears = currentYear - inaugurationYear;

    const experienceElements = document.querySelectorAll(".experience-years");

    if (experienceElements.length > 0) {
      experienceElements.forEach((element) => {
        element.textContent = `+${experienceYears}`;
      });
    }
  };

  /**
   * @description Inicializa todos os componentes da página
   * @returns {void}
   */
  const init = () => {
    if (state.isInitialized) return;

    setupBackgroundToggle();
    initGuideShopCarousel();
    setupVideoCarouselControls();
    updateExperienceYears();

    state.isInitialized = true;
  };

  // Inicializar quando o DOM estiver carregado
  init();

  // Limpeza de recursos quando a página for fechada
  window.addEventListener("beforeunload", () => {
    const { guideShopCarousel } = state;
    if (guideShopCarousel.animationId) {
      cancelAnimationFrame(guideShopCarousel.animationId);
    }
  });
});
