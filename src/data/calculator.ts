export type CalculatorField = {
  key: string;
  label: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  defaultValue: number;
};

export type CalcValues = Record<string, number>;

export type CalcResult = {
  resultLabel: string;
  value: number;
  caption: string;
  breakdown: { label: string; value: string }[];
};

export type Calculator = {
  id: string;
  name: string;
  long: string;
  icon: string;
  rateLabel: string;
  description: string;
  note: string;
  fields: CalculatorField[];
  compute: (values: CalcValues) => CalcResult;
};

export const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const number = (values: CalcValues, key: string) => Math.max(0, Number(values[key]) || 0);

export const CALCULATORS: Calculator[] = [
  {
    id: "pbjt",
    name: "PBJT",
    long: "Pajak Barang dan Jasa Tertentu",
    icon: "ph:fork-knife",
    rateLabel: "10%",
    description:
      "Untuk makanan-minuman, perhotelan, hiburan, dan parkir. Simulasi memakai tarif ilustrasi 10% dari omzet.",
    note: "Contoh: omzet satu masa pajak. Dasar pengenaan resmi dapat berbeda.",
    fields: [
      {
        key: "omzet",
        label: "Omzet / dasar pengenaan",
        hint: "Gunakan angka satu masa pajak, misalnya satu bulan.",
        prefix: "Rp",
        defaultValue: 25000000,
      },
    ],
    compute: (values) => {
      const omzet = number(values, "omzet");
      const value = omzet * 0.1;
      return {
        resultLabel: "Perkiraan PBJT",
        value,
        caption: `${formatIDR(omzet)} × tarif ilustrasi 10%`,
        breakdown: [
          { label: "Dasar pengenaan", value: formatIDR(omzet) },
          { label: "Tarif ilustrasi", value: "10%" },
          { label: "Perkiraan pajak", value: formatIDR(value) },
        ],
      };
    },
  },
  {
    id: "pbb-p2",
    name: "PBB-P2",
    long: "Pajak Bumi dan Bangunan Perdesaan dan Perkotaan",
    icon: "ph:house-line",
    rateLabel: "≤ 0,3%",
    description:
      "Simulasi PBB-P2 dari total NJOP dikurangi NJOPTKP, lalu dikalikan tarif ilustrasi.",
    note: "NJOP dan NJOPTKP resmi tercantum pada SPPT atau dokumen instansi berwenang.",
    fields: [
      { key: "njop", label: "Total NJOP", hint: "Gabungan nilai bumi dan bangunan.", prefix: "Rp", defaultValue: 500000000 },
      { key: "njoptkp", label: "NJOPTKP", hint: "Nilai tidak kena pajak menurut ketentuan.", prefix: "Rp", defaultValue: 10000000 },
      { key: "rate", label: "Tarif ilustrasi", hint: "Tarif PBB-P2 ditetapkan daerah, paling tinggi 0,3%.", suffix: "%", defaultValue: 0.2 },
    ],
    compute: (values) => {
      const njop = number(values, "njop");
      const njoptkp = number(values, "njoptkp");
      const rate = Math.max(0, Number(values.rate) || 0);
      const base = Math.max(0, njop - njoptkp);
      const value = base * (rate / 100);
      return {
        resultLabel: "Perkiraan PBB-P2",
        value,
        caption: `(${formatIDR(njop)} − ${formatIDR(njoptkp)}) × ${rate.toLocaleString("id-ID")}%`,
        breakdown: [
          { label: "Total NJOP", value: formatIDR(njop) },
          { label: "NJOPTKP", value: formatIDR(njoptkp) },
          { label: "Dasar perhitungan", value: formatIDR(base) },
          { label: "Tarif ilustrasi", value: `${rate.toLocaleString("id-ID")}%` },
          { label: "Perkiraan pajak", value: formatIDR(value) },
        ],
      };
    },
  },
  {
    id: "bphtb",
    name: "BPHTB",
    long: "Bea Perolehan Hak atas Tanah dan Bangunan",
    icon: "ph:signature",
    rateLabel: "5%",
    description:
      "Simulasi BPHTB dari nilai perolehan hak setelah dikurangi NPOPTKP, dengan tarif ilustrasi 5%.",
    note: "Perolehan karena waris atau hibah dapat memiliki perlakuan khusus.",
    fields: [
      { key: "npop", label: "Nilai perolehan objek (NPOP)", prefix: "Rp", defaultValue: 800000000 },
      { key: "npoptkp", label: "NPOPTKP", hint: "Nilai perolehan objek tidak kena pajak.", prefix: "Rp", defaultValue: 60000000 },
      { key: "rate", label: "Tarif ilustrasi", suffix: "%", defaultValue: 5 },
    ],
    compute: (values) => {
      const npop = number(values, "npop");
      const npoptkp = number(values, "npoptkp");
      const rate = Math.max(0, Number(values.rate) || 0);
      const base = Math.max(0, npop - npoptkp);
      const value = base * (rate / 100);
      return {
        resultLabel: "Perkiraan BPHTB",
        value,
        caption: `(${formatIDR(npop)} − ${formatIDR(npoptkp)}) × ${rate.toLocaleString("id-ID")}%`,
        breakdown: [
          { label: "NPOP", value: formatIDR(npop) },
          { label: "NPOPTKP", value: formatIDR(npoptkp) },
          { label: "Dasar perhitungan", value: formatIDR(base) },
          { label: "Tarif ilustrasi", value: `${rate.toLocaleString("id-ID")}%` },
          { label: "Perkiraan pajak", value: formatIDR(value) },
        ],
      };
    },
  },
  {
    id: "reklame",
    name: "Reklame",
    long: "Pajak atas penyelenggaraan reklame",
    icon: "ph:signpost",
    rateLabel: "Sesuai Perda",
    description:
      "Tarif reklame dipengaruhi jenis media, ukuran, lokasi, dan durasi. Simulasi ini memakai nilai sewa dan tarif yang Anda isi.",
    note: "Izin reklame berbeda dari pajak reklame. Keduanya memiliki proses dan instansi sendiri.",
    fields: [
      { key: "nilaiSewa", label: "Nilai sewa / kontrak reklame", prefix: "Rp", defaultValue: 100000000 },
      { key: "rate", label: "Tarif ilustrasi", hint: "Isi sesuai skenario belajar Anda.", suffix: "%", defaultValue: 10 },
    ],
    compute: (values) => {
      const nilaiSewa = number(values, "nilaiSewa");
      const rate = Math.max(0, Number(values.rate) || 0);
      const value = nilaiSewa * (rate / 100);
      return {
        resultLabel: "Perkiraan pajak reklame",
        value,
        caption: `${formatIDR(nilaiSewa)} × ${rate.toLocaleString("id-ID")}% (tarif isian)`,
        breakdown: [
          { label: "Nilai sewa / dasar", value: formatIDR(nilaiSewa) },
          { label: "Tarif isian", value: `${rate.toLocaleString("id-ID")}%` },
          { label: "Perkiraan pajak", value: formatIDR(value) },
        ],
      };
    },
  },
  {
    id: "air-tanah",
    name: "Air Tanah",
    long: "Pajak atas pemanfaatan air tanah",
    icon: "ph:drop",
    rateLabel: "Sesuai Perda",
    description:
      "Simulasi sederhana dari volume pemakaian dikalikan tarif per meter kubik. Nilai perolehan air resmi dapat berbeda.",
    note: "Izin pemanfaatan dan konservasi air tanah berada pada instansi berwenang.",
    fields: [
      { key: "volume", label: "Volume pemakaian", hint: "Gunakan volume satu masa pajak.", suffix: "m³", defaultValue: 100 },
      { key: "tarif", label: "Tarif ilustrasi per m³", prefix: "Rp", defaultValue: 10000 },
    ],
    compute: (values) => {
      const volume = number(values, "volume");
      const tarif = number(values, "tarif");
      const value = volume * tarif;
      return {
        resultLabel: "Perkiraan pajak air tanah",
        value,
        caption: `${volume.toLocaleString("id-ID")} m³ × ${formatIDR(tarif)} per m³`,
        breakdown: [
          { label: "Volume pemakaian", value: `${volume.toLocaleString("id-ID")} m³` },
          { label: "Tarif ilustrasi", value: `${formatIDR(tarif)} / m³` },
          { label: "Perkiraan pajak", value: formatIDR(value) },
        ],
      };
    },
  },
];

export const getCalculator = (id: string) => CALCULATORS.find((calculator) => calculator.id === id);
