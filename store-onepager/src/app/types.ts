export type Lang = "sv" | "en";

export type OpeningHours = {
    monFri: string;
    sat: string;
    sun: string;
};

export type SiteConfig = {
    siteName: string;
    phoneE164: string;
    phonePretty: string;
    emailPublic: string;
    instagramHandle: string;
    addressLine: string;
    gmapsQ: string;
    gmapsEmbed: string;
    googleSheetContactUrl: string;
    openingHours: OpeningHours;
};
