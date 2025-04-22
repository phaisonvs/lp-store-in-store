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

  // Variável para armazenar a referência à função de atualização de zoom
  let updateZoom;

  // Efeito de zoom no background conforme o scroll
  function setupParallaxZoomEffect() {
    const section = document.querySelector(".seja-um-franqueado");
    if (!section) return;

    // Valores de configuração do efeito
    const minZoom = 110; // Tamanho mínimo (%)
    const maxZoom = 130; // Tamanho máximo (%)
    const scrollRange = 1000; // Intervalo de scroll para atingir o zoom máximo
    
    // Aplicar o zoom inicial
    section.style.backgroundSize = `${minZoom}%`;
    
    // Função de atualização de zoom
    updateZoom = function() {
      // Posição do scroll
      const scrollPos = window.scrollY;
      
      // Posição relativa da seção
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // Só aplicamos o efeito quando a seção estiver visível
      if (scrollPos > sectionTop - window.innerHeight && scrollPos < sectionTop + sectionHeight) {
        // Calcular a porcentagem de scroll dentro da seção
        const scrollPercent = Math.min(1, Math.max(0, 
          (scrollPos - (sectionTop - window.innerHeight)) / scrollRange));
        
        // Calcular o valor do zoom baseado na porcentagem de scroll
        const zoomValue = minZoom + (maxZoom - minZoom) * scrollPercent;
        
        // Aplicar o zoom na imagem de fundo
        section.style.backgroundSize = `${zoomValue}%`;
      }
    };
    
    // Adicionar o listener de scroll para atualizar o zoom
    window.addEventListener('scroll', updateZoom);
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
        { name: "zoom-active", label: "Efeito de Zoom", isZoom: true }
      ];

      let zoomActive = true; // Por padrão, o zoom estará ativo

      styles.forEach((style) => {
        const button = document.createElement("button");
        button.textContent = style.label;
        button.style.cssText =
          "padding: 5px 10px; background: rgba(0,0,0,0.7); color: white; border: 1px solid #fff; cursor: pointer; font-size: 12px;";
        
        // Se for o botão de zoom, marcar como ativo inicialmente
        if (style.isZoom) {
          button.style.backgroundColor = "rgba(0,150,0,0.7)";
        }
        
        button.addEventListener("click", () => {
          // Se for o botão de zoom
          if (style.isZoom) {
            zoomActive = !zoomActive;
            button.style.backgroundColor = zoomActive ? 
              "rgba(0,150,0,0.7)" : "rgba(0,0,0,0.7)";
            
            // Desativar/reativar o efeito de zoom
            if (zoomActive) {
              setupParallaxZoomEffect();
            } else {
              // Remover evento de scroll e redefinir tamanho
              window.removeEventListener("scroll", updateZoom);
              section.style.backgroundSize = "110%";
            }
            return;
          }
          
          // Para outros botões, remover todas as classes de estilo
          section.classList.remove(
            "bg-contain",
            "bg-expanded",
            "bg-proportional"
          );
          
          // Adicionar a classe selecionada
          section.classList.add(`bg-${style.name}`);
          
          // Desativar o zoom ao escolher outro estilo
          if (zoomActive) {
            zoomActive = false;
            const zoomButton = Array.from(toggleContainer.children).find(
              (b) => b.textContent === "Efeito de Zoom"
            );
            if (zoomButton) {
              zoomButton.style.backgroundColor = "rgba(0,0,0,0.7)";
            }
            
            // Remover evento de scroll
            window.removeEventListener("scroll", updateZoom);
          }
        });
        toggleContainer.appendChild(button);
      });

      section.appendChild(toggleContainer);
    }
  }

  function init() {
    if (isListenersRegistered) return;
    isListenersRegistered = true;

    // Adicionar efeito de parallax com zoom
    setupParallaxZoomEffect();

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
      track.style.transform = `