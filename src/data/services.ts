export type ServiceTone = "forest" | "sand" | "mint" | "peach";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  kicker: string;
  description: string;
  intro: string[];
  icon: string;
  tone: ServiceTone;
  meta: string;
  tag: string;
  audience: string[];
  steps: { title: string; description: string; icon: string }[];
  prepared: { title: string; description?: string }[];
  outcomes: { title: string; description: string; icon: string }[];
  notes: string[];
  faqs: { q: string; a: string }[];
  related: string[];
  ctaTitle: string;
  ctaText: string;
};

export const SERVICES: Service[] = [
  {
    slug: "daftar-npwpd",
    title: "Daftar NPWPD",
    shortTitle: "Daftar NPWPD",
    kicker: "Citta Seva · Identitas wajib pajak",
    description:
      "Panduan menyiapkan identitas wajib pajak daerah untuk usaha baru, dari dokumen sampai status verifikasi.",
    intro: [
      "NPWPD atau Nomor Pokok Wajib Pajak Daerah adalah identitas yang digunakan saat mendaftar, melapor, dan membayar pajak daerah. Memilikinya membuat administrasi usaha lebih tertib dan memudahkan akses layanan.",
      "Di PESONA, alur pendaftaran dirancang terpandu: pertanyaan sederhana, pemeriksaan dokumen, lalu status yang bisa dipantau. Pendaftaran nyata belum dibuka pada tahap konsep ini.",
    ],
    icon: "ph:identification-card",
    tone: "forest",
    meta: "4 langkah · contoh verifikasi 3 hari kerja",
    tag: "Paling dicari",
    audience: [
      "Usaha baru yang memiliki objek pajak daerah",
      "Restoran, kafe, penginapan, tempat hiburan, dan pengelola parkir",
      "Pelaku usaha yang ingin menata administrasi sejak awal",
    ],
    steps: [
      {
        title: "Tentukan objek pajaknya",
        description:
          "Cocokkan jenis kegiatan usaha dengan pajak daerah yang mungkin berlaku. Panduan ini membantu Anda tidak memilih jenis yang salah.",
        icon: "ph:compass",
      },
      {
        title: "Siapkan dokumen dasar",
        description:
          "KTP, NIB atau izin usaha, data lokasi, dan bukti operasional. Daftar periksa dibuat agar tidak ada berkas yang terlewat.",
        icon: "ph:folder-open",
      },
      {
        title: "Isi dan periksa data",
        description:
          "Nama, alamat, dan jenis usaha harus sesuai dokumen resmi. Ringkasan ditampilkan sebelum permohonan dikirim.",
        icon: "ph:note-pencil",
      },
      {
        title: "Kirim dan pantau verifikasi",
        description:
          "Setelah dikirim, permohonan memperoleh kode referensi. Status dan catatan petugas dapat dilihat pada halaman cek status.",
        icon: "ph:seal-check",
      },
    ],
    prepared: [
      { title: "KTP pemilik atau penanggung jawab", description: "Nama dan NIK terbaca jelas." },
      { title: "NIB atau dokumen izin usaha", description: "Sesuaikan dengan jenis kegiatan." },
      { title: "Data dan foto lokasi usaha", description: "Alamat serta bukti kegiatan di lokasi." },
      { title: "NPWP, bila tersedia", description: "Membantu pencocokan data wajib pajak." },
      { title: "Surat kuasa, bila diwakilkan", description: "Dilengkapi identitas penerima kuasa." },
    ],
    outcomes: [
      {
        title: "Nomor identitas",
        description: "NPWPD untuk keperluan pelaporan dan pembayaran pajak daerah.",
        icon: "ph:identification-badge",
      },
      {
        title: "Riwayat permohonan",
        description: "Jejak status yang dapat dibuka kembali dengan kode referensi.",
        icon: "ph:clock-counter-clockwise",
      },
      {
        title: "Akses layanan",
        description: "Dasar untuk melanjutkan ke lapor, bayar, dan layanan lain.",
        icon: "ph:arrow-square-out",
      },
    ],
    notes: [
      "Perbedaan nama, alamat, atau jenis usaha adalah penyebab umum permohonan dikembalikan.",
      "Contoh waktu verifikasi 3 hari kerja bukan janji layanan resmi.",
      "Pada tahap konsep, tidak ada dokumen yang benar-benar diunggah atau dikirim.",
    ],
    faqs: [
      {
        q: "Apakah semua UMKM wajib memiliki NPWPD?",
        a: "Kewajiban bergantung pada jenis kegiatan dan objek pajak daerah yang dimiliki. Usaha kecil dengan objek tertentu mungkin belum termasuk, tetapi tetap dianjurkan memahami ketentuan. Kasus spesifik perlu dikonsultasikan melalui kanal resmi.",
      },
      {
        q: "Apakah NPWPD sama dengan NPWP?",
        a: "Tidak. NPWP diterbitkan pemerintah pusat untuk administrasi pajak nasional, sedangkan NPWPD diterbitkan pemerintah daerah untuk pajak daerah. Keduanya dapat diperlukan pada satu usaha.",
      },
      {
        q: "Berapa lama proses pendaftaran?",
        a: "Pada ilustrasi situs ini, verifikasi dicontohkan 3 hari kerja setelah dokumen dinyatakan lengkap. Waktu sebenarnya mengikuti kebijakan layanan setempat.",
      },
    ],
    related: ["cek-status", "lapor-bayar", "konsultasi"],
    ctaTitle: "Siapkan usaha Anda sejak awal.",
    ctaText:
      "Pelajari dokumen yang dibutuhkan, lalu ikuti peta jalan untuk tahu kapan fitur pendaftaran dibuka.",
  },
  {
    slug: "lapor-bayar",
    title: "Lapor & bayar",
    shortTitle: "Lapor & bayar",
    kicker: "Citta Seva · Masa pajak",
    description:
      "Alur menghitung kewajiban masa pajak, membuat kode billing, membayar melalui kanal resmi, dan menyimpan bukti.",
    intro: [
      "Pelaporan dan pembayaran adalah dua langkah berbeda. Pelaporan menyampaikan data kewajiban; pembayaran menyelesaikan tagihan melalui kanal resmi. PESONA merancang keduanya agar terasa sebagai satu alur yang bisa diikuti.",
      "Halaman ini menjelaskan urutan yang aman. Pembayaran nyata tidak diproses di situs konsep ini dan hanya boleh dilakukan melalui kanal resmi pemerintah daerah.",
    ],
    icon: "ph:receipt",
    tone: "peach",
    meta: "4 langkah · kode billing · bukti bayar",
    tag: "Masa pajak",
    audience: [
      "Wajib pajak daerah yang sudah memiliki NPWPD",
      "Pelaku usaha dengan kewajiban masa pajak bulanan",
      "Warga yang perlu memahami alur pembayaran resmi",
    ],
    steps: [
      {
        title: "Hitung kewajiban masa pajak",
        description:
          "Kumpulkan catatan omzet, bukti pungut, atau nilai objek. Kalkulator membantu membuat perkiraan sebelum data diserahkan.",
        icon: "ph:calculator",
      },
      {
        title: "Buat kode billing",
        description:
          "Kode billing memuat identitas wajib pajak, jenis pajak, masa, dan nominal. Periksa seluruh rincian sebelum membayar.",
        icon: "ph:barcode",
      },
      {
        title: "Bayar lewat kanal resmi",
        description:
          "Gunakan bank persepsi, QRIS resmi pemerintah daerah, atau meja layanan. Jangan membayar ke rekening pribadi.",
        icon: "ph:qr-code",
      },
      {
        title: "Simpan bukti dan pantau",
        description:
          "Bukti bayar dan status pelaporan disimpan dalam satu tempat. Status dapat dicek kembali dengan kode referensi.",
        icon: "ph:archive",
      },
    ],
    prepared: [
      { title: "NPWPD", description: "Identitas wajib pajak daerah." },
      { title: "Catatan omzet atau dasar pengenaan", description: "Satu masa pajak agar mudah dicocokkan." },
      { title: "Masa dan jenis pajak", description: "Pastikan tidak tertukar dengan kewajiban lain." },
      { title: "Bukti pembayaran sebelumnya", description: "Untuk memeriksa riwayat dan menghindari pembayaran ganda." },
    ],
    outcomes: [
      {
        title: "Ringkasan kewajiban",
        description: "Susunan nilai dan dasar perhitungan yang mudah diperiksa.",
        icon: "ph:list-checks",
      },
      {
        title: "Kode billing",
        description: "Rujukan pembayaran yang menyatukan identitas, masa, dan nominal.",
        icon: "ph:barcode",
      },
      {
        title: "Arsip tertata",
        description: "Bukti lapor dan bayar tersimpan untuk kebutuhan verifikasi.",
        icon: "ph:folder-simple",
      },
    ],
    notes: [
      "Jangan membayar dua kali hanya karena status belum berubah. Simpan bukti dan hubungi kanal resmi.",
      "Nominal pada kalkulator adalah simulasi, bukan ketetapan pajak.",
      "Situs ini tidak memproses pembayaran atau mengirim data ke server mana pun.",
    ],
    faqs: [
      {
        q: "Apakah lapor dan bayar harus dilakukan bersamaan?",
        a: "Tidak selalu. Pelaporan dan pembayaran dapat menjadi dua langkah terpisah. Yang penting keduanya selesai dalam masa dan tenggat yang berlaku. Pastikan Anda mengikuti petunjuk kanal resmi.",
      },
      {
        q: "Bagaimana jika pembayaran sudah berhasil tetapi status belum berubah?",
        a: "Simpan bukti transaksi, catat waktu dan kode billing, lalu hubungi kanal resmi. Hindari membayar ulang sebelum ada konfirmasi.",
      },
      {
        q: "Apakah kalkulator PESONA bisa dipakai sebagai dasar pembayaran?",
        a: "Tidak. Kalkulator hanya untuk belajar dan memperkirakan. Nilai resmi mengikuti SPPT, kode billing, atau perhitungan yang diterbitkan instansi berwenang.",
      },
    ],
    related: ["daftar-npwpd", "cek-status", "konsultasi"],
    ctaTitle: "Kenali kewajiban sebelum tenggat.",
    ctaText:
      "Gunakan kalkulator untuk simulasi, lalu pelajari cara membaca kode billing dan menyimpan bukti dengan aman.",
  },
  {
    slug: "cek-status",
    title: "Cek status",
    shortTitle: "Cek status",
    kicker: "Citta Seva · Lacak permohonan",
    description:
      "Pantau permohonan, pelaporan, izin, janji temu, atau tiket konsultasi dengan satu kode referensi.",
    intro: [
      "Satu kode referensi dapat menunjukkan posisi sebuah permohonan tanpa perlu bertanya berulang kali. PESONA merancang halaman status yang menampilkan tahap terakhir, riwayat singkat, dan langkah berikutnya.",
      "Pada tahap konsep, contoh status tersedia untuk memperlihatkan bentuk informasi yang akan diterima pengguna. Tidak ada data permohonan nyata di situs ini.",
    ],
    icon: "ph:magnifying-glass",
    tone: "mint",
    meta: "Satu kode · riwayat · langkah berikutnya",
    tag: "Lacak",
    audience: [
      "Pemohon yang sudah mengirim pendaftaran atau pelaporan",
      "Peserta janji temu dan pelatihan",
      "Warga yang menyampaikan konsultasi atau pengaduan",
    ],
    steps: [
      {
        title: "Masukkan kode referensi",
        description:
          "Gunakan kode yang diterima setelah pengajuan. Kode berbeda untuk pendaftaran, pelaporan, tiket, dan booking.",
        icon: "ph:key",
      },
      {
        title: "Cocokkan identitas",
        description:
          "Untuk melindungi data, status hanya menampilkan informasi yang relevan bagi pemilik kode.",
        icon: "ph:shield-check",
      },
      {
        title: "Lihat tahap dan riwayat",
        description:
          "Waktu, unit yang menangani, catatan singkat, dan perkiraan langkah berikutnya ditampilkan dalam satu tampilan.",
        icon: "ph:clock-counter-clockwise",
      },
      {
        title: "Tindak lanjuti",
        description:
          "Jika ada dokumen kurang atau perlu konfirmasi, tautan tindakan menjelaskan apa yang harus dilakukan.",
        icon: "ph:arrow-square-out",
      },
    ],
    prepared: [
      { title: "Kode referensi", description: "Contoh: NPWPD-2026-0184." },
      { title: "Identitas pemohon", description: "Untuk pencocokan bila diperlukan." },
      { title: "Tanggal atau jenis pengajuan", description: "Membantu menemukan kode yang benar." },
    ],
    outcomes: [
      {
        title: "Status terkini",
        description: "Tahap yang sedang berjalan dalam bahasa yang mudah dipahami.",
        icon: "ph:map-pin",
      },
      {
        title: "Jejak waktu",
        description: "Riwayat singkat perpindahan tahap dan catatan penting.",
        icon: "ph:list-dashes",
      },
      {
        title: "Arahan berikutnya",
        description: "Apa yang perlu disiapkan atau dihubungi setelahnya.",
        icon: "ph:signpost",
      },
    ],
    notes: [
      "Jangan bagikan kode referensi kepada pihak yang tidak berkepentingan.",
      "Kode contoh pada situs ini hanya ilustrasi dan tidak terhubung ke sistem nyata.",
      "Status resmi tetap mengikuti kanal pemerintah daerah yang berwenang.",
    ],
    faqs: [
      {
        q: "Kode referensi saya hilang. Apa yang harus dilakukan?",
        a: "Periksa kembali e-mail, pesan, atau bukti pengajuan. Jika tetap tidak ditemukan, hubungi kanal resmi dengan identitas dan perkiraan tanggal pengajuan.",
      },
      {
        q: "Mengapa status tidak berubah?",
        a: "Status dapat tertahan karena dokumen belum lengkap, antrean verifikasi, atau proses di instansi lain. Gunakan kanal resmi untuk meminta penjelasan, bukan perantara tidak resmi.",
      },
      {
        q: "Apakah kode referensi bisa dipakai untuk semua layanan?",
        a: "Kode memiliki prefiks sesuai jenis layanan. Satu kode merujuk pada satu permohonan. Jika Anda memiliki beberapa pengajuan, periksa kode masing-masing.",
      },
    ],
    related: ["daftar-npwpd", "lapor-bayar", "konsultasi"],
    ctaTitle: "Satu kode, satu jawaban yang jelas.",
    ctaText:
      "Lihat bagaimana PESONA merancang status yang tidak membuat warga menebak-nebak.",
  },
  {
    slug: "lacak-izin",
    title: "Lacak izin & sertifikasi",
    shortTitle: "Lacak izin",
    kicker: "Citta Seva · Lintas instansi",
    description:
      "Satu tracker untuk melihat posisi persiapan NIB, TDUP/SLS, NPWPD, dan sertifikasi tanpa mengubah kewenangan instansi.",
    intro: [
      "Perjalanan formalisasi usaha sering melewati beberapa instansi dan dokumen. PESONA tidak mengambil alih proses itu, tetapi merancang satu tampilan agar pemilik usaha tahu sedang berada di tahap mana.",
      "Tracker ini adalah alat bantu pemahaman. Izin dan sertifikasi tetap diterbitkan oleh instansi berwenang sesuai ketentuan yang berlaku.",
    ],
    icon: "ph:path",
    tone: "sand",
    meta: "5 tahap · lintas instansi · status bersama",
    tag: "Citta Seva",
    audience: [
      "Usaha yang sedang menyiapkan legalitas dasar",
      "Penyedia wisata yang ingin tampil di registry",
      "Koperasi yang mendampingi anggota",
    ],
    steps: [
      {
        title: "Identifikasi kebutuhan",
        description:
          "Tentukan dokumen yang relevan dengan jenis usaha, lokasi, dan layanan yang akan ditawarkan.",
        icon: "ph:list-magnifying-glass",
      },
      {
        title: "Siapkan dan cocokkan",
        description:
          "PESONA membantu memeriksa kelengkapan dasar sebelum dokumen diajukan ke instansi berwenang.",
        icon: "ph:folder-simple",
      },
      {
        title: "Proses di instansi",
        description:
          "Status dari instansi dicatat sebagai tahap. Keputusan dan penerbitan tetap berada pada instansi tersebut.",
        icon: "ph:buildings",
      },
      {
        title: "Sertifikasi dan kesiapan",
        description:
          "Pelatihan atau sertifikasi kompetensi dicatat sebagai bagian dari kesiapan layanan, bukan pengganti izin.",
        icon: "ph:medal",
      },
      {
        title: "Siap tampil di registry",
        description:
          "Setelah dokumen dasar dan komitmen layanan dinilai lengkap, usaha dapat mengajukan listing.",
        icon: "ph:storefront",
      },
    ],
    prepared: [
      { title: "NIB dan identitas usaha", description: "Dokumen dasar yang menjadi titik awal." },
      { title: "Dokumen izin sesuai kegiatan", description: "Contoh: TDUP/SLS untuk usaha wisata tertentu." },
      { title: "NPWPD", description: "Menunjukkan kesiapan administrasi pajak daerah." },
      { title: "Bukti sertifikasi atau pelatihan", description: "Bila layanan membutuhkan kompetensi khusus." },
    ],
    outcomes: [
      {
        title: "Peta dokumen",
        description: "Satu tampilan yang menunjukkan dokumen mana yang sudah dan belum siap.",
        icon: "ph:map-trifold",
      },
      {
        title: "Status lintas tahap",
        description: "Posisi proses tanpa perlu menebak instansi mana yang sedang menangani.",
        icon: "ph:list-checks",
      },
      {
        title: "Kesiapan listing",
        description: "Gambaran apakah usaha sudah memenuhi syarat dasar untuk tampil di registry.",
        icon: "ph:seal-check",
      },
    ],
    notes: [
      "PESONA bukan penerbit izin, sertifikat, atau rekomendasi resmi.",
      "Nama instansi dan persyaratan pada konsep ini bersifat ilustrasi.",
      "Selalu gunakan kanal resmi untuk pengajuan dan pembayaran.",
    ],
    faqs: [
      {
        q: "Apakah tracker ini bisa menerbitkan izin?",
        a: "Tidak. Tracker hanya membantu menampilkan dan memahami tahapan. Penerbitan izin tetap dilakukan instansi berwenang.",
      },
      {
        q: "Apakah semua usaha perlu melewati lima tahap?",
        a: "Tidak. Kebutuhan berbeda menurut jenis usaha, lokasi, skala, dan layanan. Lima tahap pada halaman ini adalah gambaran umum, bukan syarat seragam.",
      },
      {
        q: "Apa hubungannya dengan registry penyedia?",
        a: "Registry adalah katalog usaha yang dokumen dasar dan komitmen layanannya sudah diperiksa. Registry bukan pengganti izin dan tidak menjamin kualitas layanan di luar komitmen yang disepakati.",
      },
    ],
    related: ["daftar-npwpd", "cek-status", "konsultasi"],
    ctaTitle: "Satu pandangan untuk banyak tahap.",
    ctaText:
      "Pelajari bagaimana PESONA ingin mengurangi kebingungan tanpa mengambil alih kewenangan instansi.",
  },
  {
    slug: "janji-temu",
    title: "Janji temu Meja PAD",
    shortTitle: "Janji temu",
    kicker: "Citta Seva · Pendampingan",
    description:
      "Pesan slot pendampingan bersama petugas di MPP Klungkung atau satelit Nusa Penida.",
    intro: [
      "Tidak semua pertanyaan selesai dengan membaca. Janji temu membantu warga dan pelaku usaha bertemu petugas pada waktu yang disepakati, dengan topik yang sudah disiapkan.",
      "Pada konsep ini, jadwal dan lokasi adalah ilustrasi. Pemesanan nyata belum tersedia dan tidak ada slot yang benar-benar dipesan.",
    ],
    icon: "ph:calendar-check",
    tone: "sand",
    meta: "Contoh slot 30 menit · gratis",
    tag: "Meja PAD",
    audience: [
      "Pelaku usaha yang perlu mendiskusikan dokumen",
      "Warga yang ingin memahami kewajiban pajak daerah",
      "Koperasi atau kelompok usaha yang membutuhkan pendampingan",
    ],
    steps: [
      {
        title: "Pilih kebutuhan",
        description:
          "Tentukan topik: pendaftaran, pelaporan, izin, registry, atau konsultasi umum.",
        icon: "ph:chats-circle",
      },
      {
        title: "Pilih lokasi dan jadwal",
        description:
          "Lihat slot contoh di MPP Klungkung atau satelit Nusa Penida, lalu pilih yang sesuai.",
        icon: "ph:calendar-dots",
      },
      {
        title: "Terima kode janji",
        description:
          "Kode referensi dan ringkasan persiapan ditampilkan setelah pemesanan.",
        icon: "ph:ticket",
      },
      {
        title: "Datang dan tindak lanjuti",
        description:
          "Bawa dokumen yang relevan. Catatan hasil pertemuan dapat ditindaklanjuti melalui layanan terkait.",
        icon: "ph:handshake",
      },
    ],
    prepared: [
      { title: "Topik dan pertanyaan utama", description: "Tulis 1–3 hal yang paling ingin diselesaikan." },
      { title: "Dokumen pendukung", description: "Bawa salinan, bukan hanya foto di ponsel." },
      { title: "Kode janji temu", description: "Untuk verifikasi saat datang." },
      { title: "Identitas diri", description: "Sesuai data pemohon." },
    ],
    outcomes: [
      {
        title: "Waktu yang disepakati",
        description: "Mengurangi waktu tunggu dan antrean tanpa arah.",
        icon: "ph:hourglass-medium",
      },
      {
        title: "Pendampingan terarah",
        description: "Petugas dapat menyiapkan informasi sesuai topik yang dipilih.",
        icon: "ph:user-circle",
      },
      {
        title: "Catatan tindak lanjut",
        description: "Hasil pertemuan menjadi rujukan langkah berikutnya.",
        icon: "ph:note",
      },
    ],
    notes: [
      "Jam layanan contoh: Senin–Jumat, 08.00–15.00 WITA. Pastikan jadwal resmi sebelum datang.",
      "Lokasi dan ketersediaan petugas pada konsep ini hanyalah ilustrasi.",
      "Tidak ada pemesanan nyata pada situs ini.",
    ],
    faqs: [
      {
        q: "Apakah janji temu berbayar?",
        a: "Pada konsep ini, pendampingan di Meja PAD digambarkan tanpa biaya. Kebijakan sebenarnya mengikuti ketentuan pemerintah daerah.",
      },
      {
        q: "Bisakah saya datang tanpa janji?",
        a: "Kebijakan walk-in berbeda menurut lokasi dan kapasitas. Janji temu dirancang untuk mengurangi antrean, bukan menutup akses bagi yang datang langsung.",
      },
      {
        q: "Apa yang terjadi jika saya terlambat?",
        a: "Slot dapat diberikan kepada pemohon lain sesuai kebijakan layanan. Hubungi kanal resmi jika perlu menjadwalkan ulang.",
      },
    ],
    related: ["konsultasi", "daftar-npwpd", "lacak-izin"],
    ctaTitle: "Datang dengan pertanyaan yang siap.",
    ctaText:
      "Pelajari cara menyiapkan topik dan dokumen agar waktu bertemu petugas lebih bermanfaat.",
  },
  {
    slug: "konsultasi",
    title: "Konsultasi & pengaduan",
    shortTitle: "Konsultasi",
    kicker: "Citta Seva · Bantuan",
    description:
      "Sampaikan pertanyaan atau keluhan melalui kanal yang tercatat dengan target respons 3×24 jam.",
    intro: [
      "Konsultasi membantu warga memahami kewajiban sebelum mengambil langkah. Pengaduan memastikan masalah layanan atau dugaan pungutan liar memiliki jejak dan tindak lanjut.",
      "PESONA merancang satu pintu yang membedakan pertanyaan dan pengaduan, mencatat nomor tiket, serta menampilkan target respons. Pada tahap konsep, belum ada tiket yang benar-benar dibuat.",
    ],
    icon: "ph:chat-circle-text",
    tone: "peach",
    meta: "Contoh respons 3×24 jam · tercatat",
    tag: "Bantuan",
    audience: [
      "Warga yang memiliki pertanyaan pajak daerah",
      "Pelaku usaha yang menghadapi kendala administrasi",
      "Siapa pun yang perlu menyampaikan keluhan atau dugaan pungutan liar",
    ],
    steps: [
      {
        title: "Pilih jenis pesan",
        description:
          "Konsultasi untuk pertanyaan, pengaduan untuk keluhan. Pilihan ini menentukan alur dan target respons.",
        icon: "ph:chats",
      },
      {
        title: "Tulis inti masalah",
        description:
          "Sertakan waktu, tempat, pihak terkait, dan bukti bila ada. Hindari mengirim data sensitif yang tidak diperlukan.",
        icon: "ph:pencil-simple",
      },
      {
        title: "Kirim dan terima tiket",
        description:
          "Setiap pesan memperoleh nomor tiket untuk memantau respons tanpa mengulang cerita.",
        icon: "ph:paper-plane-tilt",
      },
      {
        title: "Pantau dan tindak lanjuti",
        description:
          "Petugas merespons melalui kanal resmi. Simpan tanggapan dan bukti untuk langkah berikutnya.",
        icon: "ph:arrow-square-out",
      },
    ],
    prepared: [
      { title: "Inti pertanyaan atau keluhan", description: "Tulis singkat dan spesifik." },
      { title: "Kronologi", description: "Waktu, tempat, dan pihak yang terlibat." },
      { title: "Bukti pendukung", description: "Hanya yang relevan dan aman untuk dibagikan." },
      { title: "Kontak yang dapat dihubungi", description: "Gunakan kanal yang Anda pantau." },
    ],
    outcomes: [
      {
        title: "Nomor tiket",
        description: "Rujukan untuk melihat status dan riwayat respons.",
        icon: "ph:ticket",
      },
      {
        title: "Target respons",
        description: "Contoh 3×24 jam untuk tindak lanjut awal.",
        icon: "ph:timer",
      },
      {
        title: "Jejak penanganan",
        description: "Catatan tindak lanjut yang dapat dipelajari kembali.",
        icon: "ph:list-dashes",
      },
    ],
    notes: [
      "Jangan mengirim kata sandi, kode OTP, atau data rekening pribadi melalui kanal apa pun.",
      "Untuk dugaan pungutan liar, simpan bukti dan sampaikan melalui kanal pengaduan resmi atau Inspektorat.",
      "Situs ini tidak membuat tiket atau mengirim pesan ke petugas.",
    ],
    faqs: [
      {
        q: "Apa perbedaan konsultasi dan pengaduan?",
        a: "Konsultasi berkaitan dengan pertanyaan atau kebutuhan pemahaman. Pengaduan berkaitan dengan keluhan atas layanan, proses, atau dugaan penyimpangan. Keduanya memiliki jalur dan target respons yang dapat berbeda.",
      },
      {
        q: "Apakah identitas pelapor dirahasiakan?",
        a: "Pada implementasi nyata, perlindungan identitas mengikuti ketentuan yang berlaku. Situs ini hanya menjelaskan prinsipnya dan belum memproses pengaduan.",
      },
      {
        q: "Bagaimana jika tidak ada respons?",
        a: "Simpan nomor tiket dan bukti pengiriman, lalu gunakan kanal eskalasi resmi yang ditetapkan pemerintah daerah. Hindari menggunakan perantara tidak resmi.",
      },
    ],
    related: ["janji-temu", "cek-status", "lacak-izin"],
    ctaTitle: "Tanyakan dengan tenang, tercatat dengan jelas.",
    ctaText:
      "Lihat prinsip konsultasi PESONA: bahasa manusia, target respons, dan jejak yang bisa dipantau.",
  },
];

export const getService = (slug: string) => SERVICES.find((service) => service.slug === slug);

export const serviceToneClasses: Record<
  ServiceTone,
  { soft: string; icon: string; border: string; badge: string }
> = {
  forest: {
    soft: "bg-forest-50",
    icon: "bg-forest-100 text-forest-800",
    border: "border-forest-200/80",
    badge: "bg-forest-100 text-forest-800",
  },
  sand: {
    soft: "bg-sand-50",
    icon: "bg-sand-100 text-honey-800",
    border: "border-sand-200",
    badge: "bg-sand-100 text-honey-800",
  },
  mint: {
    soft: "bg-forest-50",
    icon: "bg-[#E2ECF7] text-forest-800",
    border: "border-[#D5E5F5]",
    badge: "bg-[#E2ECF7] text-forest-800",
  },
  peach: {
    soft: "bg-[#F5F4FF]",
    icon: "bg-[#EAE9FF] text-[#6C63C7]",
    border: "border-[#D9D7FA]",
    badge: "bg-[#EAE9FF] text-[#4F47A3]",
  },
};
