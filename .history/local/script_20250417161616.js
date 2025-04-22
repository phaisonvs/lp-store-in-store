/**
 * Script simplificado para funcionamento local
 */
document.addEventListener("DOMContentLoaded", function () {
  // Mostrar todos os elementos
  document.querySelectorAll(".animate-on-scroll").forEach(function (el) {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.classList.add("is-visible");
  });

  // Mostrar seções específicas
  [
    ".container-prova-social-1",
    ".section-the-news",
    ".nossas-guides-container",
    ".carousel",
  ].forEach(function (selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = "1";
      element.style.transform = "none";
      element.classList.add("is-visible");
    }
  });

  // Atualizar anos de experiência
  var currentYear = new Date().getFullYear();
  var foundingYear = 2014;
  var yearsExperience = currentYear - foundingYear;

  document.querySelectorAll(".experience-years").forEach(function (el) {
    el.textContent = "+" + yearsExperience;
  });

  // Configurar carrossel de vídeos
  var videoCarousel = document.querySelector(".carrossel-prova-social-1");
  var prevBtn = document.querySelector(
    ".container-prova-social-1 .container-seta-esquerda"
  );
  var nextBtn = document.querySelector(
    ".container-prova-social-1 .container-seta-direita"
  );

  if (videoCarousel && prevBtn && nextBtn) {
    // Calcular o tamanho de scroll baseado no primeiro card
    function getScrollAmount() {
      var card = videoCarousel.querySelector(".card-prova-social");
      if (!card) return 300;
      return card.offsetWidth + 16; // 16px é um gap padrão
    }

    prevBtn.addEventListener("click", function () {
      videoCarousel.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    });

    nextBtn.addEventListener("click", function () {
      videoCarousel.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    });
  }

  // Lazy-load para vídeos
  document.querySelectorAll("iframe[data-src]").forEach(function (iframe) {
    iframe.src = iframe.dataset.src;
    iframe.removeAttribute("data-src");
  });

  // Configurar carrosel de guide shops
  var guideCarousel = document.querySelector(".carousel");
  var guideTrack = document.querySelector(".carousel__track");
  var guidePrevBtn = document.querySelector(".guide-shop-prev");
  var guideNextBtn = document.querySelector(".guide-shop-next");

  if (guideCarousel && guideTrack && guidePrevBtn && guideNextBtn) {
    var currentPosition = 0;
    var cardWidth = 320; // Valor padrão

    // Tentar obter a largura real do card
    var firstCard = guideTrack.querySelector(".carousel__card");
    if (firstCard) {
      cardWidth = firstCard.offsetWidth;
    }

    guidePrevBtn.addEventListener("click", function () {
      currentPosition += cardWidth;
      if (currentPosition > 0) currentPosition = 0;
      guideTrack.style.transition = "transform 0.5s ease";
      guideTrack.style.transform = "translateX(" + currentPosition + "px)";
    });

    guideNextBtn.addEventListener("click", function () {
      currentPosition -= cardWidth;
      guideTrack.style.transition = "transform 0.5s ease";
      guideTrack.style.transform = "translateX(" + currentPosition + "px)";
    });
  }
});
