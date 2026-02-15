export function initNav() {
    const toggle = document.querySelector<HTMLButtonElement>(".navToggle");
    const links = document.querySelector<HTMLElement>(".navLinks");

    if (!toggle || !links) return;

    const setOpen = (open: boolean) => {
        links.dataset.open = String(open);
        toggle.setAttribute("aria-expanded", String(open));
    };

    const isOpen = () => links.dataset.open === "true";

    toggle.addEventListener("click", () => setOpen(!isOpen()));

    // Close when a link is clicked
    links.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
        a.addEventListener("click", () => setOpen(false));
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (!isOpen()) return;
        setOpen(false);
        toggle.focus();
    });

    // Close on outside click/tap
    document.addEventListener("pointerdown", (e) => {
        if (!isOpen()) return;
        const target = e.target as Node | null;
        if (!target) return;
        if (toggle.contains(target) || links.contains(target)) return;
        setOpen(false);
    });
}

