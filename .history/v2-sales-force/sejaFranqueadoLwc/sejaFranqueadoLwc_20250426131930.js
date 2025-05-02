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

  connectedCallback() {
    Promise.all([loadScript(this, SPLIDE_JS), loadScript(this, SPLIDE_CSS)])
      .then(() => {
        this.isLibLoaded = true;
        this.initializeCarousel();
        this.setupScrollAnimations();
        this.setupParallax();
      })
      .catch((error) => {
        console.error("Erro ao carregar recursos:", error);
      });
  }

  renderedCallback() {
    if (!this.carouselElement) {
      this.carouselElement = this.template.querySelector(
        ".carrossel-prova-social-1"
      );
      if (this.carouselElement) {
        this.slideWidth = this.carouselElement.offsetWidth;
        this.updateCarrosselPosition();
      }
    }

    if (this.modalOpen) {
      this.template.querySelector(".modal-close").focus();
    }
  }

  initializeCarousel() {
    if (!this.isLibLoaded) return;

    const container = this.template.querySelector(".carrossel-prova-social-1");
    if (!container) return;

    this.splideInstance = new Splide(container, {
      type: "slide",
      perPage: 3,
      gap: "1rem",
      pagination: false,
      breakpoints: {
        768: {
          perPage: 1,
        },
        1024: {
          perPage: 2,
        },
      },
    });

    this.splideInstance.mount();
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    this.template.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observer.observe(element);
    });
  }

  setupParallax() {
    let ticking = false;
    const section = this.template.querySelector(".seja-um-franqueado");

    window.addEventListener("scroll", () => {
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
    });
  }

  handlePrimaryClick() {
    // Implementar lógica do botão principal
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
        thumbnailUrl: depoimento.thumbnail, // Apenas o URL
      };
    });
  }

  get carrosselStyle() {
    const slidesPerView = this.getSlidesPerView();
    const totalItems = this.depoimentos.length;
    const maxSlide = Math.max(0, Math.ceil(totalItems / slidesPerView) - 1);
    const actualSlide = Math.min(this.currentSlide, maxSlide);

    // Calcula o deslocamento baseado no slide atual e slides por view
    // A lógica pode precisar de ajuste fino dependendo do comportamento exato desejado
    const percentageOffset = actualSlide * (100 / slidesPerView);

    // Adiciona um pequeno deslocamento baseado no gap (ajuste conforme necessário)
    const gapOffset =
      (actualSlide *
        (parseFloat(
          getComputedStyle(this.template.host).getPropertyValue(
            "--carousel-slide-gap"
          )
        ) || 0)) /
      slidesPerView;

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

  get totalSlides() {
    const slidesPerView = this.getSlidesPerView();
    return Math.ceil(this.depoimentos.length / slidesPerView);
  }

  get totalSlides() {
    const slidesPerView = this.getSlidesPerView();
    return Math.ceil(this.depoimentos.length / slidesPerView);
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

  get totalSlides() {
    const slidesPerView = this.getSlidesPerView();
    return Math.ceil(this.depoimentos.length / slidesPerView);
  }

  get totalSlides() {
    const slidesPerView = this.getSlidesPerView();
    return Math.ceil(this.depoimentos.length / slidesPerView);
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
    if (this.splideInstance) {
      this.splideInstance.destroy();
    }
    window.removeEventListener("scroll", this.setupParallax);
  }
}
