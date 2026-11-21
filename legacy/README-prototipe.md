# PESONA — Prototipe Pusat Edukasi & Optimalisasi Usaha

Prototipe frontend untuk **PESONA** (**Pusat Edukasi dan Optimalisasi Usaha**), kendaraan **TRI CITTA MAHOTTAMA**: Citta Vidya (edukasi), Citta Seva (layanan), dan Citta Karya (kolaborasi usaha). Dibangun dengan HTML, CSS, dan JavaScript vanilla. Tidak ada backend, framework, atau proses build.

> **Status:** prototipe konsep. Bukan situs resmi Pemerintah Kabupaten Klungkung. Seluruh angka, nama wajib pajak, penyedia, status, booking, dan transaksi adalah simulasi. PESONA di sini dipakai sebagai nama kerja platform; tidak ada klaim kepanjangan resmi.

## Cara membuka

Langsung klik dua kali `index.html`, atau jalankan server lokal:

```powershell
cd PESONA_PAJAK
python -m http.server 8765
```

Lalu buka `http://127.0.0.1:8765/`.

Prototipe juga dapat dibuka langsung dengan `file://`. Font, gambar, pencarian, dialog, dan penyimpanan demo tetap berjalan di browser modern.

## Yang bisa dicoba

### Portal warga

- **Beranda:** hero dengan simulasi PBJT, layanan cepat, ringkasan data, lima jenis pajak, alur, kalender, kabar, dan FAQ.
- **Edukasi:** 10 materi, jalur belajar, filter kategori, pencarian, progres bacaan, kuis 4 pertanyaan, dan FAQ.
- **Jenis pajak:** PBJT, PBB-P2, BPHTB, pajak reklame, dan pajak air tanah, lengkap dengan ilustrasi perhitungan.
- **Kalkulator:** simulasi lima pajak dengan hasil yang berubah saat nilai diisi.
- **Layanan (Citta Seva):**
  - pendaftaran NPWPD 4 langkah;
  - simulasi lapor & bayar 4 langkah dengan kode billing;
  - cek status berdasarkan kode referensi;
  - tracker izin dan sertifikasi lima tahap;
  - janji temu Meja PAD;
  - konsultasi/pengaduan dengan nomor tiket dan target 3×24 jam.
- **Usaha (Citta Karya):**
  - registry 11 penyedia contoh dengan tiga tingkat verifikasi;
  - pencarian dan filter kategori/wilayah;
  - profil penyedia, booking simulasi, dan QRIS contoh dengan PBJT ilustrasi;
  - pendaftaran penyedia baru yang masuk antrean verifikasi petugas;
  - katalog pelatihan dan sertifikasi dengan pendaftaran simulasi;
  - ruang koperasi: anggota, listing, bagi hasil 80/10/10, dan laporan bulanan.
- **Edukasi (Citta Vidya):** jalur belajar, kuis, dan sertifikat belajar simulasi setelah 6 materi atau skor kuis 80%.
- **Akun demo:** kewajiban, riwayat pembayaran, dokumen, ruang usaha, dan progres belajar/sertifikat.

### Portal petugas

Buka tautan **Portal Petugas** di kanan atas atau kunjungi `#/petugas/ringkasan`.

- **Ringkasan:** KPI realisasi, kepatuhan, wajib pajak aktif, piutang, grafik realisasi vs target, komposisi pajak, antrean, dan kampanye edukasi.
- **Pendapatan:** target dan realisasi per jenis pajak, grafik bulanan/kumulatif, catatan pendapatan, ekspor CSV.
- **Wajib pajak:** pencarian, filter status/jenis, tabel kepatuhan dan tunggakan, panel detail, simulasi pengingat.
- **Layanan:** antrean pendaftaran, pelaporan, konsultasi, dan pengaduan. Item baru dari formulir warga muncul di sini; status dapat diubah untuk simulasi.
- **Citta Karya:** pengajuan penyedia, verifikasi dan tampil di registry, booking/transaksi tercatat, mitra, pelatihan, dan ringkasan koperasi.
- **Konten edukasi:** statistik pembaca, kampanye, dan form untuk menambah materi. Materi baru langsung tampil di pusat edukasi publik pada browser yang sama.

### Lintas halaman

