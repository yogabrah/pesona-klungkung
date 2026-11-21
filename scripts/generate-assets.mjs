import fs from "node:fs";
import sharp from "sharp";

const crestPath = "src/assets/images/lambang-klungkung.png";
const crest = fs.readFileSync(crestPath);

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

for (const size of [16, 32, 192]) {
  await sharp(crest)
    .resize(size, size, { fit: "contain", background: transparent })
    .png()
    .toFile(`public/favicon-${size}.png`);
}

await sharp(crest)
  .resize(512, 512, { fit: "contain", background: transparent })
  .png()
  .toFile("public/logo-klungkung.png");

await sharp(crest)
  .resize(164, 164, { fit: "contain", background: "#FFFFFF" })
  .extend({ top: 8, bottom: 8, left: 8, right: 8, background: "#FFFFFF" })
  .png()
  .toFile("public/apple-touch-icon.png");

const overlay = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#071E3A" stop-opacity="0.97"/>
      <stop offset="0.56" stop-color="#0B2C52" stop-opacity="0.87"/>
      <stop offset="1" stop-color="#0B2C52" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#A8CBFF"/>
      <stop offset="1" stop-color="#5B9BF5"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <text x="154" y="104" fill="#F4F7FC" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="700" letter-spacing="1.5">PESONA</text>
  <text x="154" y="128" fill="#C5D9EE" font-family="Arial, Helvetica, sans-serif" font-size="12.5" font-weight="600" letter-spacing="1.4">PUSAT EDUKASI &amp; OPTIMALISASI USAHA</text>
  <text x="76" y="326" fill="#F4F7FC" font-family="Arial, Helvetica, sans-serif" font-size="61" font-weight="700" letter-spacing="-2.4">Pajak dan usaha,</text>
  <text x="76" y="396" fill="url(#blue)" font-family="Arial, Helvetica, sans-serif" font-size="61" font-weight="700" letter-spacing="-2.4">tumbuh bersama.</text>
  <rect x="76" y="441" width="58" height="3" rx="1.5" fill="#A8CBFF"/>
  <text x="76" y="489" fill="#E2ECF7" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">Satu alur untuk belajar pajak, mengurus layanan,</text>
  <text x="76" y="520" fill="#E2ECF7" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400">dan menumbuhkan usaha di Kabupaten Klungkung.</text>
  <rect x="76" y="562" width="258" height="34" rx="17" fill="#F4F7FC" fill-opacity="0.1" stroke="#F4F7FC" stroke-opacity="0.24"/>
  <text x="96" y="584" fill="#D9E8F5" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="600" letter-spacing="0.6">KONSEP PLATFORM / DATA ILUSTRASI</text>
  <text x="1124" y="584" text-anchor="end" fill="#D9E8F5" fill-opacity="0.82" font-family="Arial, Helvetica, sans-serif" font-size="13">TRI CITTA MAHOTTAMA / BALI</text>
</svg>`;

const crestOnOg = await sharp(crestPath)
  .resize({ height: 72, fit: "inside", background: transparent })
  .png()
  .toBuffer();

const base = await sharp("src/assets/images/hero-nusa-penida.jpg")
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 88 })
  .toBuffer();

await sharp(base)
  .composite([
    { input: Buffer.from(overlay) },
    { input: crestOnOg, left: 72, top: 58 },
  ])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile("public/og-pesona.jpg");

console.log("Generated Klungkung favicons, apple touch icon, logo, and og-pesona.jpg");
