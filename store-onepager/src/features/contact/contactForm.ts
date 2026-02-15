import { getSiteConfig } from "../../app/siteConfig";
import { getSavedLang, t } from "../i18n/i18n";

type AppsScriptResponse = { ok?: boolean; error?: string };

type ContactPayload = {
    name: string;
    email: string;
    message: string;
    lang: string;
    pageUrl: string;
};

export function initContactForm() {
    const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
    if (!form) return;

    const statusEl = form.querySelector<HTMLElement>(".formStatus");
    const submitBtn = form.querySelector<HTMLButtonElement>("button[type='submit']");

    const setStatus = (msg: string, tone: "success" | "error") => {
        if (!statusEl) return;
        statusEl.hidden = false;
        statusEl.textContent = msg;
        statusEl.dataset.tone = tone;
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const lang = getSavedLang();

        const fd = new FormData(form);
        const name = String(fd.get("name") ?? "").trim();
        const email = String(fd.get("email") ?? "").trim();
        const message = String(fd.get("message") ?? "").trim();

        // Honeypot
        const bot = String(fd.get("bot-field") ?? "").trim();
        if (bot) {
            setStatus(t(lang, "form.status.bot"), "success");
            form.reset();
            return;
        }

        if (!name || !email || !message) {
            setStatus(t(lang, "form.status.missing"), "error");
            return;
        }

        const cfg = getSiteConfig();
        const endpoint = cfg.googleSheetContactUrl;
        if (!endpoint) {
            setStatus(t(lang, "form.status.misconfigured"), "error");
            return;
        }

        if (submitBtn) submitBtn.disabled = true;
        if (statusEl) statusEl.hidden = true;

        try {
            setStatus(t(lang, "form.status.sending"), "success");

            const payload: ContactPayload = {
                name,
                email,
                message,
                lang,
                pageUrl: window.location.href,
            };

            // Google Apps Script Web Apps often don't include proper CORS headers.
            // Using no-cors succeeds as a fire-and-forget request, but we can't read the response.
            const res = await fetch(endpoint, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // If mode=no-cors, this will be an opaque response and res.ok is always false.
            // So we treat the request as successful if it didn't throw.
            const isOpaque = res.type === "opaque";
            if (isOpaque) {
                setStatus(t(lang, "form.status.success"), "success");
                form.reset();
                return;
            }

            const data = (await res.json().catch(() => null)) as AppsScriptResponse | null;

            if (!res.ok || !data?.ok) {
                const errMsg = data?.error ? `${t(lang, "form.status.error")} ${data.error}` : t(lang, "form.status.error");
                setStatus(errMsg, "error");
                return;
            }

            setStatus(t(lang, "form.status.success"), "success");
            form.reset();
        } catch {
            setStatus(t(lang, "form.status.network"), "error");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}
