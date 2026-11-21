export type DashboardTone = "blue" | "lavender" | "aqua" | "navy";

export type DashboardSegment = {
  label: string;
  value: number;
  suffix?: string;
};

export type DashboardRole = {
  id: string;
  label: string;
  workspace: string;
  title: string;
  description: string;
  icon: string;
  tone: DashboardTone;
  avatar: string;
  greeting: string;
  summary: string;
  sidebar: { label: string; icon: string; href: string; active?: boolean }[];
  kpis: {
    label: string;
    value: string;
    meta: string;
    icon: string;
    href: string;
    tone: "up" | "info" | "warn" | "neutral";
  }[];
  chart:
    | {
        type: "ring";
        title: string;
        subtitle: string;
        value: number;
        center: string;
        caption: string;
      }
    | {
        type: "bars";
        title: string;
        subtitle: string;
        labels: string[];
        values: number[];
        caption: string;
      }
    | {
        type: "area";
        title: string;
        subtitle: string;
        labels: string[];
        values: number[];
        caption: string;
      }
    | {
        type: "stack";
        title: string;
        subtitle: string;
        segments: DashboardSegment[];
        caption: string;
      };
  insights: { label: string; value: string }[];
  tasks: { title: string; meta: string; status: string; href: string; tone: "warn" | "info" | "ok"; icon: string }[];
  activity: { title: string; meta: string; time: string; icon: string }[];
  focus: string[];
  link: { label: string; href: string };
  note: string;
};

