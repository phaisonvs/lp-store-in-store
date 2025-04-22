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
    },
    videoCarousel: {
      isDragging: false,
      startPosition: 0,
      prevScrollLeft: 0,
      scrollAmount: 0,
      currentIndex: 0,
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

    // Forçar a exibição do carrossel de vídeos imediatamente
    const provaContainer = document.querySelector(".container-prova-social-1");
    if (provaContainer) {
      provaContainer.classList.add("is-visible");
      console.log("Forçando exibição do carrossel de vídeos");
    }

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
    setupGuideShopCarouselEventListeners(carousel, track);
  };

  /**
   * @description Inicia a animação contínua do carrossel - otimizada
   * @param {HTMLElement} track - Container dos cartões
   */
  const startContinuousAnimation = (track) => {
    if (state.guideShopCarousel.animationId) {
      cancelAnimationFrame(state.guideShopCarousel.animationId);
    }
    animate(track);
  };

  /**
   * @description Função de animação do carrossel - otimizada com melhor gerenciamento de recursos
   * @param {HTMLElement} track - Container dos cartões
   */
  const animate = (track) => {
    // Verifica se o elemento ainda existe (evita erros se o elemento for removido)
    if (!track || !document.body.contains(track)) return;

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
   */
  const setupGuideShopCarouselEventListeners = (carousel, track) => {
    const prevButton = carousel.querySelector(".guide-shop-prev");
    const nextButton = carousel.querySelector(".guide-shop-next");

    // Otimizado para melhor performance de arrastar
    const pointerStart = (e) => {
      if (state.guideShopCarousel.isDragging) return; // Previne múltiplos inicios

      state.guideShopCarousel.isDragging = true;
      state.guideShopCarousel.startPosition =
        e.pageX || (e.touches && e.touches[0].pageX) || 0;
      state.guideShopCarousel.prevTranslate =
        state.guideShopCarousel.currentTranslate;

      // Cancela a animação durante o arrasto
      cancelAnimationFrame(state.guideShopCarousel.animationId);

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
        cancelAnimationFrame(state.guideShopCarousel.animationId);
        state.guideShopCarousel.currentTranslate +=
          state.guideShopCarousel.cardWidth;

        // Usar requestAnimationFrame para sincronizar com o próximo frame
        requestAnimationFrame(() => {
          track.style.transition = "transform 0.5s var(--ease-out-smooth)";
          track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
        });
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        cancelAnimationFrame(state.guideShopCarousel.animationId);
        state.guideShopCarousel.currentTranslate -=
          state.guideShopCarousel.cardWidth;

        requestAnimationFrame(() => {
          track.style.transition = "transform 0.5s var(--ease-out-smooth)";
          track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
        });
      });
    }

    // Otimização: Pausar animação quando a página não está visível
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(state.guideShopCarousel.animationId);
      } else {
        // Reiniciar animação quando página volta a ficar visível
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
        startContinuousAnimation(track);
      }, 400); // Tempo alinhado com a duração da transição
    });
  };

  /**
   * @description Configura o carrossel de vídeos com controles e funcionalidade de arrastar
   */
  const setupVideoCarouselControls = () => {
    const container = document.querySelector(".container-prova-social-1");
    const carousel = document.querySelector(".carrossel-prova-social-1");
    const prevButton = document.querySelector(
      ".container-seta-esquerda.video-prev"
    );
    const nextButton = document.querySelector(
      ".container-seta-direita.video-next"
    );

    if (!carousel || !prevButton || !nextButton) {
      console.log("Elementos do carrossel de vídeos não encontrados:", {
        carousel: !!carousel,
        prevButton: !!prevButton,
        nextButton: !!nextButton,
      });
      return;
    }

    console.log("Carrossel de vídeos inicializado com sucesso");
    const videos = carousel.querySelectorAll(".card-prova-social");
    console.log("Vídeos encontrados:", videos.length);

    if (videos.length === 0) return;

    // Calcular precisamente o tamanho do card incluindo margem
    const cardWidth = videos[0].offsetWidth;
    const cardStyle = window.getComputedStyle(videos[0]);
    const cardMarginRight = parseInt(cardStyle.marginRight) || 20; // Usa 20px como fallback

    // Tamanho exato para mover um card por vez
    const scrollAmount = cardWidth + cardMarginRight;
    state.videoCarousel.scrollAmount = scrollAmount;
    console.log("Largura exata para navegação:", scrollAmount);

    // Definir o índice atual
    let currentIndex = 0;
    const maxIndex = videos.length - 1;

    // Adicionar classe para indicar que o carrossel está pronto
    container.classList.add("is-visible");
    console.log("Forçando exibição do carrossel de vídeos");

    // Função para navegar por índice
    const navigateToIndex = (index) => {
      // Garantir que o índice esteja dentro dos limites
      if (index < 0) index = 0;
      if (index > maxIndex) index = maxIndex;

      state.videoCarousel.currentIndex = index;
      const scrollPos = index * scrollAmount;

      // Usar a mesma transição suave do carrossel de franquias
      carousel.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    };

    // Eventos de navegação para as setas
    prevButton.addEventListener("click", () => {
      console.log("Navegando para o vídeo anterior");
      navigateToIndex(state.videoCarousel.currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
      console.log("Navegando para o próximo vídeo");
      navigateToIndex(state.videoCarousel.currentIndex + 1);
    });

    // Implementar funcionalidade de arrastar (drag) como no carrossel de franquias
    const pointerStart = (e) => {
      if (state.videoCarousel.isDragging) return;

      state.videoCarousel.isDragging = true;
      state.videoCarousel.startPosition =
        e.pageX || (e.touches && e.touches[0].pageX) || 0;
      state.videoCarousel.prevScrollLeft = carousel.scrollLeft;

      // Mudar o cursor durante o arrasto
      container.style.cursor = "grabbing";
      carousel.style.scrollBehavior = "auto";
    };

    const pointerMove = (e) => {
      if (!state.videoCarousel.isDragging) return;

      const currentPosition = e.pageX || (e.touches && e.touches[0].pageX) || 0;
      const diff = currentPosition - state.videoCarousel.startPosition;

      // Aplicar o movimento com um fator de resistência
      carousel.scrollLeft = state.videoCarousel.prevScrollLeft - diff;

      // Prevenir o comportamento de scroll padrão para melhor experiência
      e.preventDefault();
    };

    const pointerEnd = () => {
      if (!state.videoCarousel.isDragging) return;

      // Resetar o estado de arrastar
      state.videoCarousel.isDragging = false;
      container.style.cursor = "grab";
      carousel.style.scrollBehavior = "smooth";

      // Calcular para qual cartão deve navegar baseado na posição atual
      const currentScrollPos = carousel.scrollLeft;
      const newIndex = Math.round(
        currentScrollPos / state.videoCarousel.scrollAmount
      );

      // Navegar ao índice correto
      navigateToIndex(newIndex);
    };

    // Adicionar os event listeners para arrastar
    carousel.addEventListener("mousedown", pointerStart);
    carousel.addEventListener("touchstart", pointerStart, { passive: true });

    window.addEventListener("mousemove", pointerMove);
    window.addEventListener("touchmove", pointerMove, { passive: false });

    window.addEventListener("mouseup", pointerEnd);
    window.addEventListener("touchend", pointerEnd);

    // Atualizar índice durante scroll
    carousel.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(() => {
          const scrollPos = carousel.scrollLeft;
          state.videoCarousel.currentIndex = Math.round(
            scrollPos / state.videoCarousel.scrollAmount
          );
        });
      },
      { passive: true }
    );
  };

  /**
   * @description Configura lazy loading para vídeos - função desativada temporariamente
   * @param {HTMLElement} container - Contêiner dos vídeos
   */
  const setupLazyVideos = (container) => {
    // Função desativada temporariamente para permitir que os vídeos sejam carregados normalmente
    // Mantida apenas para referência
    console.log("Lazy loading de vídeos está desativado");
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
   * @description Inicializa todos os componentes
   */
  const init = () => {
    // Inicializar carrossel de vídeos imediatamente para garantir visibilidade
    setupVideoCarouselControls();

    // Depois inicializar os demais componentes
    setupScrollAnimations();
    setupParallax();
    initGuideShopCarousel();
    updateExperienceYears();
  };

  // Inicializar tudo no DOMContentLoaded
  init();
});