- Pencarian global dengan **Ctrl/Cmd + K**.
- Panel notifikasi, mode gelap/terang, navigasi mobile, dialog dengan keyboard, dan toast.
- Data demo disimpan di `localStorage`; gunakan **Reset data demo** di footer untuk menghapusnya.
- Preferensi gerak (`prefers-reduced-motion`) dihormati.

## Kode dan alur demo

| Kebutuhan | Nilai |
|---|---|
| Masuk wajib pajak | tombol **Masuk** → **Sebagai wajib pajak** (tanpa kata sandi) |
| Masuk petugas | tombol **Masuk** → **Sebagai petugas PESONA**, atau tautan Portal Petugas |
| Cek status contoh | `NPWPD-2026-0184`, `SPTPD-2026-10293`, `PSN-2611-2048`, `IZIN-2026-0045`, `PVD-2026-0041`, `TEMU-2611-0301`, `BKG-2611-1042` |
| Kode baru | dibuat otomatis setelah wizard pendaftaran/pelaporan/konsultasi, pengajuan penyedia, booking, pelatihan, atau janji temu |

## Struktur berkas

```text
PESONA_PAJAK/
├── index.html                  # shell, navigasi, halaman statis, dialogs
├── assets/
│   ├── css/styles.css          # design system + seluruh layout
│   ├── js/data.js              # data simulasi (pajak, materi, admin, dsb.)
│   ├── js/app.js               # routing hash, render, wizard, chart, interaksi
│   ├── fonts/                  # Bricolage Grotesque + Plus Jakarta Sans
│   ├── icons/                  # sprite Lucide (ISC) dan file sumber
│   └── img/                    # foto lokal
├── preview/                    # tangkapan layar prototipe
└── README.md
```

## Pratinjau

| Berkas | Tampilan |
|---|---|
| `preview/home.png` | Beranda, mode terang |
| `preview/home-full.png` | Beranda lengkap (diperkecil) |
| `preview/edukasi.png` | Pusat edukasi |
| `preview/kalkulator.png` | Kalkulator PBJT |
| `preview/layanan.png` | Halaman layanan |
| `preview/admin.png` | Portal petugas |
| `preview/mobile.png` | Beranda mobile 390 px |
| `preview/dark.png` | Beranda mode gelap |

## Rute hash

```text
#/beranda
#/edukasi
#/pajak
#/kalkulator
#/layanan
#/usaha
#/akun
#/petugas/ringkasan
#/petugas/pendapatan
#/petugas/wajib-pajak
#/petugas/usaha
#/petugas/layanan
#/petugas/edukasi
```

Tambahkan `?theme=light` atau `?theme=dark` pada URL untuk memaksa tema saat pengujian.

## Batas prototipe

- Tidak ada autentikasi, backend, API, atau basis data.
- Tidak ada pengiriman dokumen, pembayaran, email, atau WhatsApp nyata.
- Angka PAD, target, kepatuhan, dan daftar wajib pajak adalah data fiktif.
- Tarif dan contoh perhitungan bersifat edukasi. Ketentuan resmi mengikuti Perda dan peraturan yang berlaku.
- Izin, sertifikat, dan pemungutan pajak tetap menjadi kewenangan instansi berwenang. PESONA pada konsep ini adalah kanal edukasi, layanan, dan optimalisasi usaha, bukan penerbit izin atau pemungut pajak.
- Registry, verifikasi penyedia, booking, QRIS, pelatihan, sertifikasi, dan bagi hasil koperasi adalah simulasi frontend. Tidak ada transaksi atau pengiriman data nyata.
- Prototipe ini terpisah dari prototipe **UPTD PESONA pariwisata** yang ada di folder `VERSI_UPTD_PESONA`. Folder tersebut tidak diubah.

## Aset

- Font: Bricolage Grotesque dan Plus Jakarta Sans (SIL Open Font License), disimpan lokal.
- Ikon: [Lucide](https://lucide.dev) (ISC), sprite inline.
- Foto: Unsplash, disimpan lokal untuk pemakaian prototipe. Ganti dengan foto berlisensi yang sesuai sebelum publikasi.
- Tidak ada library JavaScript eksternal.

## Catatan desain

- Palet: hijau kelp, kertas hangat, dan amber sebagai aksen tunggal.
- Tipografi display Bricolage Grotesque; teks UI Plus Jakarta Sans.
- Pendekatan: layanan publik yang ramah, transparan, dan mudah dipindai; bukan dashboard SaaS generik.
- Semua data dan status diberi label simulasi agar tidak disalahartikan sebagai layanan resmi.
