import raw from "../data/prototype.json";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type Tax = {
  id: string;
  name: string;
  long: string;
  icon: string;
  tone: string;
  rate: string;
  rateNote: string;
  period: string;
  due: string;
  subject: string;
  object: string;
  summary: string;
  subtypes: string[];
  points: string[];
  docs: string[];
  channels: string[];
  example: { label: string; result: string; note: string };
  legal: string;
};

export type ArticleBodyNode = {
  t: "p" | "h" | "list" | "note" | "table";
  x: string | string[] | string[][];
};

export type Article = {
  id: string;
  title: string;
  category: string;
  minutes: number;
  level: string;
  module: string;
  featured?: boolean;
  image?: string;
  excerpt: string;
  body: ArticleBodyNode[];
  takeaways: string[];
};

export type LearningPath = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  tone: string;
};

export type Provider = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  area: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  level: 1 | 2 | 3;
  status: string;
  licenses: string[];
  certifications: string[];
  desc: string;
  capacity: string;
  since: string;
  contact: string;
  tone: string;
  featured?: boolean;
};

export type Training = {
  id: string;
  cat: string;
  title: string;
  duration: string;
  mode: string;
  price: number;
  subsidy: number;
  quota: number;
  provider: string;
  desc: string;
  tone: string;
  certified: boolean;
  start: string;
};

export type Partner = {
  name: string;
  role: string;
  icon: string;
  tone: string;
};

export type Cooperative = {
  name: string;
  area: string;
  members: number;
  listings: number;
  monthlyBookings: number;
  monthlyValue: number;
  split: { label: string; pct: number; tone: string }[];
  report: { label: string; value: string }[];
  note: string;
};

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

export const taxes = raw.taxes as Tax[];
export const articles = raw.articles as Article[];
export const learningPaths = raw.learningPaths as LearningPath[];
export const providers = raw.usaha.providers as Provider[];
export const trainings = raw.usaha.trainings as Training[];
export const partners = raw.usaha.partners as Partner[];
export const cooperative = raw.usaha.cooperative as Cooperative;
export const usahaCategories = raw.usaha.categories;
export const usahaStats = raw.usaha.stats;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export const taxMeta: Record<
  string,
  { slug: string; icon: string; label: string; tone: string }
> = {
  pbjt: { slug: "pbjt", icon: "ph:fork-knife", label: "Makanan, minuman, penginapan", tone: "forest" },
  pbb: { slug: "pbb-p2", icon: "ph:house-line", label: "Tanah dan bangunan", tone: "mint" },
  bphtb: { slug: "bphtb", icon: "ph:signature", label: "Perolehan hak", tone: "peach" },
  reklame: { slug: "reklame", icon: "ph:signpost", label: "Media luar ruang", tone: "sand" },
  pat: { slug: "air-tanah", icon: "ph:drop", label: "Pemanfaatan air tanah", tone: "stone" },
};

export const taxList = taxes.map((tax) => ({
  ...tax,
  slug: taxMeta[tax.id]?.slug ?? tax.id,
  iconName: taxMeta[tax.id]?.icon ?? "ph:file-text",
  areaLabel: taxMeta[tax.id]?.label ?? "",
  toneName: taxMeta[tax.id]?.tone ?? "forest",
}));

export type TaxDisplay = (typeof taxList)[number];

export const getTaxBySlug = (slug: string) => taxList.find((tax) => tax.slug === slug);

export const getArticle = (id: string) => articles.find((article) => article.id === id);

export const getLearningPath = (id: string) =>
  learningPaths.find((path) => path.id === id) ?? learningPaths[0];

export const articleTone: Record<string, { soft: string; icon: string; text: string }> = {
  PBJT: { soft: "bg-forest-50", icon: "bg-forest-100 text-forest-800", text: "text-forest-800" },
  Administrasi: { soft: "bg-[#F5F4FF]", icon: "bg-[#EAE9FF] text-[#4F47A3]", text: "text-[#4F47A3]" },
  "PBB-P2": { soft: "bg-[#EDF5FD]", icon: "bg-[#E2ECF7] text-forest-800", text: "text-forest-800" },
  Panduan: { soft: "bg-sand-50", icon: "bg-sand-100 text-honey-800", text: "text-honey-800" },
  Reklame: { soft: "bg-sand-50", icon: "bg-sand-100 text-honey-800", text: "text-honey-800" },
  BPHTB: { soft: "bg-[#F5F4FF]", icon: "bg-[#EAE9FF] text-[#4F47A3]", text: "text-[#4F47A3]" },
  Pembayaran: { soft: "bg-forest-50", icon: "bg-forest-100 text-forest-800", text: "text-forest-800" },
  Kepatuhan: { soft: "bg-[#E7ECF3]", icon: "bg-[#E7ECF3] text-[#4F47A3]", text: "text-[#4F47A3]" },
  PAT: { soft: "bg-[#EDF5FD]", icon: "bg-[#E2ECF7] text-forest-800", text: "text-forest-800" },
};

export const articleIconByCategory: Record<string, string> = {
  PBJT: "ph:fork-knife",
  Administrasi: "ph:note-pencil",
  "PBB-P2": "ph:house-line",
  Panduan: "ph:compass",
  Reklame: "ph:signpost",
  BPHTB: "ph:signature",
  Pembayaran: "ph:qr-code",
  Kepatuhan: "ph:shield-check",
  PAT: "ph:drop",
};

export const moduleLabel: Record<string, string> = {
  dasar: "Dasar pajak daerah",
  administrasi: "Administrasi usaha",
  hitung: "Cara menghitung",
  patuh: "Kepatuhan & sanksi",
};

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);

export const readingLabel = (minutes: number) => `${minutes} menit baca`;
