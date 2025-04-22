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

  // Configurações do efeito parallax avançado baseado em scroll
  const parallaxSettings = {
    scrollFactor: 0.15, // Influência do scroll na transformação (menor = mais sutil)
    maxTilt: 5, // Rotação máxima em graus
    maxDepth: 40, // Profundidade máxima para o efeito 3D
    transitionSpeed: 0.8, // Velocidade da transição em segundos
    perspective: 1000, // Perspectiva 3D
    mouseInfluence: 0.05, // Influência do mouse no efeito
    scrollThreshold: 100, // Limite para ativar efeitos baseados no scroll
    scaleRange: [1.0, 1.05], // Intervalo de escala durante o scroll
  };

  // Função para configurar e iniciar o efeito parallax
  function setupParallaxEffect() {
    const parallaxElement = document.querySelector(".parallax-bg");
    if (!parallaxElement) return;

    // Define variáveis CSS personalizadas para controlar efeitos
    document.documentElement.style.setProperty(
      "--parallax-speed",
      parallaxSettings.scrollFactor
    );
    document.documentElement.style.setProperty(
      "--parallax-perspective",
      `${parallaxSettings.perspective}px`
    );

    // Estado inicial do elemento
    let lastScrollTop = 0;
    let isScrolling = false;
    let scrollTimeout;

    // Referência para o cálculo de velocidade do scroll
    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;

    // Configurar o observador de interseção para otimizar renderização
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener("scroll", handleScroll, { passive: true });
            window.addEventListener("mousemove", handleMouseMove, {
              passive: true,
            });
          } else {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(parallaxElement);

    // Handler de scroll para aplicar transformações
    function handleScroll() {
      // Ativa classe para o efeito de luz durante o scroll
      if (!isScrolling) {
        parallaxElement.classList.add("scrolling");
        isScrolling = true;
      }

      // Limpa o timeout anterior
      clearTimeout(scrollTimeout);

      // Define um novo timeout
      scrollTimeout = setTimeout(() => {
        parallaxElement.classList.remove("scrolling");
        isScrolling = false;
      }, 300);

      // Calcula direção e velocidade do scroll
      const scrollY = window.scrollY;
      const scrollDirection = scrollY > lastScrollTop ? 1 : -1;
      scrollSpeed = Math.abs(scrollY - lastScrollY) * 0.01;
      lastScrollY = scrollY;

      // Limita a velocidade de scroll para animações
      scrollSpeed = Math.min(1, scrollSpeed);

      // Calcula os valores de transformação
      const rect = parallaxElement.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = (elementCenter - viewportCenter) * -1;
      const scrollProgress = distanceFromCenter / (window.innerHeight / 2);

      // Calcula a transformação com base na posição do scroll
      const translateY =
        scrollDirection * distanceFromCenter * parallaxSettings.scrollFactor;
      const scale = lerp(
        parallaxSettings.scaleRange[0],
        parallaxSettings.scaleRange[1],
        Math.min(1, Math.abs(scrollProgress))
      );

      const rotateX = Math.max(
        -parallaxSettings.maxTilt,
        Math.min(parallaxSettings.maxTilt, scrollProgress * -5)
      );

      // Aplica a transformação com transição suave
      requestAnimationFrame(() => {
        parallaxElement.style.transform = `
          perspective(${parallaxSettings.perspective}px) 
          translateY(${translateY}px) 
          scale(${scale}) 
          rotateX(${rotateX}deg)
        `;

        // Ajusta o blur com base na velocidade do scroll
        if (scrollSpeed > 0.1) {
          parallaxElement.style.filter = `brightness(${
            100 + scrollSpeed * 15
          }%)`;
        } else {
          parallaxElement.style.filter = "";
        }
      });

      lastScrollTop = scrollY;
    }

    // Handler de movimento do mouse para efeito interativo
    function handleMouseMove(e) {
      // Calcula a posição do mouse em relação à viewport
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;

      // Atualiza variáveis CSS para o gradiente de luz
      document.documentElement.style.setProperty("--mouse-x", `${mouseX}%`);
      document.documentElement.style.setProperty("--mouse-y", `${mouseY}%`);

      // Calcula o centro da tela
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calcula o deslocamento do mouse em relação ao centro
      const deltaX = (e.clientX - centerX) * parallaxSettings.mouseInfluence;
      const deltaY = (e.clientY - centerY) * parallaxSettings.mouseInfluence;

      // Aplica um leve efeito de inclinação 3D baseado na posição do mouse
      if (isElementInViewport(parallaxElement)) {
        const currentTransform = parallaxElement.style.transform || "";

        // Se já houver transformação, a mantemos e adicionamos a rotação do mouse
        if (currentTransform.includes("perspective")) {
          // Extrai transformações existentes exceto rotação
          const existingTransform = currentTransform.replace(
            /rotateY\([^)]*\) rotateX\([^)]*\)/g,
            ""
          );

          // Adiciona a rotação baseada no mouse
          parallaxElement.style.transform = `${existingTransform} rotateY(${
            deltaX / 30
          }deg) rotateX(${-deltaY / 30}deg)`;
        }
      }
    }
  }

  // Função auxiliar para interpolar valores
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  // Função auxiliar para verificar se um elemento está na viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
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
        });
        toggleContainer.appendChild(button);
      });

      section.appendChild(toggleContainer);
    }
  }

  function init() {
    if (isListenersRegistered) return;
    isListenersRegistered = true;

    // Inicializar o efeito parallax
    setupParallaxEffect();

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
