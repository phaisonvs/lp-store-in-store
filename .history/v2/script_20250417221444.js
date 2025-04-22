// Carrossel para o site Seja um Franqueado ABC da Construção
document.addEventListener("DOMContentLoaded", function () {
  // Inicialização do carrossel
  const carousel = new Carousel();
  carousel.init();

  // Inicializar o efeito de parallax
  setupParallax();

  // Inicializar as animações dos SVGs
  setupSvgAnimations();
});

/**
 * @description Inicializa o efeito parallax com translateY e scale suaves no ::before.
 */
function setupParallax() {
  const section = document.querySelector(".seja-um-franqueado");
  if (!section) {
    console.error("Elemento .seja-um-franqueado não encontrado para parallax.");
    return;
  }

  const parallaxFactorY = 0.25; // Ajuste a intensidade do movimento Y
  const startScale = 1.05; // Escala inicial (ligeiramente maior)
  const endScale = 1.0; // Escala final (normal)

  let sectionHeight = section.offsetHeight;
  let ticking = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + scrollY;

    // Verifica se a seção está na viewport
    const sectionInView = rect.top < viewportHeight && rect.bottom > 0;

    if (!sectionInView) {
      // Se não estiver na vista, podemos resetar para o estado inicial ou manter o último
      // Resetar pode causar saltos, então manter o último pode ser mais suave.
      // Se quiser resetar:
      // requestAnimationFrame(() => {
      //   section.style.setProperty('--parallax-y', `0px`);
      //   section.style.setProperty('--parallax-scale', startScale.toFixed(4));
      // });
      ticking = false;
      return;
    }

    // Posição do centro da viewport relativa ao centro da seção
    const viewportCenter = scrollY + viewportHeight / 2;
    const sectionCenter = sectionTop + sectionHeight / 2;
    const distanceToCenter = viewportCenter - sectionCenter;

    // Calcula o deslocamento Y baseado na distância do centro
    const maxOffsetY = sectionHeight * parallaxFactorY * 0.5;
    const yPos = Math.max(
      -maxOffsetY,
      Math.min(maxOffsetY, -distanceToCenter * parallaxFactorY)
    );

    // Calcula a escala baseado na distância do centro
    // Queremos scale = startScale quando longe, e endScale quando perto (distanceToCenter ~ 0)
    // Usamos Math.abs() e clamp para mapear a distância para um progresso de 0 a 1
    const scaleProgress = Math.min(
      1,
      Math.abs(distanceToCenter) / (viewportHeight / 2 + sectionHeight / 2)
    );
    const scaleValue = endScale + (startScale - endScale) * scaleProgress;

    requestAnimationFrame(() => {
      section.style.setProperty("--parallax-y", `${yPos.toFixed(2)}px`);
      section.style.setProperty("--parallax-scale", scaleValue.toFixed(4));
    });

    ticking = false;
  };

  // Observador para recalcular altura da seção em resize
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      sectionHeight = entry.target.offsetHeight;
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
      }
    }
  });
  resizeObserver.observe(section);

  // Listener de Scroll otimizado
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(handleScroll);
      }
    },
    { passive: true }
  );

  // Chama uma vez no início
  handleScroll();
}

/**
 * @description Inicializa as animações para os SVGs usando Animate.css
 */
function setupSvgAnimations() {
  const svgElements = document.querySelectorAll(".svg-fade.animate__animated");

  if (svgElements.length > 0) {
    // Removemos a classe is-visible da implementação anterior se existir
    svgElements.forEach((svg) => {
      svg.classList.remove("is-visible");
    });

    // Aguarda 1 segundo antes de aplicar a animação
    setTimeout(() => {
      svgElements.forEach((svg) => {
        // Adiciona a classe de animação do Animate.css
        svg.classList.add("animate__backInDown");

        // Configura duração personalizada (opcional)
        svg.style.setProperty("--animate-duration", "1.2s");
      });
    }, 1000); // 1 segundo de atraso
  }
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
