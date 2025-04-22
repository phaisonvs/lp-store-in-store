/**
 * @description Script principal otimizado para performance da página "Seja um Franqueado"
 * @author Dev ABC da Construção
 */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa elementos que antes eram animados como visíveis
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

  // Lazy loading para vídeos
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const wrapper = entry.target;
          const thumbnail = wrapper.querySelector(".video-thumbnail");
          const placeholder = wrapper.querySelector(".video-placeholder");

          if (thumbnail && placeholder) {
            thumbnail.style.display = "none";
            initVideoPlayer(placeholder);
            videoObserver.unobserve(wrapper);
          }
        }
      });
    },
    { rootMargin: "50px" }
  );

  document.querySelectorAll(".video-wrapper").forEach((wrapper) => {
    videoObserver.observe(wrapper);
  });
});

// Função para inicializar o player de vídeo
function initVideoPlayer(placeholder) {
  if (!placeholder.classList.contains("active")) {
    const videoId = placeholder.dataset.videoId;
    if (videoId) {
      placeholder.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      placeholder.classList.add("active");
    }
  }
}

// Otimização de recursos
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

// Função de debounce para otimização
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
