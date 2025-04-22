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
      videoId: "video1",
      thumbnailStyle: "background-image: url('/assets/thumbnail1.jpg')",
    },
    {
      id: "2",
      title: "Maria Santos",
      description: "Franqueada há 3 anos",
      videoId: "video2",
      thumbnailStyle: "background-image: url('/assets/thumbnail2.jpg')",
    },
    {
      id: "3",
      title: "Pedro Oliveira",
      description: "Franqueado há 7 anos",
      videoId: "video3",
      thumbnailStyle: "background-image: url('/assets/thumbnail3.jpg')",
    },
  ];

  @track isVideoModalOpen = false;
  @track activeVideoUrl = "";
  currentSlide = 0;
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
    this.dispatchEvent(new CustomEvent("primaryaction"));
  }

  handleVideoClick(event) {
    const videoId = event.currentTarget.dataset.videoId;
    // Aqui você pode definir a URL do vídeo com base no videoId
    this.activeVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    this.isVideoModalOpen = true;
  }

  handlePrevClick() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateCarouselPosition();
    }
  }

  handleNextClick() {
    if (this.currentSlide < this.testimonials.length - 1) {
      this.currentSlide++;
      this.updateCarouselPosition();
    }
  }

  updateCarouselPosition() {
    if (this.carouselElement) {
      const position = -this.currentSlide * this.slideWidth;
      this.carouselElement.style.transform = `translateX(${position}px)`;
    }
  }

  closeVideoModal() {
    this.isVideoModalOpen = false;
    this.activeVideoUrl = "";
  }

  disconnectedCallback() {
    if (this.splideInstance) {
      this.splideInstance.destroy();
    }
    window.removeEventListener("scroll", this.setupParallax);
  }
}
