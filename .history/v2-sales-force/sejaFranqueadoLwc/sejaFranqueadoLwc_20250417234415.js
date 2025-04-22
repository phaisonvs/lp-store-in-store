import { LightningElement, track } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import SPLIDE_JS from "@salesforce/resourceUrl/splide";
import SPLIDE_CSS from "@salesforce/resourceUrl/splideCSS";

export default class SejaFranqueadoLwc extends LightningElement {
  @track testimonials = [
    {
      id: "1",
      videoId: "video1",
      thumbnail: "/assets/thumbnail1.jpg",
      title: "Depoimento 1",
    },
    // Adicione mais depoimentos conforme necessário
  ];

  splideInstance;
  isLibLoaded = false;

  connectedCallback() {
    Promise.all([loadScript(this, SPLIDE_JS), loadScript(this, SPLIDE_CSS)])
      .then(() => {
        this.isLibLoaded = true;
        this.initializeCarousel();
        this.setupScrollAnimations();
      })
      .catch((error) => {
        console.error("Erro ao carregar recursos:", error);
      });
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

  handlePrimaryClick() {
    // Implementar lógica do botão principal
    this.dispatchEvent(new CustomEvent("primaryaction"));
  }

  handleVideoClick(event) {
    const videoId = event.currentTarget.dataset.videoId;
    // Implementar lógica de reprodução do vídeo
    this.dispatchEvent(
      new CustomEvent("videoplay", {
        detail: { videoId },
      })
    );
  }

  handlePrevClick() {
    if (this.splideInstance) {
      this.splideInstance.go("<");
    }
  }

  handleNextClick() {
    if (this.splideInstance) {
      this.splideInstance.go(">");
    }
  }

  disconnectedCallback() {
    if (this.splideInstance) {
      this.splideInstance.destroy();
    }
  }
}
