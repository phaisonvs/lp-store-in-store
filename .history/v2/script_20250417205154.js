// Carrossel para o site Seja um Franqueado ABC da Construção
document.addEventListener("DOMContentLoaded", function () {
  // Inicialização do carrossel
  const carousel = new Carousel();
  carousel.init();

  // Inicializar o efeito de parallax
  setupParallax();

  // Inicializar as animações dos SVGs
  setupSvgAnimations();

  // A animação de digitação agora é gerenciada pelo framer-typing.js
  // Descomente a linha abaixo se quiser voltar à implementação original
  // setupTypingAnimation();
});

/**
 * @description Implementa a animação de digitação de texto (versão original)
 * Atualmente desativada e substituída pela implementação Framer Motion
 */
function setupTypingAnimation() {
  const typingContainer = document.querySelector(".typing-container");
  if (!typingContainer) return;

  const text =
    "O modelo de negócio que está transformando o mercado da construção no Brasil: inovação e rentabilidade em um setor que não para de evoluir.";
  let index = 0;

  // Garante que o container está vazio antes de iniciar
  typingContainer.textContent = "";

  // Usando a biblioteca motion para criar uma sequência de animação
  if (typeof motion !== "undefined") {
    // Aguarda o delay definido no CSS antes de iniciar a digitação
    setTimeout(() => {
      // Configura o intervalo para a animação de digitação
      const typingInterval = setInterval(() => {
        if (index < text.length) {
          typingContainer.textContent += text.charAt(index);
          index++;

          // Uso da biblioteca motion para criar micro-animações durante a digitação
          motion.animate(
            typingContainer,
            {
              opacity: [0.85, 1],
              scale: [0.995, 1],
            },
            {
              duration: 0.1,
              easing: "ease-out",
            }
          );
        } else {
          clearInterval(typingInterval);

          // Animação final quando o texto está completo
          motion.animate(
            typingContainer,
            {
              color: ["#e5e5e5", "#ffffff", "#e5e5e5"],
            },
            {
              duration: 1.5,
              easing: "ease-in-out",
            }
          );
        }
      }, 40); // Velocidade da digitação
    }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--delay-typing")) * 1000 || 1800);
  } else {
    // Fallback caso a biblioteca motion não esteja disponível
    console.warn(
      "Biblioteca motion não encontrada. Usando fallback para animação."
    );
    typingContainer.textContent = text;
    typingContainer.style.opacity = 1;
  }
}

/**
 * @description Inicializa as animações de fade-in para os SVGs
 */
function setupSvgAnimations() {
  const svgElements = document.querySelectorAll(".svg-fade");

  if (svgElements.length > 0) {
    // Aguarda 1 segundo conforme o --delay-fade nas propriedades CSS
    setTimeout(() => {
      svgElements.forEach((svg) => {
        svg.classList.add("is-visible");
      });
    }, 100); // Pequeno timeout para garantir que os estilos CSS já foram aplicados
  }
}

/**
 * @description Inicializa o parallax simples - otimizado para performance
 */
function setupParallax() {
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
}

class Carousel {
  constructor() {
    this.scrollSpeed = 1;
    this.currentTranslate = 0;
    this.animationId = null;
    this.isDragging = false;
    this.startPosition = 0;
    this.prevTranslate = 0;
    this.cardWidth = 0;
    this.cloneCount = 0;
    this.isListenersRegistered = false;
  }

  init() {
    if (this.isListenersRegistered) return;
    this.isListenersRegistered = true;

    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");

    if (!carousel || !track) {
      console.error("Elementos do carrossel não encontrados.");
      return;
    }

    const cards = Array.from(track.children);
    if (cards.length === 0) {
      console.error("Nenhum card encontrado no carrossel.");
      return;
    }

    this.cardWidth = cards[0].getBoundingClientRect().width;
    const visibleCardsCount = Math.ceil(carousel.offsetWidth / this.cardWidth);
    this.cloneCount = visibleCardsCount * 2;

    this.cloneCards(cards, track);
    this.startContinuousAnimation();
    this.setupEventListeners(carousel, track);
    this.addArrowScrollSupport();
    this.updateExperienceYears();
  }

  cloneCards(cards, track) {
    const clonesToStart = cards.slice(-this.cloneCount);
    const clonesToEnd = cards.slice(0, this.cloneCount);

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

    this.currentTranslate = -this.cardWidth * this.cloneCount;
    track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  startContinuousAnimation() {
    cancelAnimationFrame(this.animationId);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  animate() {
    const track = document.querySelector(".carousel__track");
    if (!track) return;

    const totalCards = track.children.length;
    const maxTranslate = -this.cardWidth * (totalCards - this.cloneCount);
    const resetTranslate = -this.cardWidth * this.cloneCount;

    if (!this.isDragging) {
      this.currentTranslate -= this.scrollSpeed;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    if (this.currentTranslate <= maxTranslate) {
      this.currentTranslate = resetTranslate;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    if (this.currentTranslate >= 0) {
      this.currentTranslate = maxTranslate;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  setupEventListeners(carousel, track) {
    carousel.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.startPosition = e.pageX;
      this.prevTranslate = this.currentTranslate;
      cancelAnimationFrame(this.animationId);
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      const delta = e.pageX - this.startPosition;

      if (Math.abs(delta) > this.cardWidth * this.cloneCount) return;

      this.currentTranslate = this.prevTranslate + delta;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    });

    carousel.addEventListener("mouseup", () => this.handleDragEnd(track));
    carousel.addEventListener("mouseleave", () => this.handleDragEnd(track));

    carousel.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      this.startPosition = e.touches[0].clientX;
      this.prevTranslate = this.currentTranslate;
      cancelAnimationFrame(this.animationId);
    });

    carousel.addEventListener("touchmove", (e) => {
      if (!this.isDragging) return;
      const delta = e.touches[0].clientX - this.startPosition;

      if (Math.abs(delta) > this.cardWidth * this.cloneCount) return;

      this.currentTranslate = this.prevTranslate + delta;
      track.style.transform = `translateX(${this.currentTranslate}px)`;
    });

    carousel.addEventListener("touchend", () => this.handleDragEnd(track));
    carousel.addEventListener("touchcancel", () => this.handleDragEnd(track));

    carousel.addEventListener("dragstart", (e) => e.preventDefault());

    carousel.addEventListener("mouseenter", () => {
      this.scrollSpeed /= 2;
    });

    carousel.addEventListener("mouseleave", () => {
      this.scrollSpeed *= 2;
    });
  }

  handleDragEnd(track) {
    if (this.isDragging) {
      this.isDragging = false;
      this.startContinuousAnimation();
    }
  }

  addArrowScrollSupport() {
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

    const cardWidth = cards[0].offsetWidth + 12;

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

  updateExperienceYears() {
    // Lógica para calcular a idade da ABC
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

  // Método para limpar recursos quando necessário
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
