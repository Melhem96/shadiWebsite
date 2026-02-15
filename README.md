# store-onepager (FirstClassTvätt)

A modern Vite one-pager for car wash services with i18n support, dynamic pricing, and a contact form.

## Quick Start

```bash
npm install
cp .env.template .env.local
npm run dev
```

## Configuration

All site settings are managed through environment variables (`.env.local`) and config files. This makes it easy to update prices, contact info, and text without touching the code.

### Environment Variables (`.env.local`)

Copy `.env.template` to `.env.local` and customize:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SITE_NAME` | Brand name shown in header/title | `FirstClassTvätt` |
| `VITE_PHONE_E164` | Phone in E.164 format | `+46701234567` |
| `VITE_PHONE_PRETTY` | Display format (optional) | `+46 70 123 45 67` |
| `VITE_EMAIL_PUBLIC` | Public email address | `info@firstclasstvatt.se` |
| `VITE_INSTAGRAM_HANDLE` | Instagram handle | `@firstclasstvatt` |
| `VITE_ADDRESS_LINE` | Physical address | `Gamla Kronvägen 19D, 433 33 Partille` |
| `VITE_GMAPS_Q` | Google Maps link URL | `https://www.google.com/maps?q=...` |
| `VITE_GMAPS_EMBED` | Google Maps embed URL | `https://www.google.com/maps/embed?pb=...` |
| `VITE_HOURS_MON_FRI` | Mon-Fri opening hours | `10–19` |
| `VITE_HOURS_SAT` | Saturday hours | `11–16` |
| `VITE_HOURS_SUN` | Sunday hours | `11–16` |
| `VITE_GOOGLE_SHEET_CONTACT_URL` | Apps Script Web App URL | `https://script.google.com/...` |

### Pricing Configuration (`src/pricing.config.json`)

All service packages and prices are defined in `src/pricing.config.json`:

- **Wash Packages**: Basic, Plus, Complete, Full Service
- **Tire Services**: Change, Hotel, Combo, Annual
- **Rekond Services**: Polishing, Complete, Premium
- **Addons**: Rust removal, etc.
- **Discount Banner**: Enable/disable promotional discounts

To update prices, simply edit the `price` field in each package.

### Translations (`src/features/i18n/dict.ts`)

All text content is stored in the dictionary file with Swedish (`sv`) and English (`en`) translations. Update text here to change:

- Navigation labels
- Section titles and descriptions
- Package names and feature lists
- Form labels and messages

## Contact Form (Google Sheets)

The contact form submits to a Google Sheet via a deployed Google Apps Script Web App.

### Setup

1. Create a Google Sheet
2. Go to Extensions → Apps Script
3. Create a Web App that accepts POST requests
4. Deploy and copy the URL to `VITE_GOOGLE_SHEET_CONTACT_URL`

### Expected POST Body

```json
{
  "name": "string",
  "mobile": "string", 
  "email": "string",
  "service": "string",
  "plate": "string",
  "lang": "sv|en",
  "pageUrl": "string"
}
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Project Structure

```
src/
├── app/
│   ├── initApp.ts      # App initialization
│   ├── siteConfig.ts   # Environment config loading
│   └── types.ts        # TypeScript types
├── features/
│   ├── i18n/           # Translations
│   ├── pricing/        # Dynamic pricing cards
│   ├── carousel/       # Image carousel
│   └── ...
├── partials/           # HTML partials
└── pricing.config.json # Pricing data
```
