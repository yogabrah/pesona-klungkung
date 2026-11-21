// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

// Ganti dengan domain produksi saat situs dipublikasikan.
// Nilai ini dipakai untuk canonical URL, Open Graph, sitemap, dan robots.txt.
const site = process.env.SITE_URL || "https://pesona.example";

export default defineConfig({
  site,
  trailingSlash: "never",
  build: {
    format: "directory",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404"),
    }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
