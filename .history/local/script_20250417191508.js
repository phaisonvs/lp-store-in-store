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
   * Inicializa o slider de vídeos similar ao Splide.js
   */
  function initVideoSlider() {
    const sliderContainer = document.querySelector(".video-slider-container");
    const slider = document.querySelector(".video-slider");
    const slides = document.querySelectorAll(".video-slide");
    const prevButton = document.querySelector(".video-nav.prev");
    const nextButton = document.querySelector(".video-nav.next");
    const paginationDots = document.querySelectorAll(".video-dot");

    if (!slider || slides.length === 0) return;

    // Configurações do slider semelhantes ao Splide.js
    const config = {
      perPage: 3, // Mostra 3 slides por página em desktop
      perMove: 1, // Move 1 slide por vez
      rewind: true, // Volta ao início quando chega ao fim
      gap: 20, // Espaçamento entre slides
      speed: 400, // Velocidade da transição em ms
      easing: "ease", // Função de easing
      startIndex: 0, // Slide inicial
      autoWidth: false, // Largura automática
      responsive: [
        {
          breakpoint: 992,
          settings: {
            perPage: 2, // 2 slides em telas médias
          },
        },
        {
          breakpoint: 768,
          settings: {
            perPage: 1, // 1 slide em telas pequenas
          },
        },
      ],
    };

    let state = {
      currentIndex: config.startIndex,
      perPage: config.perPage,
      slideWidth: 0,
      totalSlides: slides.length,
      slidePositions: [],
      isDragging: false,
      startPos: 0,
      currentTranslate: 0,
      prevTranslate: 0,
      animationID: 0,
      lastDragTime: 0,
      dragVelocity: 0,
      lastPageIndex: 0,
      isBusy: false, // Estado para evitar cliques múltiplos durante transições
      isMoving: false, // Estado para controlar movimento em andamento
    };

    // Lista de eventos do slider (similar ao Splide.js)
    const events = {
      listeners: {},

      // Registrar um listener para um evento
      on(event, callback) {
        if (!this.listeners[event]) {
          this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return this;
      },

      // Disparar um evento
      emit(event, ...args) {
        if (this.listeners[event]) {
          this.listeners[event].forEach((callback) => callback(...args));
        }
        return this;
      },
    };

    // Calcular o tamanho dos slides com base na largura do contêiner
    function calculateSlidesSize() {
      const containerWidth = sliderContainer.clientWidth - 40 * 2; // Subtrair padding
      const viewportWidth = window.innerWidth;

      // Aplicar configurações responsivas
      config.responsive.forEach((item) => {
        if (viewportWidth <= item.breakpoint) {
          state.perPage = item.settings.perPage;
        }
      });

      // Calcular largura dos slides
      state.slideWidth =
        (containerWidth - config.gap * (state.perPage - 1)) / state.perPage;
      state.lastPageIndex = Math.max(0, slides.length - state.perPage);

      // Calcular posições dos slides
      state.slidePositions = [];
      slides.forEach((_, index) => {
        state.slidePositions[index] =
          index * (state.slideWidth + config.gap) * -1;
      });

      // Aplicar largura aos slides
      slides.forEach((slide) => {
        slide.style.width = `${state.slideWidth}px`;
      });
    }

    // Ir para um slide específico
    function goToSlide(index, options = {}) {
      // Evita navegação durante transições, se especificado
      if (state.isBusy && options.waitForTransition !== false) {
        return;
      }

      const previousIndex = state.currentIndex;

      // Emitir evento 'move' antes de mover o slider (similar ao Splide.js)
      events.emit("move", index, previousIndex);

      // Com rewind habilitado
      if (config.rewind) {
        if (index < 0) {
          index = state.lastPageIndex;
        } else if (index > state.lastPageIndex) {
          index = 0;
        }
      } else {
        // Sem rewind, limitar aos extremos
        if (index < 0) {
          index = 0;
        } else if (index > state.lastPageIndex) {
          index = state.lastPageIndex;
        }
      }

      // Se o índice não mudar, não faz nada
      if (index === state.currentIndex && !options.force) {
        return;
      }

      state.isBusy = true;
      state.isMoving = true;
      state.currentIndex = index;
      const position = state.slidePositions[index];

      // Aplicar animação de transição
      slider.style.transition = `transform ${config.speed}ms ${config.easing}`;
      slider.style.transform = `translateX(${position}px)`;

      // Atualizar controles de navegação
      updateControls();

      // Emitir evento 'moved' após a transição (similar ao Splide.js)
      setTimeout(() => {
        slider.style.transition = "";
        state.isBusy = false;
        state.isMoving = false;
        events.emit("moved", state.currentIndex, previousIndex);
      }, config.speed);

      // Ativar/desativar slides (similar ao Splide.js 'active'/'inactive')
      slides.forEach((slide, i) => {
        const isVisible = i >= index && i < index + state.perPage;

        // Adicionar classe 'is-active' ao slide ativo
        slide.classList.toggle("is-active", i === index);
        slide.classList.toggle("is-visible", isVisible);

        // Emitir eventos appropriate
        if (isVisible) {
          events.emit("visible", slide, i);
        } else {
          events.emit("hidden", slide, i);
        }

        if (i === index) {
          events.emit("active", slide, i);
        } else if (i === previousIndex) {
          events.emit("inactive", slide, i);
        }
      });
    }

    // Atualizar controles (botões e paginação)
    function updateControls() {
      // Atualizar botões
      if (!config.rewind) {
        prevButton.style.opacity = state.currentIndex <= 0 ? "0.5" : "1";
        prevButton.style.pointerEvents =
          state.currentIndex <= 0 ? "none" : "auto";

        nextButton.style.opacity =
          state.currentIndex >= state.lastPageIndex ? "0.5" : "1";
        nextButton.style.pointerEvents =
          state.currentIndex >= state.lastPageIndex ? "none" : "auto";
      }

      // Atualizar paginação
      if (paginationDots.length > 0) {
        const totalPages = Math.ceil(slides.length / state.perPage);

        paginationDots.forEach((dot, index) => {
          if (index < totalPages) {
            dot.style.display = "block";

            // Verificar se este dot corresponde à página atual
            const startIndex = index * state.perPage;
            const endIndex = Math.min(
              startIndex + state.perPage - 1,
              slides.length - 1
            );
            const isActive =
              state.currentIndex >= startIndex &&
              state.currentIndex <= endIndex;

            dot.classList.toggle("active", isActive);

            // Emitir evento quando a paginação é atualizada (similar ao 'pagination:updated' do Splide.js)
            if (isActive) {
              events.emit("pagination:updated", dot, index);
            }
          } else {
            dot.style.display = "none";
          }
        });
      }
    }

    // Adicionar eventos de navegação
    function setupEvents() {
      // Eventos de botões com feedback visual
      if (prevButton) {
        prevButton.addEventListener("click", () => {
          // Adicionando feedback visual
          prevButton.classList.add("is-active");
          setTimeout(() => prevButton.classList.remove("is-active"), 200);

          // Navegação para o slide anterior
          goToSlide(state.currentIndex - config.perMove);
          events.emit("arrows:clicked", "prev", state.currentIndex);
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", () => {
          // Adicionando feedback visual
          nextButton.classList.add("is-active");
          setTimeout(() => nextButton.classList.remove("is-active"), 200);

          // Navegação para o próximo slide
          goToSlide(state.currentIndex + config.perMove);
          events.emit("arrows:clicked", "next", state.currentIndex);
        });
      }

      // Eventos de paginação
      if (paginationDots.length > 0) {
        paginationDots.forEach((dot, index) => {
          dot.addEventListener("click", () => {
            goToSlide(index * state.perPage);
            events.emit("pagination:clicked", dot, index);
          });
        });
      }

      // Eventos de touch com melhorias
      setupTouchEvents();

      // Eventos de teclado
      document.addEventListener("keydown", handleKeydown);

      // Evento de redimensionamento com debounce
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        events.emit("resize");

        resizeTimer = setTimeout(() => {
          handleResize();
          events.emit("resized");
        }, 200);
      });

      // Eventos de clique nos slides (similar ao 'click' do Splide.js)
      slides.forEach((slide, index) => {
        slide.addEventListener("click", (e) => {
          events.emit("click", slide, index, e);
        });
      });

      // Evento visibilidade da página
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          events.emit("hidden:page");
        } else {
          events.emit("visible:page");
        }
      });
    }

    // Configurar eventos de toque/arrasto
    function setupTouchEvents() {
      // Melhores eventos para mouse e touch
      slider.addEventListener("mousedown", dragStart, { passive: false });
      slider.addEventListener("touchstart", dragStart, { passive: true });

      window.addEventListener("mouseup", dragEnd);
      window.addEventListener("touchend", dragEnd);
      window.addEventListener("mousemove", drag, { passive: false });
      window.addEventListener("touchmove", drag, { passive: true });
      window.addEventListener("mouseleave", dragEnd);

      // Prevenção do comportamento padrão
      slider.addEventListener("dragstart", (e) => e.preventDefault());
    }

    // Iniciar arrastar
    function dragStart(e) {
      if (state.isBusy || state.isDragging) return;

      // Emitir evento drag (similar ao 'drag' do Splide.js)
      events.emit("drag");

      state.isDragging = true;
      state.startPos = getPositionX(e);
      state.prevTranslate = state.currentTranslate;

      // Extrair posição atual do transform
      const transform = window
        .getComputedStyle(slider)
        .getPropertyValue("transform");
      if (transform !== "none") {
        const matrix = new DOMMatrixReadOnly(transform);
        state.prevTranslate = matrix.m41; // Posição X da matriz de transformação
      }

      slider.style.cursor = "grabbing";
      slider.classList.add("is-dragging");

      cancelAnimationFrame(state.animationID);
      state.lastDragTime = new Date().getTime();

      // Impedir clique em links durante arrasto
      e.preventDefault && e.preventDefault();
    }

    // Durante arrastar
    function drag(e) {
      if (!state.isDragging) return;

      // Emitir evento dragging (similar ao 'dragging' do Splide.js)
      events.emit("dragging");

      const currentPosition = getPositionX(e);
      const diff = currentPosition - state.startPos;
      state.currentTranslate = state.prevTranslate + diff;

      // Adicionar resistência nas extremidades
      if (
        (state.currentIndex === 0 && diff > 0) ||
        (state.currentIndex >= state.lastPageIndex && diff < 0)
      ) {
        state.currentTranslate = state.prevTranslate + diff * 0.5; // Reduzir movimento nas extremidades
      }

      // Calcular velocidade para momentum
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - state.lastDragTime;
      if (timeDiff > 0) {
        state.dragVelocity = (currentPosition - state.startPos) / timeDiff;
      }
      state.lastDragTime = currentTime;

      // Aplicar transform com requestAnimationFrame para melhor performance
      state.animationID = requestAnimationFrame(() => {
        slider.style.transition = "none";
        slider.style.transform = `translateX(${state.currentTranslate}px)`;
      });

      // Prevenir scroll da página durante arrasto
      e.preventDefault && e.preventDefault();
    }

    // Finalizar arrastar
    function dragEnd() {
      if (!state.isDragging) return;

      cancelAnimationFrame(state.animationID);

      state.isDragging = false;
      slider.style.cursor = "grab";
      slider.classList.remove("is-dragging");

      // Calcular distância e velocidade do arrasto
      const movedByDistance = state.currentTranslate - state.prevTranslate;
      const threshold = state.slideWidth * 0.2; // 20% da largura do slide para threshold
      const isSignificantMovement = Math.abs(movedByDistance) > threshold;
      const isHighVelocity = Math.abs(state.dragVelocity) > 0.5;

      // Determinar direção e quantidade de slides para mover
      let direction = 0;
      if (isSignificantMovement || isHighVelocity) {
        direction = movedByDistance > 0 ? -1 : 1;

        // Calcular quantos slides mover baseado na velocidade
        let slidesToMove = 1;
        if (Math.abs(state.dragVelocity) > 1) {
          slidesToMove = Math.min(3, Math.floor(Math.abs(state.dragVelocity)));
        }

        goToSlide(state.currentIndex + direction * slidesToMove);
      } else {
        // Não moveu o suficiente, voltar à posição original
        goToSlide(state.currentIndex, { force: true });
      }

      // Emitir evento 'dragged' (similar ao 'dragged' do Splide.js)
      events.emit("dragged", direction);
    }

    // Obter posição X do evento (mouse ou toque)
    function getPositionX(e) {
      return e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    }

    // Manipular eventos de teclado
    function handleKeydown(e) {
      // Só processa se o slider estiver em foco
      if (
        document.activeElement === sliderContainer ||
        sliderContainer.contains(document.activeElement) ||
        document.activeElement === document.body
      ) {
        if (e.key === "ArrowLeft") {
          prevButton.classList.add("is-active");
          setTimeout(() => prevButton.classList.remove("is-active"), 200);
          goToSlide(state.currentIndex - config.perMove);
          e.preventDefault();
        } else if (e.key === "ArrowRight") {
          nextButton.classList.add("is-active");
          setTimeout(() => nextButton.classList.remove("is-active"), 200);
          goToSlide(state.currentIndex + config.perMove);
          e.preventDefault();
        }
      }
    }

    // Manipular redimensionamento da janela
    function handleResize() {
      calculateSlidesSize();

      // Manter o slide atual visível após redimensionamento
      goToSlide(state.currentIndex, { waitForTransition: false, force: true });
    }

    // Pausar vídeo quando não está visível
    function setupVideoEvents() {
      slides.forEach((slide, index) => {
        const iframe = slide.querySelector("iframe");
        if (!iframe) return;

        // Pausar vídeo quando o slide fica oculto
        events.on("hidden", (hiddenSlide) => {
          if (hiddenSlide === slide) {
            // Recarregar iframe para pausar o vídeo
            const src = iframe.src;
            iframe.src = src;
          }
        });

        // Pausar todos os vídeos quando a página fica oculta
        events.on("hidden:page", () => {
          const src = iframe.src;
          iframe.src = src;
        });
      });
    }

    // Inicializar slider
    function init() {
      calculateSlidesSize();
      setupEvents();
      setupVideoEvents();
      goToSlide(config.startIndex, { force: true });

      // Tornar o container focável para navegação por teclado
      sliderContainer.setAttribute("tabindex", "0");

      // Emitir evento 'mounted' (similar ao 'mounted' do Splide.js)
      events.emit("mounted");

      // Depois de tudo carregado, emitir evento 'ready' (similar ao 'ready' do Splide.js)
      setTimeout(() => {
        events.emit("ready");
      }, 100);
    }

    // Iniciar o slider
    init();
  }

  // Inicializar o slider de vídeos após o carregamento do DOM
  initVideoSlider();
});
