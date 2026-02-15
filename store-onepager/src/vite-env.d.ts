declare interface ImportMetaEnv {
  readonly VITE_SITE_NAME?: string;
  readonly VITE_EMAIL_PUBLIC?: string;
  readonly VITE_PHONE_E164?: string;
  readonly VITE_PHONE_PRETTY?: string;
  readonly VITE_ADDRESS_LINE?: string;
  readonly VITE_GMAPS_Q?: string;
  readonly VITE_GMAPS_EMBED?: string;
  readonly VITE_HOURS_MON_FRI?: string;
  readonly VITE_HOURS_SAT?: string;
  readonly VITE_HOURS_SUN?: string;
  readonly VITE_GOOGLE_SHEET_CONTACT_URL?: string;
  readonly VITE_INSTAGRAM_HANDLE?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
