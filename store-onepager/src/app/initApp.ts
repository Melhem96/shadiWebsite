import { applySiteConfig, getSiteConfig } from "./siteConfig";
import { initThemeToggle } from "../features/theme/theme";
import { getSavedLang, initLangToggle } from "../features/i18n/i18n";
import { renderPricing, renderTireServices, renderRekondServices } from "../features/pricing/pricing";
import { initNav } from "../features/nav/nav";
import { initCarousel } from "../features/carousel/carousel";
import { initHeroSlider } from "../features/heroSlider/heroSlider";
import { initContactForm } from "../features/contact/contactForm";

export function initApp() {
    // Apply config first (updates header/footer name, links, etc.)
    const cfg = applySiteConfig();

    // Theme before anything else to reduce flash
    initThemeToggle();

    // Ensure pricing exists before i18n applies text
    const lang = getSavedLang();
    renderPricing(lang, cfg);
    renderTireServices(lang, cfg);
    renderRekondServices(lang, cfg);

    // I18n applies text and triggers re-render callback when language changes
    initLangToggle({
        onApplied(lang) {
            const cfg = getSiteConfig();
            renderPricing(lang, cfg);
            renderTireServices(lang, cfg);
            renderRekondServices(lang, cfg);
        },
    });

    initNav();
    initCarousel();
    initHeroSlider();
    initContactForm();
}

