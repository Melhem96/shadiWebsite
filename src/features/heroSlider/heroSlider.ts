export function initHeroSlider() {
    const slidesRoot = document.querySelector<HTMLElement>("[data-hero-slides]");
    const slides = slidesRoot
        ? Array.from(slidesRoot.querySelectorAll<HTMLImageElement>(".heroSlide"))
        : [];

    if (slides.length === 0) return;

    let index = 0;
    let timer: number | undefined;

    function show(i: number) {
        slides.forEach((img, idx) => {
            const active = idx === i;
            img.classList.toggle("is-active", active);
            img.setAttribute("aria-hidden", String(!active));
        });
    }

    function start() {
        if (slides.length <= 1) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            show(0);
            return;
        }

        timer = window.setInterval(() => {
            index = (index + 1) % slides.length;
            show(index);
        }, 5000);
    }

    function stop() {
        if (timer !== undefined) {
            clearInterval(timer);
            timer = undefined;
        }
    }

    show(0);
    start();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
        else start();
    });
}

