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
      isTransitioning: false, // Novo estado para controlar transições
      autoplayPaused: false, // Novo estado para controlar autoplay
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
  };

  /**
   * @description Configura o IntersectionObserver para animar elementos ao entrarem no viewport - otimizado
   */
  const setupScrollAnimations = () => {
    if (state.animations.initialized) return;

    // Criar um IntersectionObserver eficiente
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Reduzido para disparar um pouco antes, melhorando percepção de velocidade
    };

    // Usa um único observer para todos os elementos, reduzindo overhead
    state.animations.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Aplicar classe apenas quando necessário
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          // Parar de observar após o elemento ser animado para melhorar performance
          // Apenas para elementos que só precisam ser animados uma vez
          // Comentado por padrão - descomentar para casos específicos
          // state.animations.observer.unobserve(entry.target);
        } else {
          // Opcional: Remover a classe quando o elemento sai do viewport
          // Isso permite reanimar ao retornar à visão, mas pode ser removido para melhor performance
          entry.target.classList.remove("is-visible");
        }
      });
    }, observerOptions);

    // Adicionar classe necessária e observar elementos em uma única operação
    requestAnimationFrame(() => {
      document
        .querySelectorAll(state.animations.sections.join(", "))
        .forEach((element) => {
          element.classList.add("animate-on-scroll");
          state.animations.observer.observe(element);
        });
    });

    state.animations.initialized = true;
  };

  /**
   * @description Inicializa o parallax simples - otimizado para performance
   */
  const setupParallax = () => {
    const section = document.querySelector(".seja-um-franqueado");
    if (!section) return;

    // Remove os botões de controle se existirem
    const existingToggle = document.querySelector(".bg-toggle-container");
    if (existingToggle) existingToggle.remove();

    // Usa transform para melhor performance no parallax (usa GPU)
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const speed = 0.06; // Velocidade ainda mais suave, menos processamento

      // Usa transform para melhor performance (ativa aceleração GPU)
      const yPos = -scrollPosition * speed;
      section.style.backgroundPosition = `center ${yPos}px`;
    };

    // Throttling otimizado para scroll
    let ticking = false;
    let lastKnownScrollPosition = 0;

    window.addEventListener(
      "scroll",
      () => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
          window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    ); // Importante: passive true para performance

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

    // Propriedades CSS para melhorar desempenho touch/drag
    carousel.style.touchAction = "pan-y"; // Permitir scroll vertical padrão em touch
    carousel.style.cursor = "grab"; // Indicação visual de que é arrastável

    // Adicionar um indicador de controle de autoplay para melhor UX
    const autoplayControl = document.createElement("div");
    autoplayControl.className = "carousel-autoplay-control";
    autoplayControl.innerHTML = `
      <button class="autoplay-button" aria-label="Pausar carrossel">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
    `;
    carousel.appendChild(autoplayControl);

    // Aplicar will-change para avisar o browser sobre animações (usar com moderação)
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

    // Iniciar a animação otimizada
    startContinuousAnimation(track);

    // Configurar listeners de eventos otimizados
    setupGuideShopCarouselEventListeners(carousel, track, autoplayControl);
  };

  /**
   * @description Inicia a animação contínua do carrossel - otimizada
   * @param {HTMLElement} track - Container dos cartões
   */
  const startContinuousAnimation = (track) => {
    if (state.guideShopCarousel.animationId) {
      cancelAnimationFrame(state.guideShopCarousel.animationId);
    }

    // Não iniciar animação se autoplay estiver pausado
    if (!state.guideShopCarousel.autoplayPaused) {
      animate(track);
    }
  };

  /**
   * @description Função de animação do carrossel - otimizada com melhor gerenciamento de recursos
   * @param {HTMLElement} track - Container dos cartões
   */
  const animate = (track) => {
    // Verifica se o elemento ainda existe (evita erros se o elemento for removido)
    if (!track || !document.body.contains(track)) return;

    // Se estiver em transição ou autoplay pausado, não continuar a animação
    if (
      state.guideShopCarousel.isTransitioning ||
      state.guideShopCarousel.autoplayPaused
    ) {
      return;
    }

    const { currentTranslate, scrollSpeed, cardWidth } =
      state.guideShopCarousel;
    const cards = track.querySelectorAll(".carousel__card");

    // Calcula o limite para o reset de forma eficiente
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

    // Continua a animação apenas se o documento estiver visível (economiza recursos em abas inativas)
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
   * @param {HTMLElement} autoplayControl - Controle de autoplay
   */
  const setupGuideShopCarouselEventListeners = (
    carousel,
    track,
    autoplayControl
  ) => {
    const prevButton = carousel.querySelector(".guide-shop-prev");
    const nextButton = carousel.querySelector(".guide-shop-next");
    const autoplayButton = autoplayControl.querySelector(".autoplay-button");

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

    // Controle de autoplay
    if (autoplayButton) {
      autoplayButton.addEventListener("click", () => {
        state.guideShopCarousel.autoplayPaused =
          !state.guideShopCarousel.autoplayPaused;

        if (state.guideShopCarousel.autoplayPaused) {
          cancelAnimationFrame(state.guideShopCarousel.animationId);
          autoplayButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          `;
          autoplayButton.setAttribute("aria-label", "Reproduzir carrossel");
        } else {
          startContinuousAnimation(track);
          autoplayButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          `;
          autoplayButton.setAttribute("aria-label", "Pausar carrossel");
        }
      });
    }

    // Otimizado para melhor performance de arrastar
    const pointerStart = (e) => {
      if (state.guideShopCarousel.isDragging) return; // Previne múltiplos inicios

      // Pausar autoplay temporariamente durante arrastar
      cancelAnimationFrame(state.guideShopCarousel.animationId);

      state.guideShopCarousel.isDragging = true;
      state.guideShopCarousel.startPosition =
        e.pageX || (e.touches && e.touches[0].pageX) || 0;
      state.guideShopCarousel.prevTranslate =
        state.guideShopCarousel.currentTranslate;

      // Usar transform em vez de transition para melhor performance
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

    const pointerEnd = () => {
      if (!state.guideShopCarousel.isDragging) return;
      handleDragEnd(carousel, track);
    };

    // Eventos para desktop otimizados
    carousel.addEventListener("mousedown", pointerStart, { passive: true });
    window.addEventListener("mousemove", pointerMove, { passive: true });
    window.addEventListener("mouseup", pointerEnd, { passive: true });
    carousel.addEventListener("mouseleave", pointerEnd, { passive: true });

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

    window.addEventListener("touchend", pointerEnd, { passive: true });
    window.addEventListener("touchcancel", pointerEnd, { passive: true });

    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    // Otimização para botões de navegação
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (state.guideShopCarousel.isTransitioning) return;

        state.guideShopCarousel.isTransitioning = true;
        cancelAnimationFrame(state.guideShopCarousel.animationId);
        state.guideShopCarousel.currentTranslate +=
          state.guideShopCarousel.cardWidth;

        // Usar requestAnimationFrame para sincronizar com o próximo frame
        requestAnimationFrame(() => {
          track.style.transition = "transform 0.5s var(--ease-out-smooth)";
          track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;

          // Adicionar feedback visual ao botão
          prevButton.classList.add("active");

          // Remover feedback após transição
          setTimeout(() => {
            prevButton.classList.remove("active");
            state.guideShopCarousel.isTransitioning = false;

            // Retomar autoplay se não estiver pausado
            if (!state.guideShopCarousel.autoplayPaused) {
              startContinuousAnimation(track);
            }
          }, 500);
        });
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (state.guideShopCarousel.isTransitioning) return;

        state.guideShopCarousel.isTransitioning = true;
        cancelAnimationFrame(state.guideShopCarousel.animationId);
        state.guideShopCarousel.currentTranslate -=
          state.guideShopCarousel.cardWidth;

        requestAnimationFrame(() => {
          track.style.transition = "transform 0.5s var(--ease-out-smooth)";
          track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;

          // Adicionar feedback visual ao botão
          nextButton.classList.add("active");

          // Remover feedback após transição
          setTimeout(() => {
            nextButton.classList.remove("active");
            state.guideShopCarousel.isTransitioning = false;

            // Retomar autoplay se não estiver pausado
            if (!state.guideShopCarousel.autoplayPaused) {
              startContinuousAnimation(track);
            }
          }, 500);
        });
      });
    }

    // Otimização: Pausar animação quando a página não está visível
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(state.guideShopCarousel.animationId);
      } else if (!state.guideShopCarousel.autoplayPaused) {
        // Reiniciar animação quando página volta a ficar visível (se não estiver pausada)
        startContinuousAnimation(track);
      }
    });
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

        // Retomar autoplay apenas se não estiver pausado manualmente
        if (!state.guideShopCarousel.autoplayPaused) {
          startContinuousAnimation(track);
        }
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

    // Calcular scroll amount apenas uma vez
    const cardWidth =
      carousel.querySelector(".card-prova-social")?.offsetWidth || 0;
    const scrollAmount = cardWidth + 20; // largura + margem

    // Eventos de navegação otimizados
    prevButton.addEventListener("click", () => {
      // Feedback visual - botão ativo
      prevButton.classList.add("active");

      carousel.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });

      // Remover classe após transição
      setTimeout(() => {
        prevButton.classList.remove("active");
      }, 500);
    });

    nextButton.addEventListener("click", () => {
      // Feedback visual - botão ativo
      nextButton.classList.add("active");

      carousel.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Remover classe após transição
      setTimeout(() => {
        nextButton.classList.remove("active");
      }, 500);
    });

    // Adicionar suporte para arrastar com o mouse
    let isDragging = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener(
      "mousedown",
      (e) => {
        isDragging = true;
        carousel.style.cursor = "grabbing";
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        carousel.style.scrollBehavior = "auto";
      },
      { passive: true }
    );

    carousel.addEventListener(
      "mouseleave",
      () => {
        isDragging = false;
        carousel.style.cursor = "grab";
        carousel.style.scrollBehavior = "smooth";
      },
      { passive: true }
    );

    carousel.addEventListener(
      "mouseup",
      () => {
        isDragging = false;
        carousel.style.cursor = "grab";
        carousel.style.scrollBehavior = "smooth";
      },
      { passive: true }
    );

    carousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5; // Fator de velocidade
      carousel.scrollLeft = scrollLeft - walk;
    });
  };

  /**
   * @description Configura lazy loading para vídeos
   * @param {HTMLElement} container - Contêiner dos vídeos
   */
  const setupLazyVideos = (container) => {
    const videoFrames = container.querySelectorAll("iframe");

    // Lazy loading para iframes de vídeo
    videoFrames.forEach((iframe) => {
      // Substituir src por data-src para prevenir carregamento inicial
      const src = iframe.src;
      iframe.dataset.src = src;
      iframe.src = "about:blank"; // Substitui temporariamente por página vazia

      // Criar thumbnail para substituir o vídeo (opcional)
      // Esta parte pode ser implementada para criar thumbnails personalizadas

      // Marcar como "a ser carregado" quando visível
      iframe.classList.add("lazy-video");
    });

    // Observer para carregar vídeos somente quando visíveis
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target;
            if (iframe.classList.contains("lazy-video") && iframe.dataset.src) {
              iframe.src = iframe.dataset.src;
              iframe.classList.remove("lazy-video");
              // Parar de observar após carregamento
              videoObserver.unobserve(iframe);
            }
          }
        });
      },
      {
        rootMargin: "100px", // Pré-carrega um pouco antes de entrar no viewport
        threshold: 0.1,
      }
    );

    // Observar todos os vídeos
    videoFrames.forEach((iframe) => {
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
   * @description Inicializa todos os componentes de forma otimizada
   */
  const init = () => {
    // Usar requestIdleCallback (ou polyfill) para operações não críticas
    const runWhenIdle =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    // Inicializar componentes críticos para renderização primeiro
    setupScrollAnimations();
    updateExperienceYears();

    // Inicializar componentes menos críticos quando o browser estiver ocioso
    runWhenIdle(() => {
      setupParallax();
      initGuideShopCarousel();
      setupVideoCarouselControls();
    });
  };

  // Inicializar quando o DOM estiver carregado
  init();
});
