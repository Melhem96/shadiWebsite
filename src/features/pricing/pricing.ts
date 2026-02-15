import type { Lang, SiteConfig } from "../../app/types";
import pricingConfig from "../../pricing.config.json";
import { t } from "../i18n/i18n";

type PricingCTA = {
    href: string;
    class: string;
    labelKey: string;
};

type PricingCardConfig = {
    id: string;
    featured?: boolean;
    badgeKey?: string;
    titleKey: string;
    subtitleKey: string;
    price: string;
    time?: string;
    priceNote?: string;
    listKeys: string[];
    cta: PricingCTA;
};

type AddonConfig = {
    id: string;
    titleKey: string;
    price: string;
};

type ServiceSection = {
    sectionKey?: string;
    badgeKey?: string;
    disclaimerKey?: string;
    cards: PricingCardConfig[];
};

type DiscountConfig = {
    enabled: boolean;
    badgeKey: string;
    textKey: string;
    noteKey: string;
};

type PricingConfig = {
    tagline?: string;
    discount?: DiscountConfig;
    washPackages: ServiceSection;
    addons?: AddonConfig[];
    tireServices: ServiceSection;
    rekondServices: ServiceSection;
};

function renderCard(card: PricingCardConfig, lang: Lang, cfg: SiteConfig, badgeKey?: string): HTMLElement {
    const art = document.createElement("article");
    art.className = `priceCard${card.featured ? " isFeatured" : ""}`;

    if (card.featured) {
        const badge = document.createElement("div");
        badge.className = "badge";
        badge.dataset.i18n = card.badgeKey ?? badgeKey ?? "sections.packages.badge";
        badge.textContent = t(lang, badge.dataset.i18n);
        art.appendChild(badge);
    }

    const header = document.createElement("header");
    header.className = "priceHeader";

    const h3 = document.createElement("h3");
    h3.dataset.i18n = card.titleKey;
    h3.textContent = t(lang, card.titleKey);

    const sub = document.createElement("p");
    sub.className = "muted";
    sub.dataset.i18n = card.subtitleKey;
    sub.textContent = t(lang, card.subtitleKey);

    header.appendChild(h3);
    header.appendChild(sub);
    art.appendChild(header);

    const priceWrap = document.createElement("div");
    priceWrap.className = "priceValue";
    priceWrap.textContent = card.price;

    if (card.time) {
        const timeEl = document.createElement("span");
        timeEl.className = "priceTime";
        timeEl.textContent = `⏱️ ${card.time}`;
        priceWrap.appendChild(timeEl);
    }

    if (card.priceNote) {
        const noteEl = document.createElement("span");
        noteEl.className = "priceNote";
        noteEl.dataset.i18n = card.priceNote;
        noteEl.textContent = t(lang, card.priceNote);
        priceWrap.appendChild(noteEl);
    }

    art.appendChild(priceWrap);

    const ul = document.createElement("ul");
    ul.className = "priceList";

    for (const key of card.listKeys) {
        const li = document.createElement("li");
        li.dataset.i18n = key;
        li.textContent = t(lang, key);
        ul.appendChild(li);
    }

    art.appendChild(ul);

    const a = document.createElement("a");
    a.className = card.cta.class;
    a.dataset.i18n = card.cta.labelKey;
    a.textContent = t(lang, card.cta.labelKey);

    const href = card.cta.href.replace("{phone}", cfg.phoneE164);
    a.href = href;
    if (href.startsWith("tel:")) {
        a.dataset.phone = "";
    }

    art.appendChild(a);
    return art;
}

function renderAddons(addons: AddonConfig[], lang: Lang): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "addonsRow";

    for (const addon of addons) {
        const item = document.createElement("div");
        item.className = "addonItem";

        const title = document.createElement("span");
        title.className = "addonTitle";
        title.dataset.i18n = addon.titleKey;
        title.textContent = t(lang, addon.titleKey);

        const price = document.createElement("span");
        price.className = "addonPrice";
        price.textContent = addon.price;

        item.appendChild(title);
        item.appendChild(price);
        wrap.appendChild(item);
    }

    return wrap;
}

function renderDiscount(discount: DiscountConfig, lang: Lang): HTMLElement {
    const banner = document.createElement("div");
    banner.className = "discountBanner";

    const badgeEl = document.createElement("span");
    badgeEl.className = "discountBadge";
    badgeEl.dataset.i18n = discount.badgeKey;
    badgeEl.textContent = t(lang, discount.badgeKey);

    const textEl = document.createElement("span");
    textEl.className = "discountText";
    textEl.dataset.i18n = discount.textKey;
    textEl.textContent = t(lang, discount.textKey);

    const noteEl = document.createElement("span");
    noteEl.className = "discountNote";
    noteEl.dataset.i18n = discount.noteKey;
    noteEl.textContent = t(lang, discount.noteKey);

    banner.appendChild(badgeEl);
    banner.appendChild(textEl);
    banner.appendChild(noteEl);

    return banner;
}

export function renderPricing(lang: Lang, cfg: SiteConfig) {
    const root = document.querySelector<HTMLElement>("[data-pricing]");
    if (!root) return;

    const pcfg = pricingConfig as PricingConfig;
    root.innerHTML = "";

    // Render discount banner if enabled
    if (pcfg.discount?.enabled) {
        root.appendChild(renderDiscount(pcfg.discount, lang));
    }

    // Render wash packages
    const washGrid = document.createElement("div");
    washGrid.className = "pricingGrid pricingGrid--4";

    for (const card of pcfg.washPackages.cards) {
        washGrid.appendChild(renderCard(card, lang, cfg, pcfg.washPackages.badgeKey));
    }

    root.appendChild(washGrid);

    // Render addons
    if (pcfg.addons && pcfg.addons.length > 0) {
        root.appendChild(renderAddons(pcfg.addons, lang));
    }
}

export function renderTireServices(lang: Lang, cfg: SiteConfig) {
    const root = document.querySelector<HTMLElement>("[data-tires]");
    if (!root) return;

    const pcfg = pricingConfig as PricingConfig;
    root.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "pricingGrid pricingGrid--4";

    for (const card of pcfg.tireServices.cards) {
        grid.appendChild(renderCard(card, lang, cfg, pcfg.tireServices.sectionKey));
    }

    root.appendChild(grid);
}

export function renderRekondServices(lang: Lang, cfg: SiteConfig) {
    const root = document.querySelector<HTMLElement>("[data-rekond]");
    if (!root) return;

    const pcfg = pricingConfig as PricingConfig;
    root.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "pricingGrid pricingGrid--3";

    for (const card of pcfg.rekondServices.cards) {
        grid.appendChild(renderCard(card, lang, cfg));
    }

    root.appendChild(grid);

    // Add disclaimer
    if (pcfg.rekondServices.disclaimerKey) {
        const disclaimer = document.createElement("p");
        disclaimer.className = "muted disclaimer";
        disclaimer.dataset.i18n = pcfg.rekondServices.disclaimerKey;
        disclaimer.textContent = t(lang, pcfg.rekondServices.disclaimerKey);
        root.appendChild(disclaimer);
    }
}
