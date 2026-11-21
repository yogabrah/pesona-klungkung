# PESONA — Situs Penjelasan Konsep

Situs statis untuk memperkenalkan **PESONA** (**Pusat Edukasi & Optimalisasi Usaha**) dan **TRI CITTA MAHOTTAMA** — Citta Vidya (edukasi), Citta Seva (layanan), dan Citta Karya (usaha) — untuk Kabupaten Klungkung. Header, footer, dan dashboard menggunakan **Lambang Kabupaten Klungkung**.

Situs ini berfokus pada **penjelasan tujuan, cara kerja, layanan, dan batas peran**. Belum ada autentikasi, pengiriman dokumen, pembayaran, atau koneksi ke sistem pemerintah. Tombol **Masuk** menampilkan pemberitahuan bahwa akun masih dalam pengembangan.

> **Status:** konsep platform. Bukan situs resmi Pemerintah Kabupaten Klungkung. Seluruh angka, nama penyedia, jadwal, status, dan contoh transaksi adalah ilustrasi.

---

## Ringkasan migrasi

Prototipe vanilla HTML/CSS/JavaScript dimigrasikan menjadi:

| Bagian | Implementasi |
|---|---|
| Framework | **Astro 7** dengan output statis |
| Styling | **Tailwind CSS 4** melalui `@tailwindcss/vite` |
| Ikon | **Phosphor Icons** melalui `astro-icon` + `@iconify-json/ph`, di-inline saat build |
| Font | Bricolage Grotesque dan Plus Jakarta Sans, disimpan lokal |
| SEO | Metadata per halaman, canonical, Open Graph, Twitter Card, JSON-LD, `sitemap-index.xml`, `robots.txt` |
| Animasi | SVG animasi untuk alur PESONA + kontrol jeda + dukungan `prefers-reduced-motion` |
| Interaksi | Kalkulator simulasi, filter registry, dialog aksesibel — tanpa framework UI klien |
| Output | 33 halaman publik + halaman 404, seluruhnya statis |

Tidak ada framework UI klien, tidak ada webfont ikon, dan tidak ada backend. JavaScript hanya dimuat pada komponen yang memerlukannya.

### Deploy GitHub Pages

Repository: <https://github.com/yogabrah/pesona-klungkung>

Situs: <https://yogabrah.github.io/pesona-klungkung/>

Deploy berjalan otomatis melalui `.github/workflows/deploy.yml` pada setiap push ke `main`. Build GitHub Pages memakai origin `https://yogabrah.github.io` dan base path `/pesona-klungkung`; `scripts/prepare-pages.mjs` menyesuaikan URL aset, tautan internal, canonical, sitemap, dan robots untuk subpath proyek.

---

## Menjalankan proyek

Prasyarat: **Node.js 22.23.4+** (Astro 7) dan npm.

```powershell
npm install
npm run dev
```

Buka `http://localhost:4321`.

Perintah lain:

```powershell
npm run check      # pemeriksaan TypeScript dan Astro
npm run build      # astro check + build statis ke dist/
npm run preview    # pratinjau hasil build
npm run assets     # regenerate favicon, logo, apple-touch-icon, dan og-pesona.jpg
```

### Menentukan domain produksi

Secara bawaan, canonical, Open Graph, sitemap, dan robots memakai domain contoh:

```text
https://pesona.example
```

Ganti sebelum publikasi:

```powershell
$env:SITE_URL="https://domain-resmi-yang-dipilih"
npm run build
```

Konfigurasi ada di `astro.config.mjs`:

```js
const site = process.env.SITE_URL || "https://pesona.example";
```

Jangan memakai domain contoh untuk produksi.

---

## Peta halaman

### Halaman utama navigasi

| Halaman | Rute |
|---|---|
| Beranda | `/` |
| Tentang PESONA | `/tentang` |
| Pusat edukasi | `/edukasi` |
| Jenis pajak daerah | `/pajak` |
| Kalkulator simulasi | `/kalkulator` |
| Layanan Citta Seva | `/layanan` |
| Citta Karya | `/usaha` |
| Contoh dashboard per peran | `/dashboard` |
| Peta situs | `/peta-situs` |

### Enam halaman layanan

| Layanan | Rute |
|---|---|
| Daftar NPWPD | `/layanan/daftar-npwpd` |
| Lapor & bayar | `/layanan/lapor-bayar` |
| Cek status | `/layanan/cek-status` |
| Lacak izin & sertifikasi | `/layanan/lacak-izin` |
| Janji temu Meja PAD | `/layanan/janji-temu` |
| Konsultasi & pengaduan | `/layanan/konsultasi` |

