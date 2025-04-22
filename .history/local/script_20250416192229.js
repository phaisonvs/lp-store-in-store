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
