document.addEventListener("DOMContentLoaded", function () {
  // Variáveis globais para o parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let isListenersRegistered = false;

  // Variáveis para o carrossel
  let cardWidth = 0;
  let cloneCount = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let startPosition = 0;
  let isDragging = false;
  let animationId = null;
  let scrollSpeed = 1;

  // Configurações do parallax
  const parallaxSettings = {
    strength: 0.05,
    perspectiveValue: 1000,
    easingFactor: 0.1,
  };

  // Função para interpolação linear
  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  // Verifica se um elemento está visível na viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top <= windowHeight &&
      rect.bottom >= 0 &&
      rect.left <= windowWidth &&
      rect.right >= 0
    );
  }

  // Configura o efeito de parallax
  function setupParallaxEffect() {
    // Selecionar todas as seções com parallax
    const parallaxSections = document.querySelectorAll(".parallax-section");

    if (parallaxSections.length === 0) {
      console.warn("Nenhuma seção com parallax encontrada.");
      return;
    }

    // Configurar cada seção com parallax
    parallaxSections.forEach((section) => {
      const parallaxBg = section.querySelector(".parallax-bg");
      if (!parallaxBg) return;

      // Definir CSS inicial para o elemento de fundo
      parallaxBg.style.transitionProperty = "transform";
      parallaxBg.style.transitionDuration = "0.1s";
      parallaxBg.style.transitionTimingFunction = "ease-out";
      parallaxBg.style.willChange = "transform";
      parallaxBg.style.transformStyle = "preserve-3d";
    });

    // Função para atualizar o efeito parallax no scroll
    function updateParallaxOnScroll() {
      parallaxSections.forEach((section) => {
        const parallaxBg = section.querySelector(".parallax-bg");
        if (!parallaxBg || !isElementInViewport(section)) return;

        const rect = section.getBoundingClientRect();
        const scrollY = -rect.top * parallaxSettings.strength;
        parallaxBg.style.transform = `translate3d(0, ${scrollY}px, 0)`;
      });
    }

    // Função para atualizar o efeito parallax com o movimento do mouse
    function updateParallaxOnMouseMove() {
      targetX = mouseX * parallaxSettings.strength;
      targetY = mouseY * parallaxSettings.strength;

      // Atualizar valores atuais com suavização
      parallaxSections.forEach((section) => {
        if (!isElementInViewport(section)) return;

        const parallaxBg = section.querySelector(".parallax-bg");
        if (!parallaxBg) return;

        // Para cada seção visível, calcular valor de transformação baseado na posição atual do mouse
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const sectionRect = section.getBoundingClientRect();

        // Cálculo de parallax relativo à posição da seção na tela
        const sectionCenterX = sectionRect.left + sectionRect.width / 2;
        const sectionCenterY = sectionRect.top + sectionRect.height / 2;
        const offsetX = ((mouseX - sectionCenterX) / viewportWidth) * 20;
        const offsetY = ((mouseY - sectionCenterY) / viewportHeight) * 20;

        // Aplicar transformação com perspective para dar profundidade
        parallaxBg.style.transform = `perspective(${parallaxSettings.perspectiveValue}px) 
                                     translate3d(${offsetX}px, ${offsetY}px, 0)`;
      });

      requestAnimationFrame(updateParallaxOnMouseMove);
    }

    // Registrar eventos para o efeito parallax
    window.addEventListener("scroll", updateParallaxOnScroll, {
      passive: true,
    });

    // Adicionar evento de rastreamento de mouse para mover o fundo
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    });

    // Iniciar animação contínua para movimento suave do mouse
    updateParallaxOnMouseMove();
  }

  // Configurar botões para alternar estilos do fundo
  function setupBackgroundToggle() {
    const sections = document.querySelectorAll(".parallax-section");
    if (sections.length === 0) return;

    for (const section of sections) {
      const toggleContainer = document.createElement("div");
      toggleContainer.className = "background-toggle";
      toggleContainer.style.cssText =
        "position: absolute; top: 10px; right: 10px; z-index: 10; display: flex; gap: 5px;";

      const styles = [
        { name: "contain", label: "Visualização Completa" },
        { name: "expanded", label: "Visualização Ampliada" },
        { name: "proportional", label: "Visualização Proporcional" },
      ];

      styles.forEach((style) => {
        const button = document.createElement("button");
        button.textContent = style.label;
        button.style.cssText =
          "padding: 5px 10px; background: rgba(0,0,0,0.7); color: white; border: 1px solid #fff; cursor: pointer; font-size: 12px;";
        button.addEventListener("click", () => {
          // Remover todas as classes de estilo
          section.classList.remove(
            "bg-contain",
            "bg-expanded",
            "bg-proportional"
          );
          // Adicionar a classe selecionada
          section.classList.add(`bg-${style.name}`);
        });
        toggleContainer.appendChild(button);
      });

      section.appendChild(toggleContainer);
    }
  }

  // Inicialização principal
  function init() {
    if (isListenersRegistered) return;
    isListenersRegistered = true;

    // Inicializar o efeito parallax avançado baseado em scroll
    setupParallaxEffect();

    // Adicionar controles de visualização do background
    setupBackgroundToggle();

    // Inicializar o carrossel
    initCarousel();

    // Inicializar o carrossel de vídeos
    addArrowScrollSupport();

    // Atualizar a contagem de anos de experiência
    updateExperienceYears();
  }

  // Inicializar carrossel principal
  function initCarousel() {
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
  }

  // Clonar cartões para criar um efeito de carrossel infinito
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

  // Iniciar animação contínua do carrossel
  function startContinuousAnimation(track) {
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(() => animate(track));
  }

  // Animar o carrossel
  function animate(track) {
    const totalCards = track.children.length;
    const maxTranslate = -cardWidth * (totalCards - cloneCount);
    const resetTranslate = -cardWidth * cloneCount;

    if (!isDragging) {
      currentTranslate -= scrollSpeed;
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Reposicionar o carrossel para criar efeito infinito
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

  // Configurar eventos de interação com o carrossel
  function setupEventListeners(carousel, track) {
    // Eventos de mouse
    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startPosition = e.pageX;
      prevTranslate = currentTranslate;
      cancelAnimationFrame(animationId);
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const delta = e.pageX - startPosition;

      // Limitar deslocamento para evitar problemas
      if (Math.abs(delta) > cardWidth * cloneCount) return;

      currentTranslate = prevTranslate + delta;
      track.style.transform = `translateX(${currentTranslate}px)`;
    });

    carousel.addEventListener("mouseup", () => handleDragEnd(track));
    carousel.addEventListener("mouseleave", () => handleDragEnd(track));

    // Eventos de toque para dispositivos móveis
    carousel.addEventListener("touchstart", (e) => {
      isDragging = true;
      startPosition = e.touches[0].clientX;
      prevTranslate = currentTranslate;
      cancelAnimationFrame(animationId);
    });

    carousel.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - startPosition;

      // Limitar deslocamento para evitar problemas
      if (Math.abs(delta) > cardWidth * cloneCount) return;

      currentTranslate = prevTranslate + delta;
      track.style.transform = `translateX(${currentTranslate}px)`;
    });

    carousel.addEventListener("touchend", () => handleDragEnd(track));
    carousel.addEventListener("touchcancel", () => handleDragEnd(track));

    // Evitar comportamento padrão de arrastar
    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    // Ajustar velocidade quando o mouse está sobre o carrossel
    carousel.addEventListener("mouseenter", () => {
      scrollSpeed /= 2;
    });

    carousel.addEventListener("mouseleave", () => {
      scrollSpeed *= 2;
    });
  }

  // Finalizar arrasto e retomar animação
  function handleDragEnd(track) {
    if (isDragging) {
      isDragging = false;
      startContinuousAnimation(track);
    }
  }

  // Carrossel de vídeos com suporte a setas
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

  // Atualizar a contagem de anos de experiência
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
