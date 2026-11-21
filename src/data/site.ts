export const SITE = {
  name: "PESONA",
  longName: "Pusat Edukasi & Optimalisasi Usaha",
  tagline: "Pajak dan usaha, tumbuh bersama.",
  description:
    "PESONA menyatukan edukasi pajak, layanan administrasi, dan penguatan usaha dalam satu alur untuk warga, pelaku usaha, dan koperasi di Kabupaten Klungkung.",
  shortDescription:
    "Konsep platform edukasi pajak, layanan satu alur, dan penguatan usaha untuk Kabupaten Klungkung.",
  locale: "id_ID",
  lang: "id",
  region: "Kabupaten Klungkung, Bali",
  email: "halo@pesona.contoh",
  place: "MPP Klungkung, Bali",
  hours: "Senin–Jumat, 08.00–15.00 WITA",
  conceptLabel: "Konsep platform",
  dataLabel: "Data ilustrasi",
  prototypeNotice:
    "Situs ini adalah konsep platform, bukan situs resmi Pemerintah Kabupaten Klungkung. Seluruh angka, nama, dan status adalah ilustrasi.",
};

export const NAV = [
  { label: "Beranda", href: "/", match: "/" },
  { label: "Tentang", href: "/tentang", match: "/tentang" },
  { label: "Edukasi", href: "/edukasi", match: "/edukasi" },
  { label: "Pajak", href: "/pajak", match: "/pajak" },
  { label: "Kalkulator", href: "/kalkulator", match: "/kalkulator" },
  { label: "Layanan", href: "/layanan", match: "/layanan" },
  { label: "Usaha", href: "/usaha", match: "/usaha" },
  { label: "Dashboard", href: "/dashboard", match: "/dashboard" },
] as const;

export const CITTAS = [
  {
    number: "01",
    name: "Citta Vidya",
    meaning: "Belajar sebelum mengurus",
    description:
      "Materi ringkas, contoh nyata, dan kalkulator untuk memahami pajak, izin, dan administrasi usaha tanpa istilah yang membingungkan.",
    href: "/edukasi",
    cta: "Buka pusat edukasi",
    icon: "ph:book-open-text",
    tone: "forest",
    tags: ["10 materi", "4 jalur belajar", "Kalkulator"],
  },
  {
    number: "02",
    name: "Citta Seva",
    meaning: "Satu pintu untuk mengurus",
    description:
      "Dari pendaftaran NPWPD, pelaporan, hingga janji temu dan konsultasi. Setiap langkah dijelaskan, dicatat, dan dapat dipantau.",
    href: "/layanan",
    cta: "Buka layanan",
    icon: "ph:bank",
    tone: "sand",
    tags: ["6 layanan", "Status terlacak", "Tanpa perantara"],
  },
  {
    number: "03",
    name: "Citta Karya",
    meaning: "Tumbuh bersama ekosistem",
    description:
      "Registry usaha, pelatihan, sertifikasi, dan ruang koperasi yang menghubungkan usaha lokal dengan pasar dan pendampingan.",
    href: "/usaha",
    cta: "Jelajahi Citta Karya",
    icon: "ph:storefront",
    tone: "peach",
    tags: ["Registry", "Pelatihan", "Koperasi"],
  },
] as const;

export const HOME_STATS = [
  { value: "3", label: "pilar layanan", note: "Vidya · Seva · Karya" },
  { value: "6", label: "alur layanan", note: "satu pintu" },
  { value: "5", label: "pajak daerah", note: "dijelaskan" },
  { value: "10", label: "materi edukasi", note: "tanpa istilah rumit" },
] as const;

export const PRINCIPLES = [
  {
    title: "Transparan",
    description:
      "Syarat, alur, perkiraan waktu, dan status ditulis jelas sejak awal. Tidak ada langkah yang disembunyikan.",
    icon: "ph:eye",
  },
  {
    title: "Tanpa perantara",
    description:
      "PESONA tidak memungut biaya per izin dan tidak menggantikan kanal resmi. Tidak ada ruang untuk calo.",
    icon: "ph:shield-check",
  },
  {
    title: "Satu data",
    description:
      "Satu identitas usaha dapat digunakan ulang untuk layanan berikutnya, dengan persetujuan pemilik data.",
    icon: "ph:database",
  },
  {
    title: "Bahasa manusia",
    description:
      "Penjelasan disusun untuk warga, bukan hanya untuk yang terbiasa membaca peraturan.",
    icon: "ph:chat-circle-text",
  },
  {
    title: "Menghormati kewenangan",
    description:
      "Izin, sertifikasi, dan pemungutan pajak tetap menjadi kewenangan instansi berwenang.",
    icon: "ph:scales",
  },
  {
    title: "Bisa diawasi",
    description:
      "Setiap permohonan dan konsultasi memiliki jejak status yang dapat ditelusuri pemiliknya.",
    icon: "ph:clipboard-text",
  },
] as const;

