/**
 * @description Script principal otimizado para performance da página "Seja um Franqueado"
 * @author Dev ABC da Construção
 */
document.addEventListener("DOMContentLoaded", () => {
  // Restaurar visibilidade dos elementos
  const elementsToShow = document.querySelectorAll(
    ".animate-on-scroll, .container-prova-social-1, .section-the-news, .nossas-guides-container, .carousel"
  );

  elementsToShow.forEach((element) => {
    if (element) {
      element.style.opacity = "1";
      element.style.transform = "none";
      element.classList.add("is-visible");
    }
  });

  // Configurar apenas funcionalidades essenciais do carrossel
  setupVideoCarouselControls();
});

/**
 * @description Configura os controles do carrossel de vídeos - versão simplificada
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

  // Função para calcular o scroll amount baseado no viewport
  const getScrollAmount = () => {
    const card = carousel.querySelector(".card-prova-social");
    if (!card) return 0;
    const computedStyle = window.getComputedStyle(carousel);
    const gap = parseInt(computedStyle.gap) || 16;
    return card.offsetWidth + gap;
  };

  // Eventos de navegação simplificados
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
  updateArrowsVisibility();

  // Implementação de lazy loading para vídeos
  setupLazyVideos(carousel);
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

// Gerenciamento de vídeos
function initializeVideoPlayers() {
  const videoWrappers = document.querySelectorAll(".video-wrapper");

  videoWrappers.forEach((wrapper) => {
    const thumbnail = wrapper.querySelector(".video-thumbnail");
    const placeholder = wrapper.querySelector(".video-placeholder");
    const videoId = placeholder.dataset.videoId;

    // Pré-carregamento de thumbnail
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const img = new Image();
      img.src = thumbnailUrl;
      img.onload = () => {
        thumbnail.style.backgroundImage = `url(${thumbnailUrl})`;
      };
    }

    // Carregamento do vídeo sob demanda
    thumbnail.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;

      placeholder.innerHTML = "";
      placeholder.appendChild(iframe);
      placeholder.classList.add("active");
      thumbnail.style.opacity = "0";

      // Limpeza de memória
      setTimeout(() => {
        thumbnail.style.display = "none";
      }, 300);
    });
  });
}

// Lazy Loading de imagens
function initializeLazyLoading() {
  const lazyElements = document.querySelectorAll(".lazy-load");

  const lazyLoadObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;

          if (element.tagName === "IMG") {
            const src = element.dataset.src;
            if (src) {
              element.src = src;
              element.removeAttribute("data-src");
            }
          }

          element.classList.add("loaded");
          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: "50px",
      threshold: 0.1,
    }
  );

  lazyElements.forEach((element) => {
    lazyLoadObserver.observe(element);
  });
}

// Otimização de animações
function initializeAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add("is-visible");
          });
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.15,
    }
  );

  animatedElements.forEach((element) => {
    animationObserver.observe(element);
  });
}

// Otimização de performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Gerenciamento de recursos
window.addEventListener("load", () => {
  // Descarrega recursos não utilizados
  if ("connection" in navigator) {
    if (navigator.connection.saveData) {
      document.querySelectorAll("img[data-src]").forEach((img) => {
        if (!img.classList.contains("loaded")) {
          img.setAttribute("loading", "lazy");
        }
      });
    }
  }
});

// Otimização de scroll
const optimizeScroll = debounce(() => {
  document.querySelectorAll(".video-wrapper").forEach((wrapper) => {
    const rect = wrapper.getBoundingClientRect();
    const buffer = window.innerHeight * 2;

    if (Math.abs(rect.top) > buffer) {
      const placeholder = wrapper.querySelector(".video-placeholder.active");
      if (placeholder) {
        placeholder.innerHTML = "";
        placeholder.classList.remove("active");
        const thumbnail = wrapper.querySelector(".video-thumbnail");
        thumbnail.style.display = "flex";
        thumbnail.style.opacity = "1";
      }
    }
  });
}, 150);

window.addEventListener("scroll", optimizeScroll, { passive: true });
