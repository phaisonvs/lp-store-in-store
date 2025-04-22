document.addEventListener("DOMContentLoaded", function () {
  // Variáveis globais
  let scrollSpeed = 1;
  let currentTranslate = 0;
  let animationId = null;
  let isDragging = false;
  let startPosition = 0;
  let prevTranslate = 0;
  let cardWidth = 0;
  let cloneCount = 0;
  let isListenersRegistered = false;

  // Variável para armazenar a referência à função de atualização de zoom
  let updateZoom;

  // Efeito de zoom no background conforme o scroll
  function setupParallaxZoomEffect() {
    const section = document.querySelector(".seja-um-franqueado");
    if (!section) return;

    // Valores de configuração do efeito - mais suaves e profissionais
    const minZoom = 100; // Tamanho inicial (%)
    const maxZoom = 110; // Tamanho máximo (%)

    // Configuração de timing do efeito
    section.style.backgroundSize = `${minZoom}%`;
    section.style.transition = "background-size 0.05s linear";

    // Calcular uma janela de scroll maior para um efeito mais gradual
    const scrollRangeFactor = 1.5; // Fator para determinar o intervalo de scroll

    // Função de easing cúbica para suavizar a transição
    function easeOutCubic(x) {
      return 1 - Math.pow(1 - x, 3);
    }

    // Função de atualização de zoom otimizada
    updateZoom = function () {
      // Obtém a posição atual do scroll
      const scrollY = window.scrollY;

      // Posição da seção
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + sectionRect.top;
      const sectionHeight = sectionRect.height;

      // Calcular a janela de visibilidade
      const windowHeight = window.innerHeight;
      const scrollStart = sectionTop - windowHeight;
      const scrollEnd = sectionTop + sectionHeight;

      // Calcular o intervalo de scroll para o efeito
      const scrollRange = (sectionHeight + windowHeight) * scrollRangeFactor;

      // Verificar se a seção está visível na janela
      if (scrollY >= scrollStart && scrollY <= scrollEnd) {
        // Normalizar o progresso do scroll (0-1)
        let scrollProgress = Math.min(
          1,
          Math.max(0, (scrollY - scrollStart) / scrollRange)
        );

        // Aplicar a função de easing para uma transição mais suave
        scrollProgress = easeOutCubic(scrollProgress);

        // Calcular o valor de zoom com base no progresso
        const zoomValue = minZoom + (maxZoom - minZoom) * scrollProgress;

        // Aplicar o zoom com requestAnimationFrame para otimização
        requestAnimationFrame(() => {
          section.style.backgroundSize = `${zoomValue}%`;
        });
      }
    };

    // Usar passive: true para melhor performance no scroll
    window.addEventListener("scroll", updateZoom, { passive: true });

    // Executar uma vez para definir o estado inicial
    updateZoom();
  }

  // Função para alternar entre os diferentes estilos de visualização do background
  function setupBackgroundToggle() {
    // Adicionando botões para alternar entre os estilos
    const section = document.querySelector(".seja-um-franqueado");
    if (section) {
      const toggleContainer = document.createElement("div");
      toggleContainer.className = "bg-toggle-container";
      toggleContainer.style.cssText =
        "position: absolute; top: 10px; right: 10px; z-index: 10; display: flex; gap: 5px;";

      const styles = [
        { name: "contain", label: "Visualização Completa" },
        { name: "expanded", label: "Visualização Ampliada" },
        { name: "proportional", label: "Visualização Proporcional" },
        { name: "zoom-active", label: "Efeito de Zoom", isZoom: true },
      ];

      let zoomActive = false; // Por padrão, o zoom não estará ativo

      styles.forEach((style) => {
        const button = document.createElement("button");
        button.textContent = style.label;
        button.style.cssText =
          "padding: 5px 10px; background: rgba(0,0,0,0.7); color: white; border: 1px solid #fff; cursor: pointer; font-size: 12px;";

        // Se for o botão de zoom, verificar se deve ser marcado como ativo
        if (style.isZoom) {
          button.style.backgroundColor = zoomActive
            ? "rgba(0,150,0,0.7)"
            : "rgba(0,0,0,0.7)";
        }

        button.addEventListener("click", () => {
          // Se for o botão de zoom
          if (style.isZoom) {
            zoomActive = !zoomActive;
            button.style.backgroundColor = zoomActive
              ? "rgba(0,150,0,0.7)"
              : "rgba(0,0,0,0.7)";

            // Desativar/reativar o efeito de zoom
            if (zoomActive) {
              // Remover qualquer classe de estilo que possa interferir
              section.classList.remove(
                "bg-contain",
                "bg-expanded",
                "bg-proportional"
              );

              // Inicializar o efeito de zoom
              setupParallaxZoomEffect();
            } else {
              // Remover evento de scroll e redefinir tamanho
              window.removeEventListener("scroll", updateZoom);
              section.style.backgroundSize = "100%";
            }
            return;
          }

          // Para outros botões, remover todas as classes de estilo
          section.classList.remove(
            "bg-contain",
            "bg-expanded",
            "bg-proportional"
          );

          // Adicionar a classe selecionada
          section.classList.add(`bg-${style.name}`);

          // Desativar o zoom ao escolher outro estilo
          if (zoomActive) {
            zoomActive = false;
            const zoomButton = Array.from(toggleContainer.children).find(
              (b) => b.textContent === "Efeito de Zoom"
            );
            if (zoomButton) {
              zoomButton.style.backgroundColor = "rgba(0,0,0,0.7)";
            }

            // Remover evento de scroll
            window.removeEventListener("scroll", updateZoom);

            // Redefinir o tamanho do background
            section.style.backgroundSize = "";
          }
        });

        toggleContainer.appendChild(button);
      });

      section.appendChild(toggleContainer);
    }
  }

  function init() {
    if (isListenersRegistered) return;
    isListenersRegistered = true;

    // Adicionar controles de visualização do background
    setupBackgroundToggle();

    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");

    if (!carousel || !track) {
      console.error("Elementos do carrossel não encontrados.");
      return;
    }

    const cards = Array.from(track.children);
    if (cards.length === 0) {
      console.error("Nenhum cartão encontrado no carrossel.");
      return;
    }

    cardWidth = cards[0].getBoundingClientRect().width;
    const visibleCardsCount = Math.ceil(carousel.offsetWidth / cardWidth);
    cloneCount = visibleCardsCount * 2;

    cloneCards(cards, track);
    startContinuousAnimation(track);
    setupEventListeners(carousel, track);
    addArrowScrollSupport();
    updateExperienceYears();
  }

  function cloneCards(cards, track) {
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

    currentTranslate = -cardWidth * cloneCount;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function startContinuousAnimation(track) {
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(() => animate(track));
  }

  function animate(track) {
    const totalCards = track.children.length;
    const maxTranslate = -cardWidth * (totalCards - cloneCount);
    const resetTranslate = -cardWidth * cloneCount;

    if (!isDragging) {
      currentTranslate -= scrollSpeed;
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    if (currentTranslate <= maxTranslate) {
      currentTranslate = resetTranslate;
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    if (currentTranslate >= 0) {
      currentTranslate = maxTranslate;
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    animationId = requestAnimationFrame(() => animate(track));
  }

  function setupEventListeners(carousel, track) {
    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startPosition = e.pageX;
      prevTranslate = currentTranslate;
      cancelAnimationFrame(animationId);
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const delta = e.pageX - startPosition;

      if (Math.abs(delta) > cardWidth * cloneCount) return;

      currentTranslate = prevTranslate + delta;
      track.style.transform = `translateX(${currentTranslate}px)`;
    });

    carousel.addEventListener("mouseup", () => handleDragEnd(track));
    carousel.addEventListener("mouseleave", () => handleDragEnd(track));

    carousel.addEventListener("touchstart", (e) => {
      isDragging = true;
      startPosition = e.touches[0].clientX;
      prevTranslate = currentTranslate;
      cancelAnimationFrame(animationId);
    });

    carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - startPosition;

      if (Math.abs(delta) > cardWidth * cloneCount) return;

      currentTranslate = prevTranslate + delta;
      track.style.transform = `translateX(${currentTranslate}px)`;
    });

    carousel.addEventListener("touchend", () => handleDragEnd(track));
    carousel.addEventListener("touchcancel", () => handleDragEnd(track));

    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    carousel.addEventListener("mouseenter", () => {
      scrollSpeed /= 2;
    });

    carousel.addEventListener("mouseleave", () => {
      scrollSpeed *= 2;
    });
  }

  function handleDragEnd(track) {
    if (isDragging) {
      isDragging = false;
      startContinuousAnimation(track);
    }
  }

  // Carrossel de vídeos
  function addArrowScrollSupport() {
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

  // Lógica para calcular a idade da ABC
  function updateExperienceYears() {
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

  // Inicializar quando o DOM estiver carregado
  init();

  // Limpar o animation frame quando a página for fechada
  window.addEventListener("beforeunload", () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
});
