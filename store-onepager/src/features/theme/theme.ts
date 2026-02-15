export type Theme = "dark" | "light";

export function getSavedTheme(): Theme | null {
    const v = localStorage.getItem("theme");
    if (v === "light" || v === "dark") return v;
    return null;
}

export function setSavedTheme(theme: Theme) {
    localStorage.setItem("theme", theme);
}

export function getPreferredTheme(): Theme {
    const saved = getSavedTheme();
    if (saved) return saved;
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
    return prefersLight ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;

    const btn = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
    if (!btn) return;

    const sun = btn.querySelector<HTMLElement>("[data-theme-icon='sun']");
    const moon = btn.querySelector<HTMLElement>("[data-theme-icon='moon']");

    const showSun = theme === "dark";
    if (sun) sun.hidden = !showSun;
    if (moon) moon.hidden = showSun;

    btn.setAttribute("aria-label", showSun ? "Switch to light theme" : "Switch to dark theme");
}

export function initThemeToggle() {
    const btn = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");

    let theme = getPreferredTheme();
    applyTheme(theme);

    if (!btn) return;

    btn.addEventListener("click", () => {
        theme = theme === "dark" ? "light" : "dark";
        setSavedTheme(theme);
        applyTheme(theme);
    });
}

