document.addEventListener("DOMContentLoaded", function () {
  // Variáveis globais para o carrossel
  let scrollSpeed = 1;
  let currentTranslate = 0;
  let animationId = null;
  let isDragging = false;
  let startPosition = 0;
  let prevTranslate = 0;
  let cardWidth = 0;
  let cloneCount = 0;
  let isListenersRegistered = false;

  // Inicializar efeitos GSAP
  function initGsapEffects() {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      const parallaxSection = document.querySelector(".parallax-section");
      if (parallaxSection) {
        console.log("Configurando efeito parallax para:", parallaxSection);

        // Configuração inicial
        gsap.set(parallaxSection, {
          backgroundSize: "100%",
        });

        // Efeito de zoom durante o scroll
        gsap.to(parallaxSection, {
          backgroundSize: "120%",
          ease: "none",
          scrollTrigger: {
            trigger: parallaxSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
              console.log("Progresso scroll:", self.progress.toFixed(2));
            },
          },
        });

        console.log("Efeito parallax configurado!");
      } else {
        console.warn("Seção parallax não encontrada!");
      }
    } else {
      console.warn("GSAP ou ScrollTrigger não foram carregados corretamente.");
    }
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

          // Reiniciar o efeito parallax após trocar o estilo
          initGsapEffects();
        });
        toggleContainer.appendChild(button);
      });

      section.appendChild(toggleContainer);
    }
  }

  function init() {
    if (isListenersRegistered) return;
    isListenersRegistered = true;

    // Inicializar efeitos GSAP
    initGsapEffects();

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

  // Efeito de parallax 3D com camadas
  function initParallaxEffect() {
    console.log("Iniciando efeito parallax 3D");

    const layers = document.querySelectorAll(".parallax-layer");

    window.addEventListener("scroll", function () {
      const scrollPosition = window.scrollY;

      layers.forEach((layer) => {
        const depth = layer.getAttribute("data-depth");
        const movement = -(scrollPosition * depth);

        // Aplica transformação 3D
        gsap.to(layer, {
          y: movement,
          ease: "none",
          duration: 0.5,
        });

        // Adiciona efeito de rotação sutil
        gsap.to(layer, {
          rotationX: scrollPosition * 0.01 * depth,
          rotationY: scrollPosition * 0.01 * depth,
          ease: "none",
          duration: 0.5,
        });
      });
    });

    // Efeito de movimento ao mover o mouse
    document.addEventListener("mousemove", function (e) {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      layers.forEach((layer) => {
        const depth = layer.getAttribute("data-depth");
        const moveX = (mouseX - 0.5) * depth * 50;
        const moveY = (mouseY - 0.5) * depth * 50;

        gsap.to(layer, {
          x: moveX,
          y: moveY,
          duration: 1,
          ease: "power2.out",
        });
      });
    });
  }

  // Sistema de partículas
  function initParticles() {
    console.log("Iniciando sistema de partículas");

    const particlesContainer = document.getElementById("particles");
    const particleCount = 50;

    // Cria partículas dinâmicas
    for (let i = 0; i < particleCount; i++) {
      createParticle(particlesContainer);
    }
  }

  function createParticle(container) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Posição aleatória
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;

    // Tamanho aleatório
    const size = Math.random() * 5 + 2;

    // Propriedades CSS
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = Math.random() * 0.6 + 0.2;

    // Adiciona a partícula ao container
    container.appendChild(particle);

    // Animação com GSAP
    animateParticle(particle);
  }

  function animateParticle(particle) {
    // Duração e atraso aleatórios
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;

    // Movimento float suave
    gsap.to(particle, {
      y: `-=${Math.random() * 100 + 50}`,
      x: `+=${(Math.random() - 0.5) * 100}`,
      opacity: 0,
      duration: duration,
      delay: delay,
      ease: "power1.inOut",
      onComplete: function () {
        // Reposiciona a partícula
        particle.style.top = `${Math.random() * 100 + 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.6 + 0.2;

        // Reinicia a animação
        animateParticle(particle);
      },
    });
  }

  // Para os botões de controle de visualização (se existirem)
  document.querySelectorAll(".btn-visual").forEach((btn) => {
    btn.addEventListener("click", function () {
      console.log("Botão de visualização clicado");
      // Reseta os efeitos para manter consistência
      initParallaxEffect();
      initGsapEffects();
    });
  });
});
