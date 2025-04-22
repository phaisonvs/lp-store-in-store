/**
 * @description Script principal da página "Seja um Franqueado"
 * @author Dev ABC da Construção
 */
document.addEventListener("DOMContentLoaded", () => {
  // Estado global simplificado
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
  };

  /**
   * @description Inicializa o carrossel de Guide Shops
   */
  const initGuideShopCarousel = () => {
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");

    if (!carousel || !track) return;

    // Garantir que o carrossel esteja visível
    carousel.style.opacity = "1";
    carousel.style.visibility = "visible";
    carousel.style.transform = "none";

    // Propriedades CSS para melhorar desempenho touch/drag
    carousel.style.touchAction = "pan-y";
    carousel.style.cursor = "grab";

    const cards = track.querySelectorAll(".carousel__card");
    if (cards.length === 0) return;

    // Clone cards para criar um efeito de loop contínuo
    const cardWidth = cards[0].offsetWidth;
    state.guideShopCarousel.cardWidth = cardWidth;

    // Clone apenas o necessário para loop contínuo
    const cardsToClone = Array.from(cards).slice(0, Math.min(4, cards.length));
    state.guideShopCarousel.cloneCount = cardsToClone.length;

    // Criar todos os clones em um único fragment para melhor performance
    const fragment = document.createDocumentFragment();
    cardsToClone.forEach((card) => {
      const clone = card.cloneNode(true);
      fragment.appendChild(clone);
    });
    track.appendChild(fragment);

    // Configurar listeners de eventos
    setupGuideShopCarouselEventListeners(carousel, track);
  };

  /**
   * @description Configura os eventos do carrossel
   * @param {HTMLElement} carousel - Container do carrossel
   * @param {HTMLElement} track - Container dos cartões
   */
  const setupGuideShopCarouselEventListeners = (carousel, track) => {
    const prevButton = carousel.querySelector(".guide-shop-prev");
    const nextButton = carousel.querySelector(".guide-shop-next");

    // Feedback visual para botões
    if (prevButton) {
      prevButton.addEventListener("mouseenter", () => {
        prevButton.style.transform = "scale(1.1)";
        prevButton.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
      });

      prevButton.addEventListener("mouseleave", () => {
        prevButton.style.transform = "scale(1)";
        prevButton.style.boxShadow = "none";
      });

      prevButton.addEventListener("touchstart", () => {
        prevButton.style.transform = "scale(1.1)";
        prevButton.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
      });
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

      nextButton.addEventListener("touchstart", () => {
        nextButton.style.transform = "scale(1.1)";
        nextButton.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
      });
    }
  };

  // Garantir que todos os elementos animados estejam visíveis por padrão
  const elementsToShow = [
    ".animate-on-scroll",
    ".container-prova-social-1",
    ".section-the-news",
    ".nossas-guides-container",
    ".carousel",
    "[data-aos]", // Elementos com animação AOS
    ".fade-in", // Classes comuns de animação
    ".slide-in",
    ".animate",
  ];

  document.querySelectorAll(elementsToShow.join(", ")).forEach((element) => {
    // Remover classes de animação
    element.classList.remove("animate-on-scroll");
    element.classList.remove("aos-animate");
    element.removeAttribute("data-aos");

    // Garantir visibilidade
    element.style.opacity = "1";
    element.style.visibility = "visible";
    element.style.transform = "none";
    element.style.transition = "none";
    element.classList.add("is-visible");
  });

  // Inicializar apenas o carrossel
  initGuideShopCarousel();
});
