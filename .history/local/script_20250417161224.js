/**
 * @description Script principal otimizado para performance da página "Seja um Franqueado"
 * @author Dev ABC da Construção
 */
// Configuração inicial do estado global
const state = {
  guideShopCarousel: {
    cardWidth: 0,
    currentTranslate: 0,
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // Mostrar todos os elementos animados imediatamente
  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
    element.classList.add("is-visible");
  });

  // Mostrar seções específicas
  [
    ".container-prova-social-1",
    ".section-the-news",
    ".nossas-guides-container",
    ".carousel",
  ].forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = "1";
      element.style.transform = "none";
      element.classList.add("is-visible");
    }
  });

  // Configurar carrosséis
  setupGuideShopCarousel();
  setupVideoCarouselControls();
  updateExperienceYears();
});

// Configuração simplificada do carrossel de guide shop
const setupGuideShopCarousel = () => {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel__track");
  const cards = track.querySelectorAll(".carousel__card");

  if (!track || cards.length === 0) return;

  // Inicializar o cardWidth
  state.guideShopCarousel.cardWidth = cards[0].offsetWidth;

  // Adicionar botões de navegação se não existirem
  let prevButton = carousel.querySelector(".carousel__button--prev");
  let nextButton = carousel.querySelector(".carousel__button--next");

  if (!prevButton) {
    prevButton = document.createElement("button");
    prevButton.className = "carousel__button--prev";
    prevButton.innerHTML = "&#10094;"; // Seta para esquerda
    carousel.appendChild(prevButton);
  }

  if (!nextButton) {
    nextButton = document.createElement("button");
    nextButton.className = "carousel__button--next";
    nextButton.innerHTML = "&#10095;"; // Seta para direita
    carousel.appendChild(nextButton);
  }

  // Configurar navegação básica
  prevButton.addEventListener("click", () => {
    const scrollAmount = state.guideShopCarousel.cardWidth;
    track.style.transition = "transform 0.5s ease";
    state.guideShopCarousel.currentTranslate += scrollAmount;
    track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
  });

  nextButton.addEventListener("click", () => {
    const scrollAmount = state.guideShopCarousel.cardWidth;
    track.style.transition = "transform 0.5s ease";
    state.guideShopCarousel.currentTranslate -= scrollAmount;
    track.style.transform = `translateX(${state.guideShopCarousel.currentTranslate}px)`;
  });
};

// Configuração simplificada do carrossel de vídeos
const setupVideoCarouselControls = () => {
  const carousel = document.querySelector(".carrossel-prova-social-1");
  const prevButton = document.querySelector(
    ".container-prova-social-1 .container-seta-esquerda"
  );
  const nextButton = document.querySelector(
    ".container-prova-social-1 .container-seta-direita"
  );

  if (!carousel || !prevButton || !nextButton) return;

  // Configurar navegação básica
  const getScrollAmount = () => {
    const card = carousel.querySelector(".card-prova-social");
    if (!card) return 0;
    const computedStyle = window.getComputedStyle(carousel);
    const gap = parseInt(computedStyle.gap) || 16;
    return card.offsetWidth + gap;
  };

  prevButton.addEventListener("click", () => {
    const scrollAmount = getScrollAmount();
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  nextButton.addEventListener("click", () => {
    const scrollAmount = getScrollAmount();
    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  // Configurar lazy loading básico para vídeos
  setupLazyVideos(carousel);
};

// Lazy loading simplificado para vídeos
const setupLazyVideos = (container) => {
  const videoFrames = container.querySelectorAll("iframe");
  videoFrames.forEach((iframe) => {
    if (iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
      iframe.removeAttribute("data-src");
    }
  });
};

// Atualização dos anos de experiência
const updateExperienceYears = () => {
  const currentYear = new Date().getFullYear();
  const foundingYear = 2014;
  const yearsOfExperience = currentYear - foundingYear;

  document.querySelectorAll(".experience-years").forEach((el) => {
    el.textContent = `+${yearsOfExperience}`;
  });
};
