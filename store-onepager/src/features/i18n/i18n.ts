import type { Lang } from "../../app/types";
import { I18N } from "./dict";

export function t(lang: Lang, key: string): string {
    return I18N[lang][key] ?? I18N.sv[key] ?? key;
}

export function getSavedLang(): Lang {
    const v = localStorage.getItem("lang");
    return v === "en" ? "en" : "sv";
}

export function setSavedLang(lang: Lang) {
    localStorage.setItem("lang", lang);
}

export type ApplyI18nOptions = {
    onApplied?: (lang: Lang) => void;
};

export function applyI18n(lang: Lang, opts: ApplyI18nOptions = {}) {
    document.documentElement.lang = lang;

    // Text nodes
    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (!key) return;
        el.textContent = t(lang, key);
    });

    // Attribute translations: data-i18n-attr="attrName:key"
    document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((el) => {
        const spec = el.dataset.i18nAttr;
        if (!spec) return;
        // allow multiple: "aria-label:key1;title:key2"
        const parts = spec.split(";").map((p) => p.trim()).filter(Boolean);
        for (const part of parts) {
            const [attr, key] = part.split(":").map((p) => p.trim());
            if (!attr || !key) continue;
            el.setAttribute(attr, t(lang, key));
        }
    });

    // Single-flag language button state
    const flagBtn = document.querySelector<HTMLButtonElement>("[data-lang-toggle]");
    if (flagBtn) {
        const se = flagBtn.querySelector<HTMLElement>("[data-flag='se']");
        const gb = flagBtn.querySelector<HTMLElement>("[data-flag='gb']");

        if (se) se.hidden = lang !== "sv";
        if (gb) gb.hidden = lang !== "en";

        flagBtn.setAttribute("aria-label", lang === "sv" ? "Byt språk" : "Change language");
    }

    // Nav toggle label (hamburger)
    const navToggle = document.querySelector<HTMLButtonElement>(".navToggle");
    if (navToggle) {
        navToggle.setAttribute("aria-label", lang === "sv" ? "Öppna meny" : "Open menu");
    }

    opts.onApplied?.(lang);
}

export function initLangToggle(opts: ApplyI18nOptions = {}) {
    const btn = document.querySelector<HTMLButtonElement>("[data-lang-toggle]");
    if (!btn) {
        // Even if no UI, still apply translations
        applyI18n(getSavedLang(), opts);
        return;
    }

    let lang = getSavedLang();
    applyI18n(lang, opts);

    btn.addEventListener("click", () => {
        lang = lang === "sv" ? "en" : "sv";
        setSavedLang(lang);
        applyI18n(lang, opts);
    });
}