### Lima halaman pajak daerah

`/pajak/pbjt` · `/pajak/pbb-p2` · `/pajak/bphtb` · `/pajak/reklame` · `/pajak/air-tanah`

### Sepuluh halaman materi edukasi

`/edukasi/pbjt-dasar` · `/edukasi/daftar-npwpd` · `/edukasi/pbb-njoptkp` · `/edukasi/kalender-pajak` · `/edukasi/reklame-media` · `/edukasi/bphtb-jual-beli` · `/edukasi/bayar-qris` · `/edukasi/telat-lapor` · `/edukasi/air-tanah` · `/edukasi/sanksi-administrasi`

### Ruang usaha

`/usaha/registry` · `/usaha/pelatihan` · `/usaha/koperasi`

---

## Yang bisa dicoba

- **Alur PESONA dalam SVG animasi** di beranda: pengguna → tiga pilar → manfaat bersama. Animasi dapat dijeda; pengguna dengan preferensi gerak dikurangi mendapat versi statis.
- **Contoh dashboard per peran** di `/dashboard`: warga, pelaku usaha, petugas, dan koperasi. Tab dapat diganti, URL hash menyimpan pilihan peran, dan seluruh isi diberi label ilustrasi.
- **Fitur dashboard dapat diklik**: menu sidebar (desktop dan mobile), kartu KPI, dan daftar tindakan mengarah ke halaman penjelasan terkait seperti layanan, edukasi, registry, atau koperasi.
- **Kalkulator lima pajak** dengan tab, format rupiah, perhitungan langsung, reset, dan salin ringkasan. Seluruh perhitungan berjalan di browser.
- **Registry contoh** dengan pencarian, filter kategori, filter wilayah, jumlah hasil, dan empty state.
- **Dialog Masuk** yang menjelaskan bahwa akun masih dalam pengembangan. Tautan fallback mengarah ke peta jalan bila JavaScript tidak tersedia.
- **Animasi reveal saat scroll** dengan stagger halus, menghormati `prefers-reduced-motion`, dan tetap menampilkan konten bila JavaScript tidak tersedia.
- **Menu mobile** aksesibel dengan fokus terkelola, tombol Escape, dan penyesuaian saat layar diperbesar.
- **Peta situs HTML** dan **sitemap XML** untuk navigasi serta mesin pencari.
- **Mode gerak dikurangi** pada seluruh animasi dan transisi.

---

## Arsitektur dan struktur berkas

```text
pesona/
├── astro.config.mjs          # site, sitemap, astro-icon, Tailwind Vite plugin
├── package.json
├── tsconfig.json
├── public/
│   ├── fonts/                # font lokal (woff2)
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-192.png
│   ├── logo-klungkung.png    # logo Kabupaten Klungkung 512 px
│   ├── apple-touch-icon.png
│   ├── og-pesona.jpg         # kartu sosial 1200 × 630
│   └── site.webmanifest
├── src/
│   ├── assets/images/        # foto lokal untuk dioptimalkan Astro
│   ├── components/           # header, footer, kartu, kalkulator, dialog, FAQ, dsb.
│   ├── data/
│   │   ├── site.ts           # identitas, navigasi, tiga cita, prinsip, roadmap, FAQ
│   │   ├── services.ts       # konten enam layanan
│   │   ├── calculator.ts     # konfigurasi dan rumus kalkulator
│   │   ├── dashboards.ts     # data empat role dashboard
│   │   └── prototype.json    # data pajak, artikel, penyedia, pelatihan (dari prototipe)
│   ├── layouts/BaseLayout.astro
│   ├── lib/content.ts        # tipe dan helper konten
│   ├── pages/                # seluruh rute statis
│   └── styles/global.css     # design token, komponen, animasi, aksesibilitas
├── scripts/
│   ├── generate-assets.mjs   # regenerate favicon, logo, apple-touch, og image
│   └── prepare-pages.mjs     # sesuaikan build untuk base path GitHub Pages
├── .github/workflows/
│   └── deploy.yml            # build + deploy otomatis ke GitHub Pages
├── legacy/                   # arsip prototipe vanilla (tidak dipakai build)
├── preview/                  # tangkapan layar final
├── Lambang_Kabupaten_Klungkung.png # sumber logo resmi (arsip)
├── dist/                     # hasil build (dihasilkan)
└── README.md
```

