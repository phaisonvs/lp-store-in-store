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
  let particles;
  let parallaxElements = [];
  let mouse = { x: 0, y: 0 };

  // Configurações
  const PARALLAX_DEPTH = 40; // Profundidade do efeito parallax
  const PARTICLE_COUNT = 50; // Número de partículas

  // Inicializar efeitos
  function init() {
    if (isListenersRegistered) return;
    isListenersRegistered = true;

    // Adicionar controles de visualização do background
    setupBackgroundToggle();

    // Inicializar carrossel existente
    initCarousel();

    // Inicializar efeitos de partículas e parallax 3D
    initParticles();
    initParallax3D();

    // Adicionar suporte ao carrossel de vídeos
    addArrowScrollSupport();

    // Atualizar anos de experiência
    updateExperienceYears();

    // Limpar frames de animação ao fechar a página
    window.addEventListener("beforeunload", () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  }

  // Função para alternar entre os diferentes estilos de visualização do background
  function setupBackgroundToggle() {
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

  // Inicialização do carrossel existente
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

  // Inicialização do efeito de partículas usando tsParticles
  function initParticles() {
    // Criar elemento container para as partículas
    const section = document.querySelector(".seja-um-franqueado");
    if (!section) return;

    const particlesContainer = document.createElement("div");
    particlesContainer.id = "particles-container";
    particlesContainer.style.cssText =
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;";
    section.appendChild(particlesContainer);

    // Inicializar tsParticles (versão 2.x)
    tsParticles
      .load("particles-container", {
        fpsLimit: 60,
        particles: {
          number: {
            value: PARTICLE_COUNT,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.3,
            random: true,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.3,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out",
            attract: {
              enable: true,
              rotate: {
                x: 600,
                y: 1200,
              },
            },
          },
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            onClick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
            push: {
              quantity: 4,
            },
          },
        },
        detectRetina: true,
      })
      .catch((error) => {
        console.error("Erro ao inicializar partículas:", error);

        // Fallback para criar partículas manualmente se o tsParticles falhar
        createManualParticles(section);
      });
  }

  // Função de fallback para criar partículas manualmente
  function createManualParticles(container) {
    const particlesContainer = document.createElement("div");
    particlesContainer.id = "manual-particles";
    particlesContainer.style.cssText =
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;";
    container.appendChild(particlesContainer);

    // Criar partículas simples
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      createParticle(particlesContainer);
    }
  }

  function createParticle(container) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Posição aleatória
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // Tamanho aleatório
    const size = Math.random() * 4 + 1;

    // Opacidade aleatória
    const opacity = Math.random() * 0.5 + 0.1;

    // Configurar estilos
    particle.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background-color: white;
      border-radius: 50%;
      opacity: ${opacity};
      box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
    `;

    container.appendChild(particle);

    // Animar a partícula
    animateParticle(particle);
  }

  function animateParticle(particle) {
    // Duração aleatória para a animação
    const duration = Math.random() * 10 + 10; // 10-20 segundos

    // Direção aleatória
    const xMove = Math.random() * 20 - 10; // -10 a +10
    const yMove = Math.random() * 20 - 10; // -10 a +10

    // Configurar animação com CSS
    particle.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-in-out`;
    particle.style.transform = `translate(${xMove}vw, ${yMove}vh)`;

    // Alterar opacidade aleatoriamente
    setTimeout(() => {
      particle.style.opacity = Math.random() * 0.5 + 0.1;
    }, Math.random() * 5000);

    // Reiniciar animação quando terminar
    setTimeout(() => {
      particle.style.transition = "none";
      particle.style.transform = "translate(0, 0)";

      // Pequeno delay para evitar transição abrupta
      setTimeout(() => {
        animateParticle(particle);
      }, 50);
    }, duration * 1000);
  }

  // Inicialização do efeito Parallax 3D
  function initParallax3D() {
    const section = document.querySelector(".seja-um-franqueado");
    if (!section) return;

    // Adicionar camadas para efeito parallax
    const elements = [
      { selector: ".svg-suf-desk, .svg-suf-mobile", depth: 0.5 },
      { selector: ".maior-rede-de-acabamentos", depth: 0.3 },
      { selector: ".subtexto", depth: 0.2 },
      { selector: ".big-numbers", depth: 0.1 },
    ];

    // Coletar todos os elementos para aplicar o efeito
    elements.forEach((item) => {
      const els = document.querySelectorAll(item.selector);
      els.forEach((el) => {
        if (el) {
          parallaxElements.push({
            element: el,
            depth: item.depth,
          });

          // Adicionar estilo para transformação 3D
          el.style.transition = "transform 0.2s ease-out";
          el.style.willChange = "transform";
        }
      });
    });

    // Adicionar listeners para movimento do mouse
    document.addEventListener("mousemove", handleMouseMove);

    // Adicionar listener para o scroll
    window.addEventListener("scroll", handleScroll);

    // Chamada inicial para posicionar os elementos
    handleMouseMove({
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
    });
    handleScroll();
  }

  // Manipulador de movimento do mouse para o efeito parallax
  function handleMouseMove(event) {
    // Atualizar posição do mouse
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = event.clientY / window.innerHeight - 0.5;

    // Aplicar transformação aos elementos
    parallaxElements.forEach(({ element, depth }) => {
      const x = mouse.x * PARALLAX_DEPTH * depth;
      const y = mouse.y * PARALLAX_DEPTH * depth;
      const scale = 1 + depth * 0.05;

      // Aplicar transformação 3D
      element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    });
  }

  // Manipulador de scroll para o efeito parallax
  function handleScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Aplicar efeito de profundidade com base no scroll
    parallaxElements.forEach(({ element, depth }) => {
      const elementRect = element.getBoundingClientRect();
      const elementCenter = elementRect.top + elementRect.height / 2;

      // Distância do centro da viewport
      const distanceFromCenter =
        (elementCenter - windowHeight / 2) / (windowHeight / 2);

      // Se o elemento estiver visível na viewport
      if (elementRect.top < windowHeight && elementRect.bottom > 0) {
        const z = -distanceFromCenter * depth * 20;
        const currentTransform = element.style.transform;

        // Adicionar efeito de profundidade ao scroll mantendo o movimento do mouse
        if (currentTransform.includes("translate3d")) {
          const match = currentTransform.match(
            /translate3d\(([^,]+),\s*([^,]+),\s*[^)]+\)/
          );
          if (match) {
            const x = match[1];
            const y = match[2];
            element.style.transform = `translate3d(${x}, ${y}, ${z}px)`;
          }
        }
      }
    });
  }

  // Inicializar quando o DOM estiver carregado
  init();
});
