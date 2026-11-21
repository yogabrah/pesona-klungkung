import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site ?? "https://pesona.example");
  const body = `User-agent: *
Allow: /

# Situs konsep. Ganti SITE_URL sebelum publikasi produksi.
Sitemap: ${sitemapURL.href}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
