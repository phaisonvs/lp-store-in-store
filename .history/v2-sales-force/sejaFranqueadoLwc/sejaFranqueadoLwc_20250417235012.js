import { LightningElement, track } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import SPLIDE_JS from "@salesforce/resourceUrl/splide";
import SPLIDE_CSS from "@salesforce/resourceUrl/splideCSS";

export default class SejaFranqueadoLwc extends LightningElement {
  @track testimonials = [
    {
      id: "1",
      title: "História de Sucesso 1",
      description: "Depoimento inspirador sobre a jornada como franqueado.",
      thumbnailUrl: "/assets/thumbnail1.jpg",
      videoId: "VIDEO_ID_1",
    },
    {
      id: "2",
      title: "História de Sucesso 2",
      description: "Outro depoimento sobre crescimento e realização.",
      thumbnailUrl: "/assets/thumbnail2.jpg",
      videoId: "VIDEO_ID_2",
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
  @track currentSlide = 0;
  @track totalSlides = this.testimonials.length;
  @track slideWidth = 0;
  @track carrosselStyle = "";

  splideInstance;
  isLibLoaded = false;

  connectedCallback() {
    Promise.all([loadScript(this, SPLIDE_JS), loadScript(this, SPLIDE_CSS)])
      .then(() => {
        this.isLibLoaded = true;
        this.initializeCarousel();
        this.setupScrollAnimations();
        this.setupParallax();
        this.updateCarrosselPosition();
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

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;

      if (section) {
        section.style.backgroundPositionY = `${rate}px`;
      }

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
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
    if (this.splideInstance) {
      this.splideInstance.destroy();
    }
    window.removeEventListener("scroll", this.setupParallax);
  }

  get carrosselStyle() {
    return `transform: translateX(-${this.currentSlide * 100}%);`;
  }

  get isPrevDisabled() {
    return this.currentSlide === 0;
  }

  get isNextDisabled() {
    return this.currentSlide >= this.testimonials.length - 1;
  }
}
