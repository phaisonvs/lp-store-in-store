import { LightningElement, track } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import SPLIDE_JS from "@salesforce/resourceUrl/splide";
import SPLIDE_CSS from "@salesforce/resourceUrl/splideCSS";

export default class SejaFranqueadoLwc extends LightningElement {
  @track depoimentos = [
    {
      id: 1,
      thumbnail: "/assets/images/depoimento-1.jpg",
      videoUrl: "https://www.youtube.com/embed/VIDEO_ID_1",
      nome: "João Silva",
      cidade: "São Paulo, SP",
    },
    {
      id: 2,
      thumbnail: "/assets/images/depoimento-2.jpg",
      videoUrl: "https://www.youtube.com/embed/VIDEO_ID_2",
      nome: "Maria Santos",
      cidade: "Rio de Janeiro, RJ",
    },
    {
      id: 3,
      thumbnail: "/assets/images/depoimento-3.jpg",
      videoUrl: "https://www.youtube.com/embed/VIDEO_ID_3",
      nome: "Pedro Oliveira",
      cidade: "Belo Horizonte, MG",
    },
  ];

  @track currentSlide = 0;
  @track modalOpen = false;
  @track selectedVideo = "";
  @track isAnimating = false;

  splideInstance;
  isLibLoaded = false;
  _scrollAnimationObserver;
  _boundScrollHandler; // Para remover o listener corretamente

  connectedCallback() {
    Promise.all([loadScript(this, SPLIDE_JS), loadScript(this, SPLIDE_CSS)])
      .then(() => {
        this.isLibLoaded = true;
        this.initializeCarousel();
      })
      .catch((error) => {
        console.error("Erro ao carregar recursos do Splide:", error);
      });
    // Iniciar animações e parallax independentemente do Splide
    this.setupScrollAnimations();
    this.setupParallax();
  }

  renderedCallback() {
    if (this.modalOpen) {
      this.template.querySelector(".modal-close").focus();
    }
  }

  initializeCarousel() {
    // Inicializa o carrossel se necessário
  }

  setupScrollAnimations() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px",
    };

    this._scrollAnimationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            // Se o elemento visível for um .numero-item, animar o contador interno
            if (entry.target.classList.contains("numero-item")) {
              const numberElement = entry.target.querySelector(".number");
              if (numberElement && !numberElement.dataset.animated) {
                this.animateCounter(numberElement);
                numberElement.dataset.animated = "true"; // Marca como animado
              }
            }
            // Opcional: Desconectar observer após animação para performance
            // observer.unobserve(entry.target);
          }
        });
      },
      options
    );

    this.template.querySelectorAll(".animate-on-scroll").forEach((element) => {
      this._scrollAnimationObserver.observe(element);
    });
  }

  animateCounter(element) {
    const textContent = element.textContent;
    const targetValue = parseInt(textContent.replace(/\D/g, ""), 10);
    const prefix = textContent.replace(/[\d.,]+.*/, ""); // Captura +, etc.
    const suffix = textContent.replace(
      /.*?(\d+|\d{1,3}(?:[.,]\d{3})*)(.*)/,
      "$2"
    ); // Captura %, anos, etc.

    if (isNaN(targetValue)) {
      console.warn("animateCounter: Target value is not a number", element);
      return;
    }

    const duration = 1500; // Duração da animação em ms
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * targetValue);

      element.textContent = `${prefix}${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  setupParallax() {
    let ticking = false;
    const section = this.template.querySelector(".seja-um-franqueado");

    // Guardar a referência da função com bind para poder remover depois
    this._boundScrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * 0.5;

          if (section) {
            section.style.backgroundPosition = `center ${rate}px`;
          }

          ticking = false;
        });

        ticking = true;
      }
    };
    window.addEventListener("scroll", this._boundScrollHandler);
  }

  handlePrimaryClick() {
    console.log("Botão primário clicado");
  }

  getSlidesPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  get slides() {
    const slidesPerView = this.getSlidesPerView();
    const totalSlides = Math.ceil(this.depoimentos.length / slidesPerView);
    return Array.from({ length: totalSlides }, (_, i) => i);
  }

  get computedDepoimentos() {
    return this.depoimentos.map((depoimento) => {
      return {
        ...depoimento,
        thumbnailUrl: depoimento.thumbnail,
      };
    });
  }

  get carrosselStyle() {
    const slidesPerView = this.getSlidesPerView();
    const totalItems = this.depoimentos.length;
    const maxSlide = Math.max(0, Math.ceil(totalItems / slidesPerView) - 1);
    const actualSlide = Math.min(this.currentSlide, maxSlide);

    const percentageOffset = actualSlide * (100 / slidesPerView);
    const gapValue =
      parseFloat(
        getComputedStyle(this.template.host).getPropertyValue(
          "--carousel-slide-gap"
        )
      ) || 0;
    const gapOffset = (actualSlide * gapValue) / slidesPerView;

    const transform = `translateX(calc(-${percentageOffset}% - ${gapOffset}px))`;
    return `transform: ${transform};`;
  }

  get showPrevButton() {
    return this.currentSlide > 0;
  }

  get showNextButton() {
    const slidesPerView = this.getSlidesPerView();
    const totalItems = this.depoimentos.length;
    const maxSlide = Math.ceil(totalItems / slidesPerView) - 1;
    return this.currentSlide < maxSlide;
  }

  handlePrevSlide() {
    if (this.isAnimating || !this.showPrevButton) return;
    this.animateSlide(this.currentSlide - 1);
  }

  handleNextSlide() {
    if (this.isAnimating || !this.showNextButton) return;
    this.animateSlide(this.currentSlide + 1);
  }

  animateSlide(newSlide) {
    this.isAnimating = true;
    this.currentSlide = newSlide;

    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  openModal(event) {
    const videoUrl = event.currentTarget.dataset.video;
    this.selectedVideo = videoUrl;
    this.modalOpen = true;
  }

  closeModal() {
    this.selectedVideo = "";
    this.modalOpen = false;
  }

  handleKeyDown(event) {
    if (event.key === "Escape") {
      this.closeModal();
    }
  }

  handleVideoClick(event) {
    const videoId = event.currentTarget.dataset.videoId;
    this.currentVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    this.isVideoModalOpen = true;
  }

  handlePrevClick() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateCarrosselPosition();
    }
  }

  handleNextClick() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.updateCarrosselPosition();
    }
  }

  updateCarrosselPosition() {
    const slideWidth = 100 / this.totalSlides;
    const offset = -this.currentSlide * slideWidth;
    this.carrosselStyle = `transform: translateX(${offset}%)`;
  }

  handleModalClick(event) {
    if (event.target === event.currentTarget) {
      this.closeVideoModal();
    }
  }

  handleModalContentClick(event) {
    event.stopPropagation();
  }

  closeVideoModal() {
    this.isVideoModalOpen = false;
    this.currentVideoUrl = "";
  }

  disconnectedCallback() {
    if (this._scrollAnimationObserver) {
      this._scrollAnimationObserver.disconnect();
    }
    if (this._boundScrollHandler) {
      window.removeEventListener("scroll", this._boundScrollHandler);
    }
    // Adicionar limpeza do Splide se ele for inicializado
    // if (this.splideInstance) {
    //     this.splideInstance.destroy();
    // }
  }
}