### Prinsip implementasi

- **Konten sebagai data**: layanan, pajak, artikel, penyedia, dan pelatihan disimpan di `src/data`/`src/lib`, bukan tersebar di markup.
- **Halaman dinamis saat build**: rute pajak, layanan, dan artikel memakai `getStaticPaths()` sehingga menghasilkan HTML statis dengan SEO per halaman.
- **Ikon tanpa runtime**: `astro-icon` menginline SVG Phosphor saat build. Tidak ada webfont ikon yang perlu diunduh.
- **Minim JavaScript**: hanya menu, dialog, kalkulator, filter registry, dan kontrol animasi yang memakai skrip.

---

## Referensi teknis (Context7)

Implementasi mengacu pada dokumentasi resmi melalui Context7 MCP:

- **Astro** — `/withastro/docs`: instalasi Tailwind 4, `getStaticPaths`, sitemap, canonical/SEO.
- **Tailwind CSS** — `/tailwindlabs/tailwindcss.com`: konfigurasi v4 melalui `@theme`, `@apply`, dan Vite plugin.
- **astro-icon** — `/natemoo-re/astro-icon`: komponen `Icon` yang merender SVG saat build.
- **Phosphor Icons** — `/phosphor-icons/core` dan `/phosphor-icons/web`: aset SVG, bukan webfont, untuk performa lebih baik.

Dokumentasi resmi terkait:

- <https://docs.astro.build>
- <https://tailwindcss.com/docs>
- <https://github.com/natemoo-re/astro-icon>
- <https://phosphoricons.com>

---

## Arah visual

- **Logo:** Lambang Kabupaten Klungkung pada header, footer, favicon, kartu sosial, dan shell dashboard. Aset turunan dibuat oleh `npm run assets`.
- **Palet:** navy `#0B2C52`, azure `#2F7BEA`, aqua `#0F766E`, lavender `#4F47A3`, dan kertas kebiruan `#F8FAFD`.
- **Gradasi:** hero memakai lapisan radial biru–lavender–aqua yang halus; panel gelap memakai navy dengan glow biru dan lavender.
- **Tipografi:** Bricolage Grotesque untuk display, Plus Jakarta Sans untuk teks. Skala memakai `clamp()` yang konsisten dari hero hingga kartu, dengan ukuran minimum yang tetap terbaca.
- **Hero:** tinggi dikunci ke `100svh` dikurangi header pada semua ukuran yang diuji, dengan visual foto hanya di desktop dan kartu alur ringkas di mobile.
- **Animasi:** hero muncul saat halaman dimuat; section, kartu, FAQ, panel CTA, dan ilustrasi alur memakai reveal saat masuk viewport. Semua dihentikan atau ditampilkan langsung saat `prefers-reduced-motion` aktif.
- **Ilustrasi dashboard:** empat role menggunakan shell dashboard yang sama dengan chart, KPI, daftar tindakan, dan aktivitas yang berbeda—seluruhnya data ilustrasi.

---

## SEO

Setiap halaman memiliki:

- `<title>` dan meta description unik;
- canonical URL absolut;
- Open Graph + Twitter Card dengan gambar sosial `og-pesona.jpg`;
- `lang="id"` dan locale `id_ID`;
- metadata regional Klungkung;
- breadcrumb yang terlihat dan `BreadcrumbList` terstruktur;
- satu `<h1>` per halaman;
- tautan internal yang saling terhubung;
- alt text pada gambar konten.

Structured data yang dipakai:

- `Organization`, `WebSite`, `WebPage` — fondasi situs;
- `BreadcrumbList` — navigasi;
- `FAQPage` — pertanyaan umum;
- `Article` + `LearningResource` — materi edukasi;
- `HowTo` — alur layanan;
- `CollectionPage` + `ItemList` — hub edukasi, pajak, layanan, usaha;
- `ItemList` — peran pada halaman contoh dashboard;
- `AboutPage` — halaman tentang;
- `WebApplication` — kalkulator.

Tambahan:

- `dist/sitemap-index.xml` dihasilkan `@astrojs/sitemap`;
- `dist/robots.txt` dihasilkan dari `src/pages/robots.txt.ts`;
- halaman 404 memakai `noindex`;
- tidak ada halaman dengan description duplikat atau tautan internal rusak pada pemeriksaan build terakhir.

---

## Aksesibilitas dan performa

