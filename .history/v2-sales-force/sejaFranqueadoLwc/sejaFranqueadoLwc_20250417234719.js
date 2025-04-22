import { LightningElement, track } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import SPLIDE_JS from "@salesforce/resourceUrl/splide";
import SPLIDE_CSS from "@salesforce/resourceUrl/splideCSS";

export default class SejaFranqueadoLwc extends LightningElement {
  @track testimonials = [
    {
      id: "1",
      title: "João Silva",
      description: "Franqueado há 5 anos",
      thumbnailStyle: "background-image: url('/assets/thumbnail1.jpg')",
      videoId: "video1",
    },
    {
      id: "2",
      title: "Maria Santos",
      description: "Franqueada há 3 anos",
      thumbnailStyle: "background-image: url('/assets/thumbnail2.jpg')",
      videoId: "video2",
    },
    {
      id: "3",
      title: "Pedro Oliveira",
      description: "Franqueado há 7 anos",
      thumbnailStyle: "background-image: url('/assets/thumbnail3.jpg')",
      videoId: "video3",
    },
  ];

  @track isVideoModalOpen = false;
  @track currentVideoUrl = "";
  currentSlide = 0;
  totalSlides = this.testimonials.length;
  slideWidth = 0;
  carouselElement = null;

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
        this.updateCarouselPosition();
      }
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
            section.style.backgroundPosition = `center ${-rate}px`;
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

  handleVideoClick(event) {
    const videoId = event.currentTarget.dataset.videoId;
    this.currentVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    this.isVideoModalOpen = true;
  }

  handlePrevClick() {
    this.currentSlide =
      (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  handleNextClick() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }

  updateCarousel() {
    const carousel = this.template.querySelector(".carrossel-prova-social-1");
    const slideWidth = carousel.offsetWidth;
    carousel.style.transform = `translateX(-${
      this.currentSlide * slideWidth
    }px)`;
  }

  handleModalClick(event) {
    this.closeVideoModal();
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