export const HOME_FAQ = [
  {
    q: "Apa itu PESONA?",
    a: "PESONA adalah konsep platform yang menyatukan edukasi pajak, layanan administrasi, dan penguatan usaha dalam satu alur. Konsepnya dibangun di atas TRI CITTA MAHOTTAMA: Citta Vidya, Citta Seva, dan Citta Karya.",
  },
  {
    q: "Apakah situs ini sudah bisa dipakai untuk layanan resmi?",
    a: "Belum. Situs ini adalah tahap konsep dan penjelasan. Belum ada autentikasi, pengiriman dokumen, pembayaran, atau koneksi ke sistem pemerintah. Seluruh fitur layanan masih dalam pengembangan.",
  },
  {
    q: "Mengapa tombol Masuk belum bisa digunakan?",
    a: "Ruang akun warga dan pelaku usaha masih dirancang. Saat tombol Masuk ditekan, PESONA menampilkan pemberitahuan bahwa fitur tersebut masih dalam pengembangan, sekaligus tautan ke peta jalan.",
  },
  {
    q: "Apakah angka dan data di situs ini nyata?",
    a: "Tidak. Nama penyedia, angka registry, jadwal pelatihan, contoh kode, dan simulasi pajak adalah data ilustrasi. Angka resmi mengikuti dokumen dan kanal Pemerintah Kabupaten Klungkung.",
  },
  {
    q: "Apakah PESONA menerbitkan izin atau menerima pembayaran?",
    a: "Tidak. PESONA diposisikan sebagai kanal edukasi dan pendampingan. Izin tetap diterbitkan instansi berwenang, pajak tetap dipungut pemerintah daerah, dan pembayaran hanya melalui kanal resmi.",
  },
  {
    q: "Untuk siapa PESONA disiapkan?",
    a: "Warga yang ingin memahami kewajiban pajak, pelaku usaha yang perlu mengurus administrasi, koperasi yang mengelola anggota dan listing, serta petugas yang melayani dan memantau permohonan.",
  },
] as const;

export const IMPACT = [
  {
    title: "Layanan publik",
    description:
      "Jalan, penerangan, pasar, dan fasilitas umum yang menopang aktivitas harian warga.",
    icon: "ph:road-horizon",
  },
  {
    title: "Pelestarian budaya",
    description:
      "Ruang bagi adat, seni, dan warisan Klungkung yang menjadi identitas bersama.",
    icon: "ph:mask-happy",
  },
  {
    title: "Usaha lokal",
    description:
      "Pendampingan, keterampilan, dan akses pasar untuk UMKM serta wisata yang berkelanjutan.",
    icon: "ph:chart-line-up",
  },
] as const;

export const ROADMAP = [
  {
    step: "01",
    title: "Konsep & konten",
    status: "Tahap saat ini",
    description:
      "Menyusun narasi, peta layanan, materi edukasi, kalkulator simulasi, dan standar tampilan publik.",
    current: true,
  },
  {
    step: "02",
    title: "Uji coba terbatas",
    status: "Direncanakan",
    description:
      "Menguji alur akun, verifikasi, dan pendampingan bersama kelompok usaha serta petugas terpilih.",
    current: false,
  },
  {
    step: "03",
    title: "Integrasi layanan",
    status: "Direncanakan",
    description:
      "Menghubungkan kanal dengan data dan layanan OPD terkait melalui tata kelola serta persetujuan yang sesuai.",
    current: false,
  },
  {
    step: "04",
    title: "Evaluasi & perluasan",
    status: "Direncanakan",
    description:
      "Mengukur manfaat, memperbaiki pengalaman pengguna, dan memperluas cakupan layanan secara bertahap.",
    current: false,
  },
] as const;

export const GOVERNANCE = [
  {
    title: "Data secukupnya",
    description:
      "Hanya meminta data yang diperlukan untuk layanan, dengan tujuan dan masa simpan yang jelas.",
    icon: "ph:file-dashed",
  },
  {
    title: "Persetujuan pemilik data",
    description:
      "Data usaha tidak dibagikan lintas layanan tanpa izin dan dasar yang sah.",
    icon: "ph:seal-check",
  },
  {
    title: "Manusia tetap memutuskan",
    description:
      "Sistem membantu menyiapkan dan memantau. Keputusan resmi tetap berada pada pejabat berwenang.",
    icon: "ph:user-circle-check",
  },
  {
    title: "Kanal koreksi",
    description:
      "Warga dapat meminta perbaikan data dan menyampaikan keberatan melalui kanal yang tercatat.",
    icon: "ph:arrows-clockwise",
  },
] as const;