- Struktur landmark (`header`, `nav`, `main`, `footer`), skip link, dan focus ring.
- Dialog memakai `<dialog>` native, fokus awal, Escape, klik backdrop, dan pengembalian fokus.
- Menu mobile memiliki focus trap dan tombol tutup yang jelas.
- FAQ memakai `<details>`/`<summary>` sehingga tetap berfungsi tanpa JavaScript.
- Animasi panjang dapat dijeda; `prefers-reduced-motion` menonaktifkan animasi.
- Kontras teks diperiksa; audit **axe-core** pada 33 halaman dengan tag WCAG 2 A/AA menghasilkan **0 pelanggaran** pada pemeriksaan akhir.
- Gambar dioptimalkan Astro ke WebP responsif; hero memakai `loading="eager"` dan `fetchpriority="high"`.
- Font lokal di-preload; tidak ada request ke CDN.
- Tidak ada framework UI klien; JS hanya untuk interaksi yang diperlukan.
- Seluruh 33 halaman publik lolos crawl: tidak ada error konsol, tautan rusak, atau gambar tanpa alt.
- Hero diuji pada 1440×1000, 1366×768, 1024×768, 768×1024, 390×844, dan 375×667; semuanya pas di dalam viewport awal tanpa overflow horizontal.

---

## Batas prototipe

- Tidak ada backend, basis data, autentikasi, API, email, atau WhatsApp.
- Tidak ada dokumen yang diunggah atau pembayaran yang diproses.
- NPWPD, pajak, izin, sertifikasi, registry, booking, QRIS, dan bagi hasil koperasi adalah **simulasi**.
- PESONA tidak menerbitkan izin, tidak memungut pajak, dan tidak mengambil alih kewenangan instansi.
- Tarif dan contoh perhitungan bersifat edukasi. Ketentuan resmi mengikuti Perda, SPPT, kode billing, dan kanal pemerintah daerah.
- Situs ini bukan situs resmi Pemerintah Kabupaten Klungkung. Gunakan domain, kontak, dan materi resmi sebelum publikasi.
- Foto contoh berasal dari prototipe awal (Unsplash). Ganti dengan foto berlisensi yang sesuai sebelum publikasi produksi.

---

## Pratinjau

| Berkas | Tampilan |
|---|---|
| `preview/home.png` | Beranda desktop |
| `preview/home-flow.png` | Ilustrasi alur SVG |
| `preview/tentang.png` | Halaman Tentang |
| `preview/edukasi.png` | Pusat edukasi |
| `preview/pajak-pbjt.png` | Halaman PBJT |
| `preview/kalkulator.png` | Kalkulator simulasi |
| `preview/layanan.png` | Hub layanan |
| `preview/layanan-detail.png` | Detail Daftar NPWPD |
| `preview/registry.png` | Registry penyedia |
| `preview/dashboard.png` | Contoh dashboard warga |
| `preview/dashboard-petugas.png` | Contoh dashboard petugas |
| `preview/peta-situs.png` | Peta situs |
| `preview/login-dialog.png` | Pemberitahuan pengembangan |
| `preview/mobile-home.png` | Beranda mobile 390 px |
| `preview/mobile-menu.png` | Menu mobile |
| `preview/mobile-kalkulator.png` | Kalkulator mobile |
| `preview/mobile-dashboard.png` | Contoh dashboard peran di mobile |

---

## Aset dan lisensi

- **Bricolage Grotesque** dan **Plus Jakarta Sans** — SIL Open Font License, disimpan lokal.
- **Phosphor Icons** — MIT License, diinline saat build.
- **Astro** — MIT License.
- **Tailwind CSS** — MIT License.
- **Foto** — berasal dari prototipe awal (Unsplash). Periksa kembali lisensi dan ganti bila diperlukan untuk publikasi.
- **Lambang Kabupaten Klungkung** — disediakan pengguna untuk identitas situs. Penggunaan lebih lanjut mengikuti ketentuan pemerintah daerah.
- Gambar sosial `public/og-pesona.jpg` dibuat dari foto yang sama, dengan Lambang Kabupaten Klungkung dan overlay identitas PESONA.

---

## Arsip prototipe lama

Versi vanilla HTML/CSS/JavaScript tetap disimpan di `legacy/` untuk referensi:

- `legacy/index.html`
- `legacy/assets/`
- `legacy/preview/`
- `legacy/README-prototipe.md`

Folder tersebut tidak digunakan oleh build Astro.
