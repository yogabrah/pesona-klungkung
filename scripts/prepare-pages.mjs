import fs from "node:fs";
import path from "node:path";

const siteUrl = process.env.SITE_URL || "https://yogabrah.github.io";
const rawBase = process.env.BASE_PATH || "/pesona-klungkung";
const base = rawBase === "/" ? "" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;

if (!base) {
  console.log("BASE_PATH is root; no path rewriting needed.");
  process.exit(0);
}

const dist = path.resolve("dist");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function withBase(url) {
  if (!url.startsWith("/") || url.startsWith("//") || url.startsWith(`${base}/`) || url === base) {
    return url;
  }
  return `${base}${url}`;
}

function rewriteRootUrls(content) {
  content = content.replace(
    /(\b(?:href|src|poster|action|content)=")(\/(?!\/)[^"]*)(")/g,
    (_match, before, url, after) => `${before}${withBase(url)}${after}`,
  );

  content = content.replace(/(\bsrcset=")([^"]*)(")/g, (_match, before, value, after) => {
    const rewritten = value
      .split(",")
      .map((candidate) => {
        const trimmed = candidate.trim();
        const [url, ...descriptor] = trimmed.split(/\s+/);
        return [withBase(url), ...descriptor].join(" ");
      })
      .join(", ");
    return `${before}${rewritten}${after}`;
  });

  content = content.replace(/url\(\s*(["']?)(\/(?!\/)[^"')]+)\1\s*\)/g, (_match, quote, url) => {
    return `url(${quote}${withBase(url)}${quote})`;
  });

  return content;
}

function rewriteAbsoluteUrls(content) {
  if (!siteUrl) return content;
  const origin = new URL(siteUrl).origin;
  const pattern = new RegExp(
    `${escapeRegExp(origin)}(?!/${escapeRegExp(base.slice(1))}(?:[/"'?#<\\s]|$))`,
    "g",
  );
  return content.replace(pattern, `${origin}${base}`);
}

const files = walk(dist).filter((file) => /\.(html|css|xml|txt|webmanifest|json)$/i.test(file));
let changed = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = rewriteAbsoluteUrls(rewriteRootUrls(before));
  if (after !== before) {
    fs.writeFileSync(file, after, "utf8");
    changed += 1;
  }
}

console.log(`Prepared GitHub Pages output at ${base || "/"}; files changed: ${changed}`);