export const DASHBOARD_ROLES: DashboardRole[] = [
  {
    id: "warga",
    label: "Warga",
    workspace: "Ruang Warga",
    title: "Warga",
    description:
      "Kewajiban, permohonan, dan progres belajar dalam satu ringkasan yang mudah dipahami.",
    icon: "ph:user-circle",
    tone: "blue",
    avatar: "AW",
    greeting: "Selamat pagi, Ayu.",
    summary: "Ini gambaran ringkasan kewajiban dan aktivitas Anda.",
    sidebar: [
      { label: "Ringkasan", icon: "ph:squares-four", href: "/dashboard#warga", active: true },
      { label: "Kewajiban", icon: "ph:receipt", href: "/layanan/lapor-bayar" },
      { label: "Permohonan", icon: "ph:clipboard-text", href: "/layanan/cek-status" },
      { label: "Belajar", icon: "ph:book-open-text", href: "/edukasi" },
      { label: "Janji temu", icon: "ph:calendar-check", href: "/layanan/janji-temu" },
      { label: "Profil", icon: "ph:user-circle", href: "/tentang#pengembangan" },
    ],
    kpis: [
      { label: "Kewajiban aktif", value: "2", meta: "1 mendekati jatuh tempo", icon: "ph:receipt", href: "/layanan/lapor-bayar", tone: "warn" },
      { label: "Progres belajar", value: "40%", meta: "4 dari 10 materi", icon: "ph:book-open-text", href: "/edukasi", tone: "info" },
      { label: "Permohonan", value: "1", meta: "Dalam verifikasi", icon: "ph:clipboard-text", href: "/layanan/cek-status", tone: "up" },
    ],
    chart: {
      type: "ring",
      title: "Progres belajar",
      subtitle: "Jalur dasar pajak daerah",
      value: 40,
      center: "4/10",
      caption: "Belajar lima menit sehari.",
    },
    insights: [
      { label: "Materi berikutnya", value: "PBB-P2" },
      { label: "Kewajiban terdekat", value: "3 hari" },
      { label: "Dokumen siap", value: "3/4" },
    ],
    tasks: [
      {
        title: "Laporkan PBJT masa Oktober",
        meta: "Jatuh tempo 3 hari lagi",
        status: "Perlu tindakan",
        href: "/layanan/lapor-bayar",
        tone: "warn",
        icon: "ph:receipt",
      },
      {
        title: "Lengkapi profil usaha",
        meta: "Data lokasi belum diisi",
        status: "Draft",
        href: "/layanan/daftar-npwpd",
        tone: "info",
        icon: "ph:note-pencil",
      },
      {
        title: "Janji temu Meja PAD",
        meta: "Kamis, 20 November · 09.00",
        status: "Terjadwal",
        href: "/layanan/janji-temu",
        tone: "ok",
        icon: "ph:calendar-check",
      },
    ],
    activity: [
      { title: "Materi PBJT selesai", meta: "Progres bertambah 10%", time: "08.42", icon: "ph:book-open-text" },
      { title: "Permohonan NPWPD", meta: "Dokumen diverifikasi petugas", time: "Kemarin", icon: "ph:seal-check" },
      { title: "Konsultasi dibalas", meta: "Tiket PSN-2611-2048", time: "18 Nov", icon: "ph:chat-circle-text" },
    ],
    focus: ["Kewajiban dan jatuh tempo", "Status permohonan", "Progres belajar dan janji temu"],
    link: { label: "Jelajahi layanan warga", href: "/layanan" },
    note: "Contoh data warga. Tidak ada akun atau data pribadi nyata di halaman ini.",
  },
  {
    id: "pelaku-usaha",
    label: "Pelaku Usaha",
    workspace: "Ruang Usaha",
    title: "Pelaku usaha",
    description:
      "Administrasi, performa, dan kesiapan usaha untuk tampil di registry serta menerima booking.",
    icon: "ph:storefront",
    tone: "lavender",
    avatar: "NA",
    greeting: "Selamat pagi, Nusa Asri.",
    summary: "Pantau administrasi, performa, dan kesiapan usaha Anda.",
    sidebar: [
      { label: "Ringkasan", icon: "ph:squares-four", href: "/dashboard#pelaku-usaha", active: true },
      { label: "Profil usaha", icon: "ph:storefront", href: "/usaha" },
      { label: "Kewajiban", icon: "ph:receipt", href: "/layanan/lapor-bayar" },
      { label: "Booking", icon: "ph:calendar-dots", href: "/usaha/registry" },
      { label: "Pelatihan", icon: "ph:graduation-cap", href: "/usaha/pelatihan" },
      { label: "Registry", icon: "ph:seal-check", href: "/usaha/registry" },
    ],
    kpis: [
      { label: "Status NPWPD", value: "Aktif", meta: "Terverifikasi", icon: "ph:identification-card", href: "/layanan/daftar-npwpd", tone: "up" },
      { label: "Omzet bulan ini", value: "Rp25 jt", meta: "+8% dari bulan lalu", icon: "ph:chart-line-up", href: "/layanan/lapor-bayar", tone: "info" },
      { label: "Listing aktif", value: "1", meta: "Terverifikasi lanjutan", icon: "ph:storefront", href: "/usaha/registry", tone: "up" },
    ],
    chart: {
      type: "bars",
      title: "Omzet & pajak",
      subtitle: "Enam bulan terakhir · ilustrasi",
      labels: ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"],
      values: [18, 22, 20, 25, 24, 25],
      caption: "Omzet dalam juta rupiah.",
    },
    insights: [
      { label: "Pajak masa ini", value: "Rp2,5 jt" },
      { label: "Kelengkapan", value: "4/5" },
      { label: "Booking aktif", value: "3" },
    ],
    tasks: [
      {
        title: "Laporan masa Oktober",
        meta: "Ringkasan sudah siap diperiksa",
        status: "Siap dikirim",
        href: "/layanan/lapor-bayar",
        tone: "warn",
        icon: "ph:receipt",
      },
      {
        title: "Perbarui ketersediaan kamar",
        meta: "2 kamar berubah status",
        status: "Hari ini",
        href: "/usaha/registry",
        tone: "info",
        icon: "ph:bed",
      },
      {
        title: "Sertifikasi higiene",
        meta: "Pelatihan berikutnya 26 November",
        status: "Terdaftar",
        href: "/usaha/pelatihan",
        tone: "ok",
        icon: "ph:medal",
      },
    ],
    activity: [
      { title: "Booking baru", meta: "2 malam · pembayaran QRIS", time: "09.10", icon: "ph:calendar-check" },
      { title: "Pembayaran tercatat", meta: "PBJT masa Oktober", time: "08.15", icon: "ph:receipt" },
      { title: "Pelatihan diikuti", meta: "Homestay Naik Kelas", time: "16 Nov", icon: "ph:graduation-cap" },
    ],
    focus: ["Status NPWPD dan dokumen", "Omzet dan kewajiban", "Listing, booking, dan pelatihan"],
    link: { label: "Buka Citta Karya", href: "/usaha" },
    note: "Contoh data usaha. Nama, omzet, dan booking adalah ilustrasi.",
  },
  {
    id: "petugas",
    label: "Petugas",
    workspace: "Ruang Petugas",
    title: "Petugas",
    description:
      "Antrean layanan, realisasi pendapatan, dan tindak lanjut dalam satu meja kerja.",
    icon: "ph:identification-badge",
    tone: "navy",
    avatar: "RW",
    greeting: "Selamat pagi, Rina.",
    summary: "Pantau antrean, realisasi, dan kualitas layanan hari ini.",
    sidebar: [
      { label: "Ringkasan", icon: "ph:squares-four", href: "/dashboard#petugas", active: true },
      { label: "Pendapatan", icon: "ph:chart-line-up", href: "/pajak" },
      { label: "Wajib pajak", icon: "ph:users-three", href: "/layanan/cek-status" },
      { label: "Layanan", icon: "ph:tray", href: "/layanan" },
      { label: "Citta Karya", icon: "ph:storefront", href: "/usaha" },
      { label: "Konten", icon: "ph:book-open-text", href: "/edukasi" },
    ],
    kpis: [
      { label: "Antrean layanan", value: "12", meta: "3 prioritas", icon: "ph:tray", href: "/layanan", tone: "warn" },
      { label: "Selesai hari ini", value: "28", meta: "Rata-rata 14 menit", icon: "ph:check-circle", href: "/layanan/cek-status", tone: "up" },
      { label: "Kepatuhan", value: "82,6%", meta: "Target 85%", icon: "ph:shield-check", href: "/layanan/konsultasi", tone: "info" },
    ],
    chart: {
      type: "area",
      title: "Realisasi pendapatan",
      subtitle: "Enam bulan terakhir · ilustrasi",
      labels: ["Jun", "Jul", "Agu", "Sep", "Okt", "Nov"],
      values: [58, 64, 61, 72, 78, 83],
      caption: "Realisasi 82,6% dari target.",
    },
    insights: [
      { label: "Respons rata-rata", value: "1,8 jam" },
      { label: "SLA terpenuhi", value: "94%" },
      { label: "Verifikasi", value: "7" },
    ],
    tasks: [
      {
        title: "Verifikasi pendaftaran NPWPD",
        meta: "4 permohonan menunggu",
        status: "Prioritas",
        href: "/layanan/daftar-npwpd",
        tone: "warn",
        icon: "ph:identification-card",
      },
      {
        title: "Tindak lanjut konsultasi",
        meta: "2 tiket mendekati SLA",
        status: "Hari ini",
        href: "/layanan/konsultasi",
        tone: "info",
        icon: "ph:chat-circle-text",
      },
      {
        title: "Verifikasi listing usaha",
        meta: "3 pengajuan baru",
        status: "Baru",
        href: "/usaha/registry",
        tone: "ok",
        icon: "ph:storefront",
      },
    ],
    activity: [
      { title: "Pendaftaran baru", meta: "Kafe Mangrove · Nusa Penida", time: "08.42", icon: "ph:identification-card" },
      { title: "Laporan masuk", meta: "Kafe Sunrise · PBJT Oktober", time: "08.15", icon: "ph:receipt" },
      { title: "Pembayaran diterima", meta: "Warung Bu Nyoman · Rp2,5 jt", time: "07.58", icon: "ph:check-circle" },
    ],
    focus: ["Antrean dan target respons", "Realisasi pendapatan", "Verifikasi dan konten publik"],
    link: { label: "Pahami alur layanan", href: "/layanan" },
    note: "Contoh ruang petugas. Portal petugas belum tersedia pada tahap konsep.",
  },
  {
    id: "koperasi",
    label: "Koperasi",
    workspace: "Ruang Koperasi",
    title: "Koperasi",
    description:
      "Anggota, listing, booking, dan bagi hasil dalam satu ruang yang dapat diperiksa bersama.",
    icon: "ph:users-three",
    tone: "aqua",
    avatar: "KP",
    greeting: "KDKMP Nusa Penida",
    summary: "Kelola anggota, katalog, dan bagi hasil dengan catatan yang lebih terbuka.",
    sidebar: [
      { label: "Ringkasan", icon: "ph:squares-four", href: "/dashboard#koperasi", active: true },
      { label: "Anggota", icon: "ph:users-three", href: "/usaha/koperasi" },
      { label: "Listing", icon: "ph:storefront", href: "/usaha/registry" },
      { label: "Booking", icon: "ph:calendar-dots", href: "/usaha/registry" },
      { label: "Bagi hasil", icon: "ph:chart-pie-slice", href: "/usaha/koperasi" },
      { label: "Laporan", icon: "ph:file-text", href: "/usaha/koperasi" },
    ],
    kpis: [
      { label: "Anggota aktif", value: "46", meta: "12 unit usaha", icon: "ph:users-three", href: "/usaha/koperasi", tone: "up" },
      { label: "Listing aktif", value: "12", meta: "5 kategori", icon: "ph:storefront", href: "/usaha/registry", tone: "info" },
      { label: "Booking bulan ini", value: "38", meta: "Nilai Rp18,25 jt", icon: "ph:calendar-check", href: "/usaha/registry", tone: "up" },
    ],
    chart: {
      type: "stack",
      title: "Bagi hasil bulan ini",
      subtitle: "Nilai booking Rp18,25 juta · ilustrasi",
      segments: [
        { label: "Anggota / operator", value: 80, suffix: "80%" },
        { label: "Kas koperasi", value: 10, suffix: "10%" },
        { label: "Dana komunitas", value: 10, suffix: "10%" },
      ],
      caption: "Persentase harus disepakati anggota pada implementasi nyata.",
    },
    insights: [
      { label: "Kas koperasi", value: "Rp1,82 jt" },
      { label: "Dana komunitas", value: "Rp1,82 jt" },
      { label: "Anggota baru", value: "3" },
    ],
    tasks: [
      {
        title: "Setujui laporan bulanan",
        meta: "Menunggu persetujuan 3 anggota",
        status: "Perlu persetujuan",
        href: "/usaha/koperasi",
        tone: "warn",
        icon: "ph:file-text",
      },
      {
        title: "Lengkapi listing anggota",
        meta: "2 anggota belum mengunggah foto",
        status: "Draft",
        href: "/usaha/registry",
        tone: "info",
        icon: "ph:storefront",
      },
      {
        title: "Rapat anggota",
        meta: "Jumat, 21 November · 14.00",
        status: "Terjadwal",
        href: "/usaha/koperasi",
        tone: "ok",
        icon: "ph:calendar-check",
      },
    ],
    activity: [
      { title: "Booking homestay", meta: "2 malam · Nusa Asri", time: "10.12", icon: "ph:calendar-check" },
      { title: "Anggota baru", meta: "Warung Segara", time: "Kemarin", icon: "ph:users-three" },
      { title: "Laporan siap", meta: "Oktober 2026", time: "18 Nov", icon: "ph:file-text" },
    ],
    focus: ["Anggota dan listing", "Booking dan nilai transaksi", "Bagi hasil yang transparan"],
    link: { label: "Buka ruang koperasi", href: "/usaha/koperasi" },
    note: "Contoh data koperasi. Seluruh angka dan skema bagi hasil adalah ilustrasi.",
  },
];

export const getDashboardRole = (id: string) => DASHBOARD_ROLES.find((role) => role.id === id);
