/**
 * @description Script principal otimizado para performance da página "Seja um Franqueado"
 * @author Dev ABC da Construção
 */
document.addEventListener("DOMContentLoaded", () => {
  // Estado global otimizado - reduzido ao essencial
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
      isTransitioning: false,
      autoplayEnabled: true,
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
        ".section-franquias",
      ],
    },
  };

  /**
   * @description Configura o IntersectionObserver para animar elementos ao entrarem no viewport - otimizado
   * Modificado para mostrar elementos imediatamente sem animação
   */
  const setupScrollAnimations = () => {
    // Desativa animações e torna elementos visíveis imediatamente
    const animatedElements = document.querySelectorAll(
      ".animate-on-scroll, .container-prova-social-1, .section-the-news, .nossas-guides-container, .carousel, .svg-suf-desk, .svg-suf-mobile, .faca-parte, .big-numbers ul li"
    );

    animatedElements.forEach((element) => {
      if (element) {
        element.style.opacity = "1";
        element.style.visibility = "visible";
        element.style.transform = "none";
        element.style.animation = "none";
        element.classList.add("is-visible");
      }
    });

    // Desativar o observer completamente
    state.animations.observer = null;
    state.animations.initialized = true;
  };

  /**
   * @description Inicializa o parallax simples - otimizado para performance
   */
  const setupParallax = () => {
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
  };

  /**
   * @description Inicializa o carrossel de Guide Shops - otimizado
   */
  const initGuideShopCarousel = () => {
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");

    if (!carousel || !track) return;

    // Garantir que o carrossel esteja visível
    carousel.style.opacity = "1";
    carousel.style.visibility = "visible";

    // Propriedades CSS para melhorar desempenho touch/drag
    carousel.style.touchAction = "pan-y";
    carousel.style.cursor = "grab";

    // Aplicar will-change para avisar o browser sobre animações
    track.style.willChange = "transform";

    const cards = track.querySelectorAll(".carousel__card");
    if (cards.length === 0) return;

    // Clone cards para criar um efeito de loop contínuo - agora com otimização para menor número de nodes
    const cardWidth = cards[0].offsetWidth;
    state.guideShopCarousel.cardWidth = cardWidth;

    // Clone apenas o necessário para loop contínuo
    const cardsToClone = Array.from(cards).slice(0, Math.min(4, cards.length));
    state.guideShopCarousel.cloneCount = cardsToClone.length;

    // Criar todos os clones em um único fragment para melhor performance (menos reflows)
    const fragment = document.createDocumentFragment();
    cardsToClone.forEach((card) => {
      const clone = card.cloneNode(true);
      fragment.appendChild(clone);
    });
    track.appendChild(fragment);

    // Configurar listeners de eventos otimizados
    setupGuideShopCarouselEventListeners(carousel, track);
  };

  /**
   * @description Inicia a animação contínua do carrossel - otimizada
   * @param {HTMLElement} track - Container dos cartões
   */
  const startContinuousAnimation = (track) => {
    // Animação desativada para mostrar elementos imediatamente
    return;
  };

  /**
   * @description Função de animação do carrossel - otimizada com melhor gerenciamento de recursos
   * @param {HTMLElement} track - Container dos cartões
   */
  const animate = (track) => {
    // Se estiver em transição ou dragging ativo, pular este frame
    if (
      state.guideShopCarousel.isTransitioning ||
      state.guideShopCarousel.isDragging
    ) {
      state.guideShopCarousel.animationId = requestAnimationFrame(() =>
        animate(track)
      );
      return;
    }

    // Verifica se o elemento ainda existe
    if (!track || !document.body.contains(track)) return;

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

    // Usa transform para beneficiar da aceleração GPU
    track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;

    // Continua a animação apenas se o documento estiver visível
    if (!document.hidden) {
      state.guideShopCarousel.animationId = requestAnimationFrame(() =>
        animate(track)
      );
    }
  };

  /**
   * @description Configura os eventos do carrossel - otimizado com passive listeners e melhores práticas
   * @param {HTMLElement} carousel - Container do carrossel
   * @param {HTMLElement} track - Container dos cartões
   */
  const setupGuideShopCarouselEventListeners = (carousel, track) => {
    const prevButton = carousel.querySelector(".guide-shop-prev");
    const nextButton = carousel.querySelector(".guide-shop-next");

    // Feedback visual mais claro para botões
    if (prevButton) {
      prevButton.addEventListener("mouseenter", () => {
        prevButton.style.transform = "scale(1.1)";
        prevButton.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
      });

      prevButton.addEventListener("mouseleave", () => {
        prevButton.style.transform = "scale(1)";
        prevButton.style.boxShadow = "none";
      });

      // Feedback tátil para toque
      prevButton.addEventListener(
        "touchstart",
        () => {
          prevButton.style.transform = "scale(1.1)";
          prevButton.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
        },
        { passive: true }
      );

      prevButton.addEventListener(
        "touchend",
        () => {
          prevButton.style.transform = "scale(1)";
          prevButton.style.boxShadow = "none";
        },
        { passive: true }
      );
    }

    if (nextButton) {
      nextButton.addEventListener("mouseenter", () => {
        nextButton.style.transform = "scale(1.1)";
        nextButton.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
      });

      nextButton.addEventListener("mouseleave", () => {
        nextButton.style.transform = "scale(1)";
        nextButton.style.boxShadow = "none";
      });

      // Feedback tátil para toque
      nextButton.addEventListener(
        "touchstart",
        () => {
          nextButton.style.transform = "scale(1.1)";
          nextButton.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
        },
        { passive: true }
      );

      nextButton.addEventListener(
        "touchend",
        () => {
          nextButton.style.transform = "scale(1)";
          nextButton.style.boxShadow = "none";
        },
        { passive: true }
      );
    }

    // Otimizado para melhor performance de arrastar
    const pointerStart = (e) => {
      if (state.guideShopCarousel.isDragging) return;

      state.guideShopCarousel.isDragging = true;
      state.guideShopCarousel.startPosition =
        e.pageX || (e.touches && e.touches[0].pageX) || 0;
      state.guideShopCarousel.prevTranslate =
        state.guideShopCarousel.currentTranslate;

      carousel.style.cursor = "grabbing";
      track.style.transition = "none";
    };

    const pointerMove = (e) => {
      if (!state.guideShopCarousel.isDragging) return;

      const currentPosition = e.pageX || (e.touches && e.touches[0].pageX) || 0;
      const diff = currentPosition - state.guideShopCarousel.startPosition;

      // Aplicar resistência nas extremidades para melhor UX
      const dampenFactor = 0.8;
      const dampedDiff = diff * dampenFactor;

      // Calcular nova posição com melhor precisão
      state.guideShopCarousel.currentTranslate =
        state.guideShopCarousel.prevTranslate + dampedDiff;

      // Usar requestAnimationFrame para suavizar a transformação
      requestAnimationFrame(() => {
        track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
      });
    };

    const endDrag = () => {
      if (!state.guideShopCarousel.isDragging) return;

      state.guideShopCarousel.isDragging = false;
      carousel.classList.remove("grabbing");

      // Restaurar comportamento de scroll suave
      carousel.style.scrollBehavior = "smooth";

      // Aplicar momentum para um efeito mais natural
      if (Math.abs(velocity) > 0.5) {
        applyMomentum();
      }
    };

    // Eventos para desktop otimizados
    carousel.addEventListener("mousedown", pointerStart, { passive: true });
    window.addEventListener("mousemove", pointerMove, { passive: true });
    window.addEventListener("mouseup", endDrag);
    carousel.addEventListener("mouseleave", endDrag);

    // Eventos para dispositivos móveis otimizados
    carousel.addEventListener(
      "touchstart",
      (e) => {
        pointerStart({ pageX: e.touches[0].pageX });
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (state.guideShopCarousel.isDragging) {
          pointerMove({ pageX: e.touches[0].pageX });
        }
      },
      { passive: true }
    );

    window.addEventListener("touchend", endDrag, { passive: true });
    window.addEventListener("touchcancel", endDrag, { passive: true });

    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    // Otimização para botões de navegação
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (state.guideShopCarousel.isTransitioning) return;
        state.guideShopCarousel.isTransitioning = true;

        // Adicionar transição suave
        track.style.transition = "transform 0.5s var(--ease-out-smooth)";

        // Mover um cartão para a esquerda
        state.guideShopCarousel.currentTranslate +=
          state.guideShopCarousel.cardWidth;

        // Aplicar a transformação
        track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;

        // Adicionar feedback visual ao botão
        prevButton.classList.add("active");

        // Verificar se precisa resetar para o final
        const cards = track.querySelectorAll(".carousel__card");
        const resetPoint =
          -state.guideShopCarousel.cardWidth *
          (cards.length - state.guideShopCarousel.cloneCount);

        if (state.guideShopCarousel.currentTranslate > 0) {
          setTimeout(() => {
            track.style.transition = "none";
            state.guideShopCarousel.currentTranslate = resetPoint;
            track.style.transform = `translateX(${resetPoint}px)`;
          }, 500);
        }

        // Remover feedback após transição
        setTimeout(() => {
          prevButton.classList.remove("active");
          state.guideShopCarousel.isTransitioning = false;
          track.style.transition = "none";
        }, 500);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (state.guideShopCarousel.isTransitioning) return;
        state.guideShopCarousel.isTransitioning = true;

        // Adicionar transição suave
        track.style.transition = "transform 0.5s var(--ease-out-smooth)";

        // Mover um cartão para a direita
        state.guideShopCarousel.currentTranslate -=
          state.guideShopCarousel.cardWidth;

        // Aplicar a transformação
        track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;

        // Adicionar feedback visual ao botão
        nextButton.classList.add("active");

        // Verificar se precisa resetar para o início
        const cards = track.querySelectorAll(".carousel__card");
        const resetPoint =
          -state.guideShopCarousel.cardWidth *
          (cards.length - state.guideShopCarousel.cloneCount);

        if (state.guideShopCarousel.currentTranslate <= resetPoint) {
          setTimeout(() => {
            track.style.transition = "none";
            state.guideShopCarousel.currentTranslate = 0;
            track.style.transform = `translateX(0)`;
          }, 500);
        }

        // Remover feedback após transição
        setTimeout(() => {
          nextButton.classList.remove("active");
          state.guideShopCarousel.isTransitioning = false;
          track.style.transition = "none";
        }, 500);
      });
    }

    // Otimização: Pausar animação quando a página não está visível
    const handleVisibilityChange = () => {
      // Não precisamos mais verificar o autoplay
      if (!document.hidden) {
        startContinuousAnimation(track);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
  };

  /**
   * @description Finaliza o arrastar e reinicia a animação - otimizado
   * @param {HTMLElement} carousel - Container do carrossel
   * @param {HTMLElement} track - Container dos cartões
   */
  const handleDragEnd = (carousel, track) => {
    state.guideShopCarousel.isDragging = false;
    carousel.style.cursor = "grab";

    // Marcar como em transição para evitar operações simultâneas
    state.guideShopCarousel.isTransitioning = true;

    // Implementar snap de forma eficiente
    const cardWidth = state.guideShopCarousel.cardWidth;
    const snapPosition =
      Math.round(state.guideShopCarousel.currentTranslate / cardWidth) *
      cardWidth;

    // Aplicar snap com transição suave usando RAF
    requestAnimationFrame(() => {
      track.style.transition = "transform 0.4s var(--ease-out-smooth)";
      track.style.transform = `translateX(${snapPosition}px)`;
      state.guideShopCarousel.currentTranslate = snapPosition;

      // Aguardar a transição terminar antes de reiniciar a animação contínua
      setTimeout(() => {
        // Remover a transição antes da animação contínua
        track.style.transition = "none";
        state.guideShopCarousel.isTransitioning = false;
      }, 400); // Tempo alinhado com a duração da transição
    });
  };

  /**
   * @description Configura os controles do carrossel de vídeos - otimizado
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

    // Adicionar feedback visual para os botões
    [prevButton, nextButton].forEach((button) => {
      button.addEventListener("mouseenter", () => {
        button.style.transform = "scale(1.1)";
        button.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)";
        button.style.boxShadow = "none";
      });

      // Feedback tátil para toque
      button.addEventListener(
        "touchstart",
        () => {
          button.style.transform = "scale(1.1)";
          button.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
        },
        { passive: true }
      );

      button.addEventListener(
        "touchend",
        () => {
          button.style.transform = "scale(1)";
          button.style.boxShadow = "none";
        },
        { passive: true }
      );
    });

    // Implementação de lazy loading para vídeos
    setupLazyVideos(carousel);

    // Função para calcular o scroll amount baseado no viewport
    const getScrollAmount = () => {
      const card = carousel.querySelector(".card-prova-social");
      if (!card) return 0;

      // Incluir o gap no cálculo
      const computedStyle = window.getComputedStyle(carousel);
      const gap = parseInt(computedStyle.gap) || 16; // Fallback para 16px se não definido

      return card.offsetWidth + gap;
    };

    // Eventos de navegação otimizados
    prevButton.addEventListener("click", () => {
      prevButton.classList.add("active");

      const scrollAmount = getScrollAmount();
      carousel.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });

      setTimeout(() => {
        prevButton.classList.remove("active");
      }, 500);
    });

    nextButton.addEventListener("click", () => {
      nextButton.classList.add("active");

      const scrollAmount = getScrollAmount();
      carousel.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      setTimeout(() => {
        nextButton.classList.remove("active");
      }, 500);
    });

    // Adicionar suporte para arrastar com o mouse
    let isDragging = false;
    let startX;
    let startScrollLeft;
    let momentumID;
    let velocity = 0;
    let lastTimestamp = 0;
    let lastDragX = 0;

    // Fornecer indicação visual de que o carrossel é arrastável
    carousel.style.cursor = "grab";

    const startDrag = (e) => {
      isDragging = true;
      carousel.style.cursor = "grabbing";
      carousel.classList.add("grabbing");

      startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      startScrollLeft = carousel.scrollLeft;
      lastDragX = startX;
      lastTimestamp = Date.now();

      cancelAnimationFrame(momentumID);
      carousel.style.scrollBehavior = "auto";
    };

    const duringDrag = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
      const delta = currentX - startX;

      const now = Date.now();
      const dt = now - lastTimestamp;
      if (dt > 0) {
        velocity = (lastDragX - currentX) / dt;
        lastTimestamp = now;
        lastDragX = currentX;
      }

      carousel.scrollLeft = startScrollLeft - delta;
    };

    const endDrag = () => {
      if (!isDragging) return;

      isDragging = false;
      carousel.style.cursor = "grab";
      carousel.classList.remove("grabbing");
      carousel.style.scrollBehavior = "smooth";

      if (Math.abs(velocity) > 0.5) {
        applyMomentum();
      }
    };

    const applyMomentum = () => {
      const decay = 0.95;
      const minVelocity = 0.1;

      const step = () => {
        if (Math.abs(velocity) < minVelocity) return;

        velocity *= decay;
        carousel.scrollLeft += velocity * 15;
        momentumID = requestAnimationFrame(step);
      };

      momentumID = requestAnimationFrame(step);
    };

    // Eventos para desktop
    carousel.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", duringDrag, { passive: false });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("mouseleave", endDrag);

    // Eventos para touch
    carousel.addEventListener("touchstart", startDrag, { passive: false });
    carousel.addEventListener("touchmove", duringDrag, { passive: false });
    carousel.addEventListener("touchend", endDrag);
    carousel.addEventListener("touchcancel", endDrag);

    // Atualizar visibilidade dos botões baseado no scroll
    const updateArrowsVisibility = () => {
      const isAtStart = carousel.scrollLeft <= 0;
      const isAtEnd =
        carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth;

      prevButton.style.opacity = isAtStart ? "0.5" : "1";
      prevButton.style.pointerEvents = isAtStart ? "none" : "auto";

      nextButton.style.opacity = isAtEnd ? "0.5" : "1";
      nextButton.style.pointerEvents = isAtEnd ? "none" : "auto";
    };

    carousel.addEventListener("scroll", updateArrowsVisibility);
    window.addEventListener("resize", updateArrowsVisibility);

    // Chamar inicialmente para configurar estado correto
    updateArrowsVisibility();
  };

  /**
   * @description Configura lazy loading para vídeos
   * @param {HTMLElement} container - Contêiner dos vídeos
   */
  const setupLazyVideos = (container) => {
    const videoFrames = container.querySelectorAll("iframe");

    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target;
            if (iframe.dataset.src) {
              iframe.src = iframe.dataset.src;
              iframe.classList.remove("lazy-video");
              iframe.removeAttribute("data-src");
              videoObserver.unobserve(iframe);
            }
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    videoFrames.forEach((iframe) => {
      if (!iframe.dataset.src) {
        iframe.dataset.src = iframe.src;
        iframe.src = "about:blank";
      }
      iframe.classList.add("lazy-video");
      videoObserver.observe(iframe);
    });
  };

  /**
   * @description Atualiza os anos de experiência
   */
  const updateExperienceYears = () => {
    const currentYear = new Date().getFullYear();
    const foundingYear = 2014; // Ano de fundação da ABC
    const yearsOfExperience = currentYear - foundingYear;

    // Batch DOM updates
    requestAnimationFrame(() => {
      document.querySelectorAll(".experience-years").forEach((el) => {
        el.textContent = `+${yearsOfExperience}`;
      });
    });
  };

  /**
   * @description Inicializa o slider da seção de franquias
   */
  const initFranquiasSlider = () => {
    const slider = document.querySelector(".section-franquias .carousel-track");
    if (!slider) return;

    const cards = slider.querySelectorAll(".carousel-card");
    const prevButton = document.querySelector(
      ".section-franquias .carousel-prev"
    );
    const nextButton = document.querySelector(
      ".section-franquias .carousel-next"
    );

    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 20; // 20px é o margin-right definido no CSS

    const updateSliderPosition = () => {
      slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      // Atualiza estado dos botões
      if (prevButton && nextButton) {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled =
          currentIndex >=
          cards.length - Math.floor(slider.clientWidth / cardWidth);
      }
    };

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSliderPosition();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (
          currentIndex <
          cards.length - Math.floor(slider.clientWidth / cardWidth)
        ) {
          currentIndex++;
          updateSliderPosition();
        }
      });
    }

    // Inicializa posição e estado dos botões
    updateSliderPosition();

    // Atualiza em caso de redimensionamento
    window.addEventListener("resize", updateSliderPosition);
  };

  /**
   * @description Inicializa todos os componentes de forma otimizada
   */
  const init = () => {
    // Usar requestIdleCallback (ou polyfill) para operações não críticas
    const runWhenIdle =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    // Inicializar parallax primeiro para garantir o efeito de fundo
    setupParallax();

    // Inicializar componentes críticos para renderização
    setupScrollAnimations();
    updateExperienceYears();
    setupVideoCarouselControls();

    // Inicializar carrossel quando o browser estiver ocioso
    runWhenIdle(() => {
      initGuideShopCarousel();
      initFranquiasSlider();

      // Iniciar autoplay foi desativado para evitar animações
      const track = document.querySelector(".carousel__track");
      // Não chamar startContinuousAnimation
    });
  };
  // Inicializar quando o DOM estiver carregado
  init();

  // Desativar o IntersectionObserver para restaurar o comportamento original
  const observer = window.animationObserver;
  if (observer) {
    observer.disconnect();
  }

  // Garantir que todos os elementos estejam visíveis imediatamente
  const elementsToShow = document.querySelectorAll(
    ".animate-on-scroll, .container-prova-social-1, .section-the-news, .nossas-guides-container, .carousel, .svg-suf-desk, .svg-suf-mobile, .faca-parte, .big-numbers ul li"
  );

  elementsToShow.forEach((element) => {
    if (element) {
      element.style.opacity = "1";
      element.style.visibility = "visible";
      element.style.transform = "none";
      element.style.animation = "none";
      element.classList.add("is-visible");
    }
  });

  // Função para adicionar suporte a setas de navegação no carrossel
  function adicionarSetasCarrossel() {
    const setaEsquerda = document.querySelector(".container-seta-esquerda");
    const setaDireita = document.querySelector(".container-seta-direita");
    const carrossel = document.querySelector(".carrossel-prova-social-1");

    if (!setaEsquerda || !setaDireita || !carrossel) {
      return;
    }

    const scrollAmount = 440; // Largura do card + gap

    setaEsquerda.addEventListener("click", () => {
      carrossel.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    });

    setaDireita.addEventListener("click", () => {
      carrossel.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    });
  }

  // Inicializar o suporte às setas do carrossel
  adicionarSetasCarrossel();
  // Desativar o observer de animação se existir
  if (window.animationObserver) {
    window.animationObserver.disconnect();
  }

  // Garantir que os elementos com animate-on-scroll sejam visíveis imediatamente
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => {
    el.style.opacity = "1";
    el.style.visibility = "visible";
    el.style.transform = "none";
    el.style.animation = "none";
    el.classList.add("is-visible");
  });

  // Garantir que o container-prova-social-1 seja visível
  const provaContainer = document.querySelector(".container-prova-social-1");
  if (provaContainer) {
    provaContainer.style.opacity = "1";
    provaContainer.style.visibility = "visible";
    provaContainer.style.transform = "none";
    provaContainer.style.animation = "none";
  }

  // Garantir que outros elementos importantes sejam visíveis
  const otherElements = document.querySelectorAll(
    ".section-the-news, .nossas-guides-container, .carousel, .svg-suf-desk, .svg-suf-mobile, .faca-parte, .big-numbers ul li, .video-slider-container"
  );
  otherElements.forEach((el) => {
    if (el) {
      el.style.opacity = "1";
      el.style.visibility = "visible";
      el.style.transform = "none";
      el.style.animation = "none";
      el.classList.add("is-visible");
    }
  });

  /**
   * Inicializa o slider de vídeos usando Splide.js
   */
  function initVideoSlider() {
    const videoSlider = document.getElementById('video-slider');
    
    if (!videoSlider) return;
    
    // Criar container para o cabeçalho com título e navegação
    const header = document.querySelector('.video-section-header') || document.createElement('div');
    if (!header.classList.contains('video-section-header')) {
      header.classList.add('video-section-header');
      videoSlider.parentNode.insertBefore(header, videoSlider);
    }
    
    // Garantir que o título esteja no cabeçalho
    const title = document.querySelector('.videos-title');
    if (title && title.parentNode !== header) {
      header.appendChild(title);
    }
    
    // Inicializar o Splide
    const splide = new Splide('#video-slider', {
      perPage: 3,
      gap: '20px',
      pagination: true,
      arrows: true,
      drag: true,
      snap: true,
      speed: 800,
      padding: { left: '0', right: '5%' },
      breakpoints: {
        1024: {
          perPage: 2,
          padding: { left: '0', right: '10%' }
        },
        767: {
          perPage: 1,
          padding: { left: '0', right: '15%' }
        }
      }
    });
    
    // Montar depois de configurar
    splide.mount();
    
    // Criar container personalizado para os botões de navegação
    const arrowsContainer = document.createElement('div');
    arrowsContainer.className = 'custom-arrows-container';
    
    // Obter os botões originais para clonar seus SVGs
    const originalPrev = videoSlider.querySelector('.splide__arrow--prev');
    const originalNext = videoSlider.querySelector('.splide__arrow--next');
    
    if (originalPrev && originalNext) {
      // Adicionar classe para esconder os botões originais
      const arrowsWrapper = videoSlider.querySelector('.splide__arrows');
      if (arrowsWrapper) {
        arrowsWrapper.classList.add('custom-arrows-wrapper');
      }
      
      // Criar novos botões personalizados
      const customPrev = document.createElement('button');
      customPrev.className = 'splide__arrow splide__arrow--prev custom';
      customPrev.innerHTML = originalPrev.innerHTML;
      
      const customNext = document.createElement('button');
      customNext.className = 'splide__arrow splide__arrow--next custom';
      customNext.innerHTML = originalNext.innerHTML;
      
      // Adicionar event listeners
      customPrev.addEventListener('click', () => splide.go('<'));
      customNext.addEventListener('click', () => splide.go('>'));
      
      // Adicionar ao container
      arrowsContainer.appendChild(customPrev);
      arrowsContainer.appendChild(customNext);
      
          padding: { right: "15%" },
        },
        480: {
          perPage: 1,
          padding: { right: "5%" },
        },
      },
    });

    // Inicializa o slider
    splide.mount();

    // Mover os botões de navegação para um container customizado
    const customArrowsContainer = document.querySelector(
      ".custom-arrows-container"
    );
    if (customArrowsContainer) {
      // Obter os botões de navegação do Splide
      const prevButton = videoSplide.querySelector(".splide__arrow--prev");
      const nextButton = videoSplide.querySelector(".splide__arrow--next");

      if (prevButton && nextButton) {
        // Limpar o container personalizado de setas
        customArrowsContainer.innerHTML = "";

        // Clonar os botões para manter os event listeners do Splide
        const prevClone = prevButton.cloneNode(true);
        const nextClone = nextButton.cloneNode(true);

        // Adicionar botões clonados ao container personalizado
        customArrowsContainer.appendChild(prevClone);
        customArrowsContainer.appendChild(nextClone);

        // Adicionar event listeners para os botões clonados
        prevClone.addEventListener("click", () => {
          splide.go("<");
        });

        nextClone.addEventListener("click", () => {
          splide.go(">");
        });

        // Adicionar classe ao wrapper original para esconder
        const arrowsWrapper = videoSplide.querySelector(".splide__arrows");
        if (arrowsWrapper) {
          arrowsWrapper.classList.add("custom-arrows-wrapper");
        }
      }
    }

    // Lazy load para os vídeos
    const lazyVideos = document.querySelectorAll("video[data-src]");

    lazyVideos.forEach((video) => {
      const videoObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const video = entry.target;
              const src = video.getAttribute("data-src");

              if (src) {
                video.src = src;
                video.load();
              }

              observer.unobserve(video);
            }
          });
        },
        { rootMargin: "0px", threshold: 0.1 }
      );

      videoObserver.observe(video);
    });
  }

  // Inicializar o slider de vídeos após o carregamento do DOM
  initVideoSlider();
});
