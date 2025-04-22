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
  let zoomAnimationId = null;

  // Efeito de zoom do background usando transformação direta
  function setupZoomEffect() {
    const section = document.querySelector(".seja-um-franqueado");
    if (!section) return;

    // Criar o elemento de imagem de fundo para controlar separadamente
    const backgroundContainer = document.createElement("div");
    backgroundContainer.className = "background-zoom-container";

    // Clonar o estilo de background para o novo elemento
    const computedStyle = getComputedStyle(section);
    const backgroundImage = computedStyle.backgroundImage;
    const backgroundPosition = computedStyle.backgroundPosition;
    const backgroundRepeat = computedStyle.backgroundRepeat;

    // Criar HTML para o background
    backgroundContainer.innerHTML = `
      <div class="zoom-bg" style="
        background-image: ${backgroundImage};
        background-position: ${backgroundPosition};
        background-repeat: ${backgroundRepeat};
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: transform 0.1s ease-out;
        will-change: transform;
        transform: scale(1.15);
      "></div>
    `;

    // Inserir o container antes de qualquer outro conteúdo
    section.insertBefore(backgroundContainer, section.firstChild);

    // Remover o background da section original
    section.style.backgroundImage = "none";

    // Referência ao elemento de zoom
    const zoomElement = backgroundContainer.querySelector(".zoom-bg");

    // Valores para o zoom
    const minZoom = 1.15; // Zoom inicial (15% maior)
    const maxZoom = 1.05; // Zoom final (mais próximo de 1, parece "zoom out")
    const zoomDuration = 2.5; // Segundos para a animação completa
    const zoomRange = 0.5; // Proporção da página para iniciar o zoom

    let lastScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    let zoomDirection = null; // 'in' ou 'out' ou null
    let currentZoom = minZoom;

    // Função para atualizar o zoom suavemente
    function animateZoom() {
      // Atualizar o zoom com base na direção
      if (zoomDirection === "in" && currentZoom > maxZoom) {
        currentZoom -= 0.002; // Velocidade do zoom in
      } else if (zoomDirection === "out" && currentZoom < minZoom) {
        currentZoom += 0.002; // Velocidade do zoom out
      }

      // Limitar os valores
      currentZoom = Math.max(maxZoom, Math.min(minZoom, currentZoom));

      // Aplicar a transformação
      zoomElement.style.transform = `scale(${currentZoom})`;

      // Continuar a animação
      zoomAnimationId = requestAnimationFrame(animateZoom);
    }

    // Iniciar a animação
    zoomAnimationId = requestAnimationFrame(animateZoom);

    // Event handler para o scroll
    function handleScroll() {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Verificar se o elemento está visível
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        // Definir a direção do zoom baseado na direção do scroll
        if (scrollTop > lastScrollTop) {
          // Scrolling down - zoom in
          zoomDirection = "in";
        } else if (scrollTop < lastScrollTop) {
          // Scrolling up - zoom out
          zoomDirection = "out";
        }
      } else {
        // Se não estiver visível, voltar para o estado inicial
        zoomDirection = currentZoom < minZoom ? "out" : null;
      }

      // Atualizar a última posição do scroll
      lastScrollTop = scrollTop;
    }

    // Adicionar listener com passive true para performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Retornar função para limpar
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(zoomAnimationId);
    };
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

    // Configurar efeito de zoom
    setupZoomEffect();

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
    if (zoomAnimationId) {
      cancelAnimationFrame(zoomAnimationId);
    }
  });
});
