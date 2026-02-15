import { defineConfig, loadEnv } from "vite";
import * as fs from "node:fs";
import * as path from "node:path";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string) {
  // same as html escaping for our usage
  return escapeHtml(s);
}

function replaceFirst(input: string, find: RegExp, replace: string) {
  return input.replace(find, replace);
}

function includePartials(html: string, rootDir: string, seen = new Set<string>()): string {
  const includeRe = /<!--#include\s+file\s*=\s*"([^"]+)"\s*-->/g;

  return html.replace(includeRe, (_m, relPath: string) => {
    const abs = path.resolve(rootDir, relPath);
    if (seen.has(abs)) {
      throw new Error(`Circular include detected: ${relPath}`);
    }
    if (!fs.existsSync(abs)) {
      throw new Error(`Include file not found: ${relPath}`);
    }

    seen.add(abs);
    const content = fs.readFileSync(abs, "utf8");
    const expanded = includePartials(content, rootDir, seen);
    seen.delete(abs);
    return expanded;
  });
}

export default defineConfig(({ mode }) => {
  // Load both VITE_* and non-VITE vars (server-side config) from .env files.
  const env = loadEnv(mode, process.cwd(), "");

  const siteName = env.VITE_SITE_NAME || "FirstClassTvätt";
  const emailPublic = env.VITE_EMAIL_PUBLIC || "info@store.se";
  const phoneE164 = env.VITE_PHONE_E164 || "+46701234567";
  const addressLine = env.VITE_ADDRESS_LINE || "Gamla Kronvägen 19D, 433 33 Partille";
  const gmapsQ =
    env.VITE_GMAPS_Q ||
    "https://www.google.com/maps?q=Gamla%20Kronv%C3%A4gen%2019D%2C%20433%2033%20Partille";

  return {
    plugins: [
      {
        name: "html-partial-includes",
        transformIndexHtml(html) {
          return includePartials(html, process.cwd());
        },
      },
      {
        name: "html-env-replacements",
        transformIndexHtml(html) {
          // 1) Brand: update visible elements marked with data-site-name
          html = html.replace(
            /(<[^>]*\bdata-site-name\b[^>]*>)([\s\S]*?)(<\/[^>]+>)/g,
            `$1${escapeHtml(siteName)}$3`,
          );

          // 2) Title + OG title/alt: update meta contents (targeted)
          html = replaceFirst(
            html,
            /(<title>)([\s\S]*?)(<\/title>)/,
            `$1${escapeHtml(siteName)} – Biltvätt i Partille$3`,
          );

          html = html.replace(
            /(<meta\s+property="og:title"\s+content=")([^"]*)("\s*\/?>)/,
            `$1${escapeAttr(`${siteName} – Biltvätt i Partille`)}$3`,
          );
          html = html.replace(
            /(<meta\s+property="og:image:alt"\s+content=")([^"]*)("\s*\/?>)/,
            `$1${escapeAttr(`${siteName} – Biltvätt i Partille`)}$3`,
          );

          // 3) Phone links: update only anchors marked with data-phone
          html = html.replace(
            /(<a[^>]*\bdata-phone\b[^>]*\bhref=")tel:[^"]*("[^>]*>)/g,
            `$1tel:${escapeAttr(phoneE164)}$2`,
          );

          // 4) Email: update only anchors marked with data-email
          html = html.replace(
            /(<a[^>]*\bdata-email\b[^>]*\bhref=")mailto:[^"]*("[^>]*>)([\s\S]*?)(<\/a>)/g,
            `$1mailto:${escapeAttr(emailPublic)}$2${escapeHtml(emailPublic)}$4`,
          );

          // 5) Address text: update only elements marked with data-address
          html = html.replace(
            /(<[^>]*\bdata-address\b[^>]*>)([\s\S]*?)(<\/[^>]+>)/g,
            `$1${escapeHtml(addressLine)}$3`,
          );

          // 6) Google Maps link: update only anchors marked with data-gmaps
          html = html.replace(
            /(<a[^>]*\bdata-gmaps\b[^>]*\bhref=")[^"]*("[^>]*>)/g,
            `$1${escapeAttr(gmapsQ)}$2`,
          );

          return html;
        },
      },
    ],
  };
});

