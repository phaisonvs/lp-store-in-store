// Carrossel para o site Seja um Franqueado ABC da Construção
document.addEventListener("DOMContentLoaded", function () {
  // Inicialização do carrossel de Guide Shops
  const carousel = new Carousel();
  carousel.init();

  // Inicializar o efeito de parallax
  setupParallax();

  // Inicializar controle das setas do slider de prova social
  setupProvaSocialArrows();

  // Inicializar animação de entrada para elementos observados
  // (Agora também armazena valores originais dos contadores)
  setupEntranceAnimations();

  // Acionar animação de entrada imediata para elementos do topo e controlar visibilidade da prova social
  triggerImmediateEntranceAnimation();

  // Inicializar carregamento de vídeos sob demanda
  setupLazyVideoLoad();
});

/**
 * @description Adiciona classes Animate.css para animação imediata em elementos específicos.
 */
function triggerImmediateEntranceAnimation() {
  const elements = document.querySelectorAll(
    // Selecionar os SVGs e o container .texto-faca-parte
    ".svg-suf-desk, .svg-suf-mobile, .texto-faca-parte"
  );
  if (elements.length > 0) {
    // Pequeno delay opcional, pode ser removido se não necessário
    setTimeout(() => {
      elements.forEach((el) => {
        // Remover classe antiga se existir
        // el.classList.remove("is-loaded-visible");

        // Definir duração
        el.style.setProperty("--animate-duration", "2s");

        // Tornar visível antes de animar
        el.style.visibility = "visible";

        // Adicionar classes Animate.css
        el.classList.add("animate__animated", "animate__zoomIn");

        console.log(`Animação Animate.css acionada para: ${el.className}`);

        // Opcional: Remover classes após a animação para limpar o DOM
        // el.addEventListener('animationend', () => {
        //   el.classList.remove('animate__animated', 'animate__fadeInDownBig');
        // }, { once: true });
      });
    }, 50); // Manter delay?
  } else {
    console.warn(
      "Elementos para animação imediata Animate.css não encontrados."
    );
  }
}

/**
 * @description Configura IntersectionObserver para animações de entrada.
 *              Armazena o valor original dos contadores e define o texto inicial.
 */
function setupEntranceAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const animatedCounters = new Set(); // Rastreia containers cuja animação já iniciou

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const targetElement = entry.target; // O container observado (ex: .big-numbers)
      const isVisible = entry.isIntersecting;

      // Lógica para .big-numbers
      if (targetElement.classList.contains("big-numbers")) {
        const listItems = targetElement.querySelectorAll("ul li");
        const counters = targetElement.querySelectorAll(
          ".number, .experience-years"
        );

        if (isVisible) {
          // Animar contadores sempre que o container fica visível
          console.log(
            "Elemento .big-numbers visível, iniciando/reinciando animação para contadores em:",
            targetElement
          );

          // Resetar texto inicial dos contadores ANTES de reanimar
          counters.forEach((counter) => {
            const originalValue = counter.dataset.originalValue;
            if (originalValue === undefined) return; // Pula se não houver valor
            if (originalValue.startsWith("+")) {
              counter.textContent = "+";
            } else {
              counter.textContent = "0";
            }
            // Remover classes de animação anteriores se existirem
            counter.classList.remove("counting", "finished");
          });

          // Chamar a função de animação
          animateCounters(counters);

          // Animar LIs para aparecerem
          listItems.forEach((item, index) => {
            item.classList.remove("animate__fadeOut"); // Garantir que fadeOut seja removido
            item.style.visibility = "visible"; // Tornar visível antes da animação
            item.classList.add("animate__animated", "animate__fadeInUp");
            item.style.animationDelay = `${index * 0.05}s`; // Pequeno delay escalonado
          });
        } else {
          // Esconder LIs e resetar estado quando saem da view
          listItems.forEach((item) => {
            item.style.visibility = "hidden"; // Esconder imediatamente
            item.classList.remove("animate__animated", "animate__fadeInUp");
            item.style.animationDelay = ""; // Limpar delay
          });
          // Resetar contadores para o estado inicial (opcional, mas pode ajudar)
          counters.forEach((counter) => {
            const originalValue = counter.dataset.originalValue;
            if (originalValue === undefined) return;
            if (originalValue.startsWith("+")) {
              counter.textContent = "+";
            } else {
              counter.textContent = "0";
            }
            counter.classList.remove("counting", "finished");
          });
        }
      }
      // Lógica para outros elementos (mantida)
      else if (targetElement.classList.contains("nossas-guides-container")) {
        const title = targetElement.querySelector("h3");
        const subtitle = targetElement.querySelector(".subtexto-guide");
        if (title) title.classList.toggle("is-visible", isVisible);
        if (subtitle) subtitle.classList.toggle("is-visible", isVisible);
      } else if (targetElement.classList.contains("section-the-news")) {
        const cards = targetElement.querySelectorAll(
          ".card-main, .card-secondary"
        );
        cards.forEach((card) => card.classList.toggle("is-visible", isVisible));
      } else if (targetElement.classList.contains("carousel")) {
        const cards = targetElement.querySelectorAll(".carousel__card");
        cards.forEach((card) => card.classList.toggle("is-visible", isVisible));
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const elementsToObserve = document.querySelectorAll(
    ".big-numbers, .nossas-guides-container, .section-the-news, .carousel"
  );

  if (elementsToObserve.length > 0) {
    // Preparação ANTES de observar
    elementsToObserve.forEach((el) => {
      if (el.classList.contains("big-numbers")) {
        const listItems = el.querySelectorAll("ul li");
        listItems.forEach((item) => (item.style.visibility = "hidden")); // Esconder LIs

        // Armazenar valor original e definir texto inicial para contadores
        const counters = el.querySelectorAll(".number, .experience-years");
        counters.forEach((counter) => {
          let originalValue = "";
          if (counter.classList.contains("experience-years")) {
            // Calcular e armazenar anos de experiência
            const inaugurationYear = 1958;
            const currentYear = new Date().getFullYear();
            const experienceYears = currentYear - inaugurationYear;
            originalValue = `+${experienceYears}`;
          } else {
            // Armazenar valor dos outros números
            originalValue = counter.textContent.trim();
          }

          counter.dataset.originalValue = originalValue; // Armazena o valor final

          // Define o texto inicial visível (antes da animação)
          if (originalValue.startsWith("+")) {
            counter.textContent = "+"; // Ou "+0"
          } else {
            counter.textContent = "0";
          }
          console.log(
            `Contador preparado: ${counter.className}, Valor Original: ${originalValue}, Texto Inicial: ${counter.textContent}`
          );
        });
      }
      // Observar o elemento container
      observer.observe(el);
    });
    console.log("IntersectionObserver configurado:", elementsToObserve);
  } else {
    console.warn("Nenhum elemento encontrado para observar animações.");
  }
}

