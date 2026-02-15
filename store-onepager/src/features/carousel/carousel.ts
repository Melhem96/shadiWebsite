export function initCarousel() {
    const carouselMaybe = document.querySelector<HTMLElement>("#galleryCarousel");
    const prevBtnMaybe = document.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const nextBtnMaybe = document.querySelector<HTMLButtonElement>("[data-carousel-next]");

    if (!carouselMaybe || !prevBtnMaybe || !nextBtnMaybe) return;

    const carouselEl = carouselMaybe;
    const prevBtnEl = prevBtnMaybe;
    const nextBtnEl = nextBtnMaybe;

    const readGapPx = () => {
        const gap = getComputedStyle(carouselEl).gap;
        const parsed = Number.parseFloat(gap);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    function updateButtons() {
        const maxScrollLeft = carouselEl.scrollWidth - carouselEl.clientWidth;
        prevBtnEl.disabled = carouselEl.scrollLeft <= 2;
        nextBtnEl.disabled = carouselEl.scrollLeft >= maxScrollLeft - 2;
    }

    function scrollStep(direction: -1 | 1) {
        const firstSlide = carouselEl.querySelector<HTMLElement>(".slide");
        const step = (firstSlide?.clientWidth ?? 400) + readGapPx();
        carouselEl.scrollBy({ left: direction * step, behavior: "smooth" });
    }

    prevBtnEl.addEventListener("click", () => scrollStep(-1));
    nextBtnEl.addEventListener("click", () => scrollStep(1));

    carouselEl.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    // Keyboard support when carousel is focused
    carouselEl.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollStep(-1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollStep(1);
        }
    });

    requestAnimationFrame(updateButtons);
}

