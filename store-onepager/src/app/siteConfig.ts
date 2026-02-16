import type { SiteConfig } from "./types";

export function getSiteConfig(): SiteConfig {
    // Vite will inline these at build time; only VITE_* are exposed to the client.
    const env = import.meta.env as Record<string, string | boolean | undefined>;

    const phoneE164 = (env.VITE_PHONE_E164 as string) || "+46701234567";

    return {
        siteName: (env.VITE_SITE_NAME as string) || "FirstClassTvätt",
        phoneE164,
        phonePretty: (env.VITE_PHONE_PRETTY as string) || formatPhonePretty(phoneE164),
        emailPublic: (env.VITE_EMAIL_PUBLIC as string) || "firstklasswash@gmail.com",
        instagramHandle: (env.VITE_INSTAGRAM_HANDLE as string) || "@store",
        addressLine: (env.VITE_ADDRESS_LINE as string) || "Gamla Flygplatsvägen 10, 423 37 Torslanda",
        gmapsQ:
            (env.VITE_GMAPS_Q as string) ||
            "https://maps.app.goo.gl/4g7cRCaZffvWtQRH8",
        gmapsEmbed:
            (env.VITE_GMAPS_EMBED as string) ||
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1981.4191844361378!2d11.78014767681938!3d57.71179627387179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464f8c1fcd8e5ad7%3A0xcef4eadf1edb33b!2sGamla%20Flygplatsv%C3%A4gen%2010%2C%20423%2037%20Torslanda%2C%20Sverige!5e1!3m2!1ssv!2sus!4v1771194095977!5m2!1ssv!2sus",
        googleSheetContactUrl: (env.VITE_GOOGLE_SHEET_CONTACT_URL as string) || "",
        openingHours: {
            monFri: (env.VITE_HOURS_MON_FRI as string) || "10–19",
            sat: (env.VITE_HOURS_SAT as string) || "10–17",
            sun: (env.VITE_HOURS_SUN as string) || "10–17",
        },
    };
}

/** Format E164 phone to a readable Swedish format */
function formatPhonePretty(e164: string): string {
    // +46701234567 -> +46 70 123 45 67
    const match = e164.match(/^\+46(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
        return `+46 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return e164;
}

export function applySiteConfig(cfg = getSiteConfig()) {
    // Brand / copy
    document.querySelectorAll<HTMLElement>("[data-site-name]").forEach((el) => {
        el.textContent = cfg.siteName;
    });

    // Footer year
    document.querySelectorAll<HTMLElement>("[data-year]").forEach((el) => {
        el.textContent = String(new Date().getFullYear());
    });

    // Title uses JS fallback if you want branding to match; keep the HTML <title> as baseline.
    if (document.title.includes("FirstClassTvätt") && cfg.siteName !== "FirstClassTvätt") {
        document.title = document.title.replace("FirstClassTvätt", cfg.siteName);
    }

    // Phone links
    document.querySelectorAll<HTMLAnchorElement>("a[data-phone]").forEach((a) => {
        a.href = `tel:${cfg.phoneE164}`;
        // Show pretty format in the link text
        if (!a.hasAttribute("data-i18n")) {
            a.textContent = cfg.phonePretty;
        }
    });

    // Email
    document.querySelectorAll<HTMLAnchorElement>("a[data-email]").forEach((a) => {
        a.href = `mailto:${cfg.emailPublic}`;
        a.textContent = cfg.emailPublic;
    });

    // Instagram
    document.querySelectorAll<HTMLAnchorElement>("a[data-instagram]").forEach((a) => {
        const handle = cfg.instagramHandle.startsWith("@") ? cfg.instagramHandle : `@${cfg.instagramHandle}`;
        a.textContent = handle;
        const username = handle.replace(/^@/, "");
        a.href = `https://instagram.com/${username}`;
    });

    // Address
    document.querySelectorAll<HTMLElement>("[data-address]").forEach((el) => {
        el.textContent = cfg.addressLine;
    });

    // Google Maps link
    document.querySelectorAll<HTMLAnchorElement>("a[data-gmaps]").forEach((a) => {
        a.href = cfg.gmapsQ;
    });

    // Google Maps embed
    document.querySelectorAll<HTMLIFrameElement>("iframe[data-gmaps-embed]").forEach((iframe) => {
        iframe.src = cfg.gmapsEmbed;
    });

    // Opening hours
    document.querySelectorAll<HTMLElement>("[data-hours-monfri]").forEach((el) => {
        el.textContent = cfg.openingHours.monFri;
    });
    document.querySelectorAll<HTMLElement>("[data-hours-sat]").forEach((el) => {
        el.textContent = cfg.openingHours.sat;
    });
    document.querySelectorAll<HTMLElement>("[data-hours-sun]").forEach((el) => {
        el.textContent = cfg.openingHours.sun;
    });

    return cfg;
}