/**
 * @description Anima os contadores, incrementando de 0 até o valor final.
 *              Lê o valor final de data-original-value.
 * @param {NodeList} elements - Elementos com .number ou .experience-years
 */
function animateCounters(elements) {
  if (!elements || elements.length === 0) {
    console.log("animateCounters chamado sem elementos.");
    return;
  }

  elements.forEach((counterElement) => {
    // Obter o valor final do atributo data que definimos
    const targetText = counterElement.dataset.originalValue;

    if (targetText === undefined || targetText === null) {
      console.warn(
        "Valor original não encontrado em data-original-value para:",
        counterElement
      );
      return; // Pula este elemento se não tiver valor definido
    }

    console.log(
      `Animando contador: ${counterElement.className}, Valor Alvo: ${targetText}`
    );

    let finalValueText = targetText;
    let prefix = "";
    let suffix = "";

    if (finalValueText.startsWith("+")) {
      prefix = "+";
      finalValueText = finalValueText.substring(1);
    }
    if (finalValueText.endsWith("x")) {
      suffix = "x";
      finalValueText = finalValueText.substring(0, finalValueText.length - 1);
    } else if (finalValueText.endsWith("%")) {
      suffix = "%";
      finalValueText = finalValueText.substring(0, finalValueText.length - 1);
    }

    const cleanedValueText = finalValueText.replace(/\./g, "");
    const numericValue = parseFloat(cleanedValueText);

    if (isNaN(numericValue)) {
      console.warn(
        "Valor não numérico encontrado:",
        cleanedValueText,
        "Original:",
        targetText
      );
      counterElement.textContent = targetText; // Restaura o valor original como fallback
      return;
    }

    const finalIntegerValue = Math.round(numericValue);
    counterElement.classList.add("counting");
    const duration = 4500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = easeOutQuart(progress);
      let currentValue = Math.min(
        finalIntegerValue * easedProgress,
        finalIntegerValue
      );
      const displayValue = Math.floor(currentValue);
      const formattedDisplayValue = displayValue.toLocaleString("pt-BR");

      counterElement.textContent = `${prefix}${formattedDisplayValue}${suffix}`;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        counterElement.textContent = targetText; // Garante valor final exato
        counterElement.classList.remove("counting");
        counterElement.classList.add("finished");
        setTimeout(() => {
          counterElement.classList.remove("finished");
        }, 600);
      }
    };

    // Garante que o texto inicial está definido antes de animar
    // (Já definido em setupEntranceAnimations, mas pode ser reforçado aqui se necessário)
    // counterElement.textContent = prefix ? prefix : '0';
    requestAnimationFrame(animate);
  });
}

