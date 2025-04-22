import { LightningElement } from 'lwc';

export default class Carousel extends LightningElement {
    scrollSpeed = 1;
    currentTranslate = 0;
    animationId = null;
    isDragging = false;
    startPosition = 0;
    prevTranslate = 0;
    cardWidth = 0;
    cloneCount = 0;
    isListenersRegistered = false;

    renderedCallback() {
        if (this.isListenersRegistered) return;
        this.isListenersRegistered = true;

        const carousel = this.template.querySelector(".carousel");
        const track = this.template.querySelector(".carousel__track");
        
        if (!carousel || !track) {
            console.error('Elementos do carrossel não encontrados.');
            return;
        }

        const cards = Array.from(track.children);
        this.cardWidth = cards[0].getBoundingClientRect().width;
        const visibleCardsCount = Math.ceil(carousel.offsetWidth / this.cardWidth);
        this.cloneCount = visibleCardsCount * 2;

        this.cloneCards(cards, track);
        this.startContinuousAnimation();
        this.setupEventListeners(carousel, track);
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
        const track = this.template.querySelector(".carousel__track");
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

        carousel.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startPosition = e.pageX;
            this.prevTranslate = this.currentTranslate;
            cancelAnimationFrame(this.animationId);
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const delta = e.pageX - this.startPosition;

            if (Math.abs(delta) > this.cardWidth * this.cloneCount) return;

            this.currentTranslate = this.prevTranslate + delta;
            track.style.transform = `translateX(${this.currentTranslate}px)`;
        });

        carousel.addEventListener('mouseup', () => this.handleDragEnd(track));
        carousel.addEventListener('mouseleave', () => this.handleDragEnd(track));


        carousel.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startPosition = e.touches[0].clientX;
            this.prevTranslate = this.currentTranslate;
            cancelAnimationFrame(this.animationId);
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            const delta = e.touches[0].clientX - this.startPosition;

            if (Math.abs(delta) > this.cardWidth * this.cloneCount) return;

            this.currentTranslate = this.prevTranslate + delta;
            track.style.transform = `translateX(${this.currentTranslate}px)`;
        });

        carousel.addEventListener('touchend', () => this.handleDragEnd(track));
        carousel.addEventListener('touchcancel', () => this.handleDragEnd(track));


        carousel.addEventListener('dragstart', (e) => e.preventDefault());


        carousel.addEventListener('mouseenter', () => {
            this.scrollSpeed /= 2;
        });

        carousel.addEventListener('mouseleave', () => {
            this.scrollSpeed *= 2;
        });
    }

    handleDragEnd(track) {
        if (this.isDragging) {
            this.isDragging = false;
            this.startContinuousAnimation();
        }
    }

    disconnectedCallback() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

//carrossel de videos

    addArrowScrollSupport() {
        const carousel = this.template.querySelector(".carrossel-prova-social-1");
        const leftArrow = this.template.querySelector(".container-seta-esquerda");
        const rightArrow = this.template.querySelector(".container-seta-direita");
        const cards = this.template.querySelectorAll(".card-prova-social");

        if (!carousel || cards.length === 0) {
            console.error("Elemento .carrossel-prova-social-1 ou .card-prova-social não encontrado.");
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

renderedCallback() {
    if (this.isListenersRegistered) return;
    this.isListenersRegistered = true;

    const carousel = this.template.querySelector(".carousel");
    const track = this.template.querySelector(".carousel__track");

    if (!carousel || !track) {
        console.error('Elementos do carrossel não encontrados.');
        return;
    }

    const cards = Array.from(track.children);
    this.cardWidth = cards[0].getBoundingClientRect().width;
    const visibleCardsCount = Math.ceil(carousel.offsetWidth / this.cardWidth);
    this.cloneCount = visibleCardsCount * 2;

    this.cloneCards(cards, track);
    this.startContinuousAnimation();
    this.setupEventListeners(carousel, track);


    this.addArrowScrollSupport();

    // ** Lógica para calcular a idade da ABC **
    const inaugurationYear = 1958;
    const currentYear = new Date().getFullYear();
    const experienceYears = currentYear - inaugurationYear;


    const experienceElements = this.template.querySelectorAll(".experience-years");
    if (experienceElements.length > 0) {
        experienceElements.forEach(element => {
            element.textContent = `+${experienceYears}`;
        });
    } else {
        console.error("Nenhum elemento com a classe 'experience-years' foi encontrado.");
    }
}



}