/**
 * @description Função de easing para desacelerar a animação no final
 * @param {number} x - Valor de progresso entre 0 e 1
 * @return {number} - Valor com easing aplicado
 */
function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

/**
 * @description Configura as setas de navegação e eventos touch para o carrossel de prova social
 */
function setupProvaSocialArrows() {
  const carousel = document.querySelector(".carrossel-prova-social-1");
  const leftArrow = document.querySelector(".container-seta-esquerda");
  const rightArrow = document.querySelector(".container-seta-direita");

  if (!carousel || !leftArrow || !rightArrow) {
    console.warn(
      "Elementos do carrossel de prova social ou setas não encontrados."
    );
    return;
  }

  const getCardWidth = () => {
    const firstCard = carousel.querySelector(".card-prova-social");
    if (!firstCard) return 0;
    const cardStyle = window.getComputedStyle(firstCard);
    const cardMargin =
      parseFloat(cardStyle.marginLeft) + parseFloat(cardStyle.marginRight);
    // Considera a largura do card + gap (obtido do estilo do carrossel)
    const gap = parseFloat(window.getComputedStyle(carousel).gap);
    return firstCard.offsetWidth + (isNaN(gap) ? 16 : gap); // Usa 1rem (16px) como fallback para gap
  };

  leftArrow.addEventListener("click", () => {
    const cardWidth = getCardWidth();
    if (cardWidth > 0) {
      carousel.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  });

  rightArrow.addEventListener("click", () => {
    const cardWidth = getCardWidth();
    if (cardWidth > 0) {
      carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  });

  // Variáveis para controle de eventos touch
  let startX = 0;
  let startScrollLeft = 0;
  let isDragging = false;

  // Evento de início do toque
  carousel.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      startX = e.touches[0].pageX;
      startScrollLeft = carousel.scrollLeft;
      // Previne o comportamento padrão para evitar scroll da página
      e.preventDefault();
    },
    { passive: false }
  );

  // Evento de movimento do toque
  carousel.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX;
      const distance = x - startX;
      carousel.scrollLeft = startScrollLeft - distance;
      e.preventDefault();
    },
    { passive: false }
  );

  // Evento de fim do toque
  carousel.addEventListener("touchend", () => {
    isDragging = false;
  });

  // Evento de cancelamento do toque
  carousel.addEventListener("touchcancel", () => {
    isDragging = false;
  });

  console.log(
    "Setas e eventos touch do Carrossel de Prova Social configurados."
  );
}

/**
 * @description Inicializa o efeito parallax refinado ajustando background-position.
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

/**
 * @description Configura o carregamento sob demanda de vídeos do YouTube.
 *              Os vídeos serão carregados apenas quando o usuário clicar na thumbnail.
 */
function setupLazyVideoLoad() {
  const videoCards = document.querySelectorAll(".card-prova-social");

  if (videoCards.length === 0) {
    console.warn(
      "Nenhum card de vídeo encontrado para configurar carregamento sob demanda."
    );
    return;
  }

  videoCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Verifica se o vídeo já está sendo reproduzido
      if (this.classList.contains("video-playing")) return;

      const iframe = this.querySelector("iframe");

      if (!iframe) {
        console.warn("Iframe não encontrado no card de vídeo.");
        return;
      }

      // Transfere o URL de data-src para src para carregar o vídeo
      const videoSrc = iframe.getAttribute("data-src");

      if (!videoSrc) {
        console.warn("Atributo data-src não encontrado no iframe.");
        return;
      }

      // Adiciona parâmetro autoplay=1 para iniciar o vídeo automaticamente
      const autoplaySrc = videoSrc.includes("?")
        ? `${videoSrc}&autoplay=1`
        : `${videoSrc}?autoplay=1`;

      iframe.setAttribute("src", autoplaySrc);

      // Marca o card como em reprodução para aplicar os estilos adequados
      this.classList.add("video-playing");

      console.log(`Vídeo carregado e iniciado: ${videoSrc}`);
    });
  });

  console.log(
    "Carregamento sob demanda de vídeos configurado para",
    videoCards.length,
    "cards."
  );
}
