/* PESONA — data simulasi untuk prototipe frontend.
   Semua angka, nama, dan status di file ini adalah fiktif. */
(function () {
  "use strict";

  const taxes = [
    {
      id: "pbjt",
      name: "PBJT",
      long: "Pajak Barang dan Jasa Tertentu",
      icon: "utensils",
      tone: "forest",
      rate: "10%",
      rateNote: "Tarif paling tinggi 10% dari dasar pengenaan pajak.",
      period: "Bulanan",
      due: "Akhir bulan berikutnya",
      subject: "Konsumen akhir, dipungut oleh pengusaha",
      object: "Makanan dan minuman, perhotelan, hiburan, serta parkir",
      summary:
        "Pajak yang melekat pada transaksi tertentu di sektor makanan-minuman, penginapan, hiburan, dan parkir. Pengusaha memungut dari konsumen lalu menyetorkannya ke kas daerah.",
      subtypes: ["Makanan & minuman", "Perhotelan", "Hiburan", "Parkir"],
      points: [
        "Dipungut oleh pengusaha yang memiliki kewajiban pajak daerah.",
        "Dasar pengenaan umumnya adalah jumlah pembayaran yang diterima.",
        "Dilaporkan setiap masa pajak, umumnya bulanan.",
        "Bukti pungut dan catatan omzet perlu disimpan dengan tertib."
      ],
      docs: ["NPWPD", "Catatan omzet atau penjualan", "Bukti pungut", "Bukti setor pajak"],
      channels: ["QRIS", "Bank persepsi", "Meja layanan MPP"],
      example: {
        label: "Omzet Rp25.000.000 × 10%",
        result: "Rp2.500.000",
        note: "Ilustrasi sederhana sebelum memperhatikan ketentuan dasar pengenaan yang berlaku."
      },
      legal:
        "Kerangka umum mengacu pada UU HKPD dan ketentuan daerah. Tarif, dasar pengenaan, serta tata cara resmi mengikuti Perda Kabupaten Klungkung dan peraturan pelaksanaannya."
    },
    {
      id: "pbb",
      name: "PBB-P2",
      long: "Pajak Bumi dan Bangunan Perdesaan dan Perkotaan",
      icon: "house",
      tone: "mint",
      rate: "≤ 0,3%",
      rateNote: "Tarif ditetapkan daerah, paling tinggi 0,3% dari NJOP.",
      period: "Tahunan",
      due: "Sesuai SPPT dan Perda",
      subject: "Pemilik, penguasa, atau pemanfaat tanah dan bangunan",
      object: "Bumi dan/atau bangunan yang dimiliki atau dimanfaatkan",
      summary:
        "Pajak tahunan atas tanah dan bangunan. Nilai pajak dihitung dari NJOP setelah dikurangi NJOPTKP, lalu dikalikan tarif yang ditetapkan daerah.",
      subtypes: ["Tanah", "Bangunan", "Tanah & bangunan"],
      points: [
        "Objek dan nilai dihitung berdasarkan NJOP.",
        "NJOPTKP mengurangi dasar perhitungan sesuai ketentuan.",
        "SPPT memuat rincian objek, nilai, dan jumlah pajak terutang.",
        "Perubahan data objek perlu dilaporkan agar SPPT akurat."
      ],
      docs: ["SPPT", "KTP pemilik", "Bukti kepemilikan atau penguasaan", "Bukti pembayaran sebelumnya"],
      channels: ["QRIS", "Bank persepsi", "Kantor pos atau mitra resmi"],
      example: {
        label: "(NJOP Rp500.000.000 − NJOPTKP Rp10.000.000) × 0,2%",
        result: "Rp980.000",
        note: "Tarif 0,2% dan NJOPTKP Rp10 juta hanya contoh. Nilai resmi mengikuti SPPT."
      },
      legal:
        "Tarif PBB-P2 ditetapkan dengan Perda, paling tinggi 0,3%. Nilai dan tanggal jatuh tempo resmi tercantum pada SPPT atau pengumuman pemerintah daerah."
    },
    {
      id: "bphtb",
      name: "BPHTB",
      long: "Bea Perolehan Hak atas Tanah dan Bangunan",
      icon: "file-signature",
      tone: "peach",
      rate: "5%",
      rateNote: "Tarif umum 5% dari NPOP setelah dikurangi NPOPTKP.",
      period: "Saat perolehan hak",
      due: "Sebelum atau bersamaan pendaftaran peralihan",
      subject: "Pihak yang memperoleh hak atas tanah dan/atau bangunan",
      object: "Jual beli, hibah, waris, dan perolehan hak lainnya",
      summary:
        "Pajak atas perolehan hak atas tanah dan bangunan. Dihitung dari nilai perolehan setelah dikurangi nilai perolehan objek tidak kena pajak.",
      subtypes: ["Jual beli", "Hibah", "Waris", "Tukar-menukar"],
      points: [
        "Umumnya dibayar oleh pihak pembeli atau penerima hak.",
        "Nilai perolehan dapat berbeda dari harga transaksi sesuai ketentuan.",
        "Perolehan karena waris atau hibah memiliki aturan khusus.",
        "Bukti bayar diperlukan dalam proses peralihan hak."
      ],
      docs: ["Akta atau dokumen perolehan hak", "KTP dan NPWP pihak terkait", "Bukti nilai transaksi", "Dokumen pendukung status objek"],
      channels: ["Bank persepsi", "Kanal resmi pemerintah daerah"],
      example: {
        label: "(NPOP Rp800.000.000 − NPOPTKP Rp60.000.000) × 5%",
        result: "Rp37.000.000",
        note: "NPOPTKP dan perlakuan khusus dapat berbeda menurut jenis perolehan."
      },
      legal:
        "Tarif umum BPHTB adalah 5%. Nilai perolehan objek tidak kena pajak serta pengecualian tertentu mengikuti ketentuan perpajakan daerah yang berlaku."
    },
    {
      id: "reklame",
      name: "Pajak Reklame",
      long: "Pajak atas penyelenggaraan reklame",
      icon: "signpost",
      tone: "sand",
      rate: "Sesuai Perda",
      rateNote: "Tarif ditentukan berdasarkan jenis, ukuran, lokasi, dan durasi.",
      period: "Sesuai ketentuan daerah",
      due: "Mengikuti masa atau izin reklame",
      subject: "Penyelenggara atau pemilik reklame",
      object: "Papan, baliho, spanduk, papan nama, dan reklame digital",
      summary:
        "Pajak atas penyelenggaraan reklame di ruang publik atau tempat tertentu. Besaran dipengaruhi jenis media, ukuran, lokasi, dan lama penyelenggaraan.",
      subtypes: ["Papan & baliho", "Spanduk", "Papan nama", "Reklame digital"],
      points: [
        "Pajak reklame berbeda dari izin penyelenggaraan reklame.",
        "Nilai sewa atau kontrak dapat menjadi salah satu komponen perhitungan.",
        "Reklame digital dan media baru mengikuti ketentuan yang berlaku.",
        "Data media dan titik pemasangan perlu didaftarkan dengan benar."
      ],
      docs: ["NPWPD", "Data media dan ukuran", "Lokasi dan durasi", "Dokumen izin bila dipersyaratkan"],
      channels: ["Bank persepsi", "Kanal resmi pemerintah daerah"],
      example: {
        label: "Nilai sewa × tarif reklame",
        result: "Sesuai Perda",
        note: "Gunakan kalkulator dengan tarif ilustrasi atau konsultasikan nilai resminya."
      },
      legal:
        "Objek, tarif, dan tata cara pajak reklame diatur dalam Perda. Izin reklame merupakan kewenangan instansi perizinan, bukan bagian dari pajak."
    },
    {
      id: "pat",
      name: "Pajak Air Tanah",
      long: "Pajak atas pemanfaatan air tanah",
      icon: "droplets",
      tone: "stone",
      rate: "Sesuai Perda",
      rateNote: "Tarif ditetapkan berdasarkan nilai perolehan air dan ketentuan daerah.",
      period: "Bulanan",
      due: "Mengikuti ketentuan masa pajak",
      subject: "Orang atau badan yang memanfaatkan air tanah",
      object: "Pengambilan dan pemanfaatan air tanah",
      summary:
        "Pajak atas pemanfaatan air tanah, umumnya dihitung dari volume yang diambil dan nilai perolehan air. Izin pemanfaatan air tanah diatur terpisah.",
      subtypes: ["Industri", "Perhotelan", "Komercial", "Lainnya"],
      points: [
        "Perhitungan umumnya mempertimbangkan volume pemakaian.",
        "Izin pemanfaatan air tanah diatur oleh instansi berwenang.",
        "Pencatatan meter atau volume perlu dilakukan secara rutin.",
        "Pemanfaatan harus memperhatikan daya dukung lingkungan."
      ],
      docs: ["NPWPD", "Data titik dan izin pemanfaatan", "Catatan volume pemakaian", "Bukti pembayaran sebelumnya"],
      channels: ["Bank persepsi", "Kanal resmi pemerintah daerah"],
      example: {
        label: "Volume 100 m³ × tarif ilustrasi Rp10.000",
        result: "Rp1.000.000",
        note: "Tarif dan nilai perolehan air resmi mengikuti ketentuan daerah."
      },
      legal:
        "Pajak air tanah diatur dalam Perda dengan memperhatikan ketentuan pusat. Izin dan konservasi sumber daya air berada pada instansi yang berwenang."
    }
  ];

  const articles = [
    {
      id: "pbjt-dasar",
      title: "Apa itu PBJT dan siapa yang wajib memungutnya?",
      category: "PBJT",
      minutes: 6,
      level: "Dasar",
      module: "dasar",
      featured: true,
      image: "assets/img/kuliner.jpg",
      excerpt:
        "PBJT ada di struk kafe, hotel, dan tempat parkir. Pahami siapa yang memungut dan bagaimana uangnya mengalir ke kas daerah.",
      body: [
        { t: "p", x: "PBJT adalah pajak daerah yang dikenakan atas pembelian barang dan/atau jasa tertentu di daerah. Di Kabupaten Klungkung, objek yang paling sering ditemui adalah makanan dan minuman, jasa perhotelan, hiburan, dan parkir." },
        { t: "h", x: "Siapa yang memungut?" },
        { t: "p", x: "Pengusaha yang menyediakan layanan tersebut memungut PBJT dari konsumen, lalu menyetorkannya ke kas daerah. Pembeli akan melihat pajak pada struk; pengusaha bertanggung jawab menghitung, melaporkan, dan membayar." },
        { t: "p", x: "Karena itu, PBJT bukan pajak yang ditagih terpisah kepada pengunjung. Pajak sudah menjadi bagian dari transaksi yang dilakukan di usaha tersebut." },
        { t: "h", x: "Contoh sederhana" },
        { t: "p", x: "Sebuah kafe mencatat omzet Rp25.000.000 dalam satu masa pajak. Dengan ilustrasi tarif 10%, perkiraan PBJT adalah Rp2.500.000. Angka ini belum tentu sama dengan nilai resmi karena dasar pengenaan dan ketentuan daerah perlu diperhatikan." },
        { t: "h", x: "Yang perlu disiapkan pengusaha" },
        { t: "list", x: ["NPWPD sebagai identitas wajib pajak daerah.", "Catatan omzet harian atau penjualan yang rapi.", "Perhitungan pajak setiap masa pajak.", "Bukti pungut, bukti setor, dan arsip pelaporan."] },
        { t: "note", x: "PBJT berbeda dari PPh dan PPN yang dikelola pemerintah pusat. Satu transaksi usaha dapat memiliki kewajiban pusat dan daerah sekaligus, tergantung ketentuan yang berlaku." },
        { t: "p", x: "Jika masih ragu, mulai dari mencatat transaksi dan memahami objek pajaknya. Gunakan fitur konsultasi untuk membahas kasus usaha Anda dengan petugas." }
      ],
      takeaways: [
        "PBJT dipungut pengusaha dari konsumen, lalu disetorkan ke kas daerah.",
        "Objek yang umum dijumpai: makanan-minuman, perhotelan, hiburan, dan parkir.",
        "Catatan omzet dan bukti pungut adalah dasar administrasi yang penting."
      ]
    },
    {
      id: "daftar-npwpd",
      title: "Cara daftar NPWPD untuk usaha baru",
      category: "Administrasi",
      minutes: 5,
      level: "Dasar",
      module: "administrasi",
      excerpt:
        "NPWPD adalah identitas wajib pajak daerah. Ini dokumen, langkah, dan hal yang sering terlewat saat mendaftar.",
      body: [
        { t: "p", x: "NPWPD atau Nomor Pokok Wajib Pajak Daerah adalah identitas yang digunakan saat mendaftar, melapor, dan membayar pajak daerah. Memilikinya membuat administrasi usaha lebih tertib dan memudahkan akses layanan." },
        { t: "h", x: "Siapa yang perlu mendaftar?" },
        { t: "p", x: "Usaha yang memiliki objek pajak daerah, seperti restoran, kafe, penginapan, tempat hiburan, pengelola parkir, penyelenggara reklame, atau pengguna air tanah. Kewajiban spesifik tetap mengikuti jenis usaha dan ketentuan daerah." },
        { t: "h", x: "Dokumen yang umum disiapkan" },
        { t: "list", x: ["KTP pemilik atau penanggung jawab.", "NIB atau dokumen izin usaha yang relevan.", "Data lokasi dan jenis kegiatan usaha.", "Foto lokasi atau bukti operasional.", "Surat kuasa bila pendaftaran diwakilkan."] },
        { t: "h", x: "Alur pendaftaran" },
        { t: "list", x: ["Isi data identitas dan usaha.", "Unggah dokumen pendukung.", "Periksa ringkasan dan kirim permohonan.", "Pantau verifikasi melalui nomor permohonan.", "Simpan NPWPD dan gunakan pada setiap pelaporan."] },
        { t: "p", x: "Dalam prototipe ini, alur pendaftaran dapat dicoba pada menu Layanan. Tidak ada dokumen yang benar-benar diunggah dan tidak ada data yang dikirim ke server." },
        { t: "note", x: "Pastikan nama, alamat, dan jenis usaha sama dengan dokumen resmi. Perbedaan data adalah penyebab umum permohonan dikembalikan." }
      ],
      takeaways: [
        "NPWPD digunakan untuk seluruh administrasi pajak daerah.",
        "Siapkan KTP, NIB/izin, data lokasi, dan bukti operasional.",
        "Periksa konsistensi data sebelum mengirim permohonan."
      ]
    },
    {
      id: "pbb-njoptkp",
      title: "Menghitung PBB-P2: kenali NJOP dan NJOPTKP",
      category: "PBB-P2",
      minutes: 7,
      level: "Menengah",
      module: "hitung",
      excerpt:
        "NJOP bukan harga jual bebas, dan NJOPTKP mengurangi dasar pajak. Simak cara membaca SPPT dan contoh perhitungannya.",
      body: [
        { t: "p", x: "PBB-P2 dihitung dari Nilai Jual Objek Pajak (NJOP) tanah dan bangunan. NJOP ditetapkan pemerintah daerah dan tercantum dalam SPPT, bukan sekadar harga yang disebut saat jual beli." },
        { t: "h", x: "Apa itu NJOPTKP?" },
        { t: "p", x: "NJOPTKP adalah Nilai Jual Objek Pajak Tidak Kena Pajak. Nilai ini dikurangkan lebih dahulu dari NJOP sebelum tarif pajak diterapkan. Besarannya diatur dalam ketentuan daerah." },
        { t: "h", x: "Contoh perhitungan" },
        { t: "p", x: "Misalnya NJOP bumi Rp300.000.000 dan NJOP bangunan Rp200.000.000. Total NJOP Rp500.000.000. Dengan ilustrasi NJOPTKP Rp10.000.000 dan tarif 0,2%, dasar perhitungan menjadi Rp490.000.000 dan pajaknya Rp980.000." },
        { t: "table", x: [["NJOP bumi", "Rp300.000.000"], ["NJOP bangunan", "Rp200.000.000"], ["Total NJOP", "Rp500.000.000"], ["NJOPTKP (ilustrasi)", "Rp10.000.000"], ["Dasar perhitungan", "Rp490.000.000"], ["Tarif (ilustrasi)", "0,2%"], ["PBB terutang", "Rp980.000"]] },
        { t: "h", x: "Membaca SPPT" },
        { t: "list", x: ["Periksa nama dan alamat wajib pajak.", "Cocokkan luas serta nilai tanah dan bangunan.", "Lihat tanggal jatuh tempo.", "Simpan bukti pembayaran setelah membayar."] },
        { t: "note", x: "Tarif PBB-P2 ditetapkan daerah, paling tinggi 0,3%. Angka pada contoh adalah ilustrasi, bukan ketetapan untuk objek tertentu." }
      ],
      takeaways: [
        "PBB-P2 dihitung dari NJOP yang tercantum pada SPPT.",
        "NJOPTKP dikurangkan sebelum tarif diterapkan.",
        "Periksa data objek dan simpan bukti pembayaran."
      ]
    },
    {
      id: "kalender-pajak",
      title: "Kalender kewajiban pajak daerah",
      category: "Panduan",
      minutes: 4,
      level: "Dasar",
      module: "dasar",
      excerpt:
        "Kapan lapor PBJT, PBB-P2, atau pajak reklame? Susun pengingat agar administrasi usaha tidak menumpuk di akhir bulan.",
      body: [
        { t: "p", x: "Setiap jenis pajak daerah memiliki masa dan tenggat yang berbeda. Menyusun kalender sederhana membantu pengusaha menghindari keterlambatan dan antrean di akhir periode." },
        { t: "h", x: "Gambaran umum" },
        { t: "list", x: ["PBJT umumnya dilaporkan dan disetor setiap bulan.", "PBB-P2 bersifat tahunan dan mengikuti SPPT.", "BPHTB muncul saat terjadi perolehan hak.", "Pajak reklame dan air tanah mengikuti masa yang ditetapkan daerah."] },
        { t: "p", x: "Tanggal pasti dapat berbeda menurut jenis pajak dan ketentuan yang berlaku. Selalu cocokkan dengan pengumuman resmi, SPPT, atau kode billing yang diterima." },
        { t: "h", x: "Kebiasaan kecil yang membantu" },
        { t: "list", x: ["Catat transaksi setiap hari, bukan setiap akhir bulan.", "Buat pengingat tiga hari sebelum tenggat.", "Simpan bukti lapor dan bayar di satu folder.", "Cek status pelaporan setelah melakukan pembayaran."] },
        { t: "note", x: "Kalender pada prototipe ini menggunakan tanggal ilustrasi. Jangan menjadikannya patokan resmi." }
      ],
      takeaways: [
        "Masa pajak berbeda untuk setiap jenis pajak.",
        "Catatan harian mengurangi beban administrasi akhir bulan.",
        "Selalu gunakan tanggal dari kanal resmi pemerintah daerah."
      ]
    },
    {
      id: "reklame-media",
      title: "Pajak reklame: media apa saja yang dikenakan?",
      category: "Reklame",
      minutes: 5,
      level: "Menengah",
      module: "hitung",
      excerpt:
        "Baliho, spanduk, papan nama, sampai reklame digital. Kenali objek pajak dan komponen yang memengaruhi nilainya.",
      body: [
        { t: "p", x: "Pajak reklame dikenakan atas penyelenggaraan reklame. Objeknya tidak hanya baliho besar, tetapi dapat mencakup spanduk, papan nama, reklame di kendaraan, dan media digital tertentu." },
        { t: "h", x: "Siapa yang membayar?" },
        { t: "p", x: "Pihak yang menyelenggarakan atau memiliki reklame. Jika reklame dipasang oleh pihak ketiga, peran dan kewajiban masing-masing perlu diperjelas dalam kontrak." },
        { t: "h", x: "Komponen yang memengaruhi nilai" },
        { t: "list", x: ["Jenis dan bahan media.", "Ukuran reklame.", "Lokasi pemasangan.", "Durasi penyelenggaraan.", "Nilai sewa atau kontrak reklame."] },
        { t: "p", x: "Karena komponennya beragam, kalkulator PESONA meminta tarif atau nilai dasar dari pengguna. Hasilnya adalah simulasi, bukan penetapan pajak." },
        { t: "note", x: "Izin reklame dan pajak reklame adalah dua hal berbeda. Izin diterbitkan instansi berwenang; pajak dipungut berdasarkan ketentuan daerah." }
      ],
      takeaways: [
        "Reklame mencakup media luar ruang dan beberapa media digital.",
        "Nilai dipengaruhi jenis, ukuran, lokasi, dan durasi.",
        "Izin reklame tidak sama dengan pembayaran pajak reklame."
      ]
    },
    {
      id: "bphtb-jual-beli",
      title: "BPHTB saat jual beli tanah: siapa yang membayar?",
      category: "BPHTB",
      minutes: 6,
      level: "Menengah",
      module: "dasar",
      excerpt:
        "BPHTB melekat pada perolehan hak, bukan pada penjual. Pahami dasar perhitungan dan kaitannya dengan proses peralihan.",
      body: [
        { t: "p", x: "BPHTB dikenakan ketika seseorang atau badan memperoleh hak atas tanah dan/atau bangunan. Dalam jual beli, kewajiban umumnya berada pada pembeli sebagai pihak yang memperoleh hak." },
        { t: "h", x: "Dasar perhitungan" },
        { t: "p", x: "Nilai perolehan objek pajak (NPOP) menjadi dasar, kemudian dikurangi NPOPTKP sesuai ketentuan. Tarif umumnya 5%. Nilai yang digunakan dapat merujuk pada harga transaksi atau nilai pasar sesuai aturan." },
        { t: "h", x: "Contoh" },
        { t: "p", x: "Bila NPOP Rp800.000.000 dan ilustrasi NPOPTKP Rp60.000.000, dasar perhitungan menjadi Rp740.000.000. Dengan tarif 5%, BPHTB sekitar Rp37.000.000." },
        { t: "h", x: "Kaitan dengan peralihan hak" },
        { t: "p", x: "Bukti pembayaran BPHTB umumnya menjadi salah satu syarat dalam proses pendaftaran peralihan hak. Karena itu, hitung dan siapkan kewajiban ini sebelum transaksi ditutup." },
        { t: "note", x: "Perolehan karena waris atau hibah memiliki perlakuan khusus. Jangan menggunakan contoh ini sebagai dasar transaksi tanpa konsultasi." }
      ],
      takeaways: [
        "BPHTB dibayar oleh pihak yang memperoleh hak.",
        "Dasar perhitungan adalah NPOP setelah dikurangi NPOPTKP.",
        "Perlakuan waris dan hibah memiliki ketentuan khusus."
      ]
    },
    {
      id: "bayar-qris",
      title: "Bayar pajak lewat QRIS: langkah demi langkah",
      category: "Pembayaran",
      minutes: 3,
      level: "Dasar",
      module: "administrasi",
      excerpt:
        "Pastikan kode billing benar, periksa nama dan nominal, lalu simpan bukti bayar. Ini urutan aman membayar lewat QRIS.",
      body: [
        { t: "p", x: "QRIS memudahkan pembayaran pajak daerah dari ponsel. Namun, tetap ada hal yang perlu diperiksa agar pembayaran masuk ke tagihan yang benar." },
        { t: "h", x: "Langkah aman" },
        { t: "list", x: ["Buat atau buka kode billing dari kanal resmi.", "Periksa nama wajib pajak, jenis pajak, masa, dan nominal.", "Pindai QRIS dari kanal resmi, bukan gambar yang diteruskan sembarangan.", "Konfirmasi pembayaran di aplikasi pembayaran.", "Simpan bukti bayar dan cek status pelaporan."] },
        { t: "h", x: "Tanda yang perlu diwaspadai" },
        { t: "list", x: ["Nominal berbeda dari tagihan.", "Nama penerima bukan kanal resmi pemerintah daerah.", "Permintaan membayar ke rekening pribadi.", "Kode billing dikirim oleh pihak yang tidak dikenal."] },
        { t: "p", x: "Jika pembayaran berhasil tetapi status belum berubah, simpan bukti transaksi dan hubungi layanan resmi. Jangan membayar dua kali hanya karena status belum diperbarui." },
        { t: "note", x: "Prototipe ini tidak memproses pembayaran nyata. Tombol bayar hanya mensimulasikan alur." }
      ],
      takeaways: [
        "Selalu buat kode billing dari kanal resmi.",
        "Periksa nama, jenis pajak, masa, dan nominal sebelum membayar.",
        "Simpan bukti bayar sampai status pelaporan diperbarui."
      ]
    },
    {
      id: "telat-lapor",
      title: "Terlambat lapor: apa yang perlu dilakukan?",
      category: "Kepatuhan",
      minutes: 4,
      level: "Dasar",
      module: "patuh",
      excerpt:
        "Jangan menunggu masalah menumpuk. Ini langkah praktis menghadapi keterlambatan pelaporan atau pembayaran.",
      body: [
        { t: "p", x: "Keterlambatan bisa terjadi karena lupa, usaha sedang sibuk, atau data belum lengkap. Yang penting adalah segera mengambil langkah, bukan menunda sampai tagihan bertambah." },
        { t: "h", x: "Langkah yang dapat dilakukan" },
        { t: "list", x: ["Periksa kewajiban dan masa pajak yang belum diselesaikan.", "Lengkapi data transaksi atau omzet.", "Laporkan segera melalui kanal resmi.", "Bayar pokok pajak dan selesaikan kewajiban administrasi sesuai ketentuan.", "Simpan seluruh bukti dan konfirmasi petugas."] },
        { t: "h", x: "Jika ada kendala" },
        { t: "p", x: "Sampaikan kondisi Anda kepada petugas. Beberapa keadaan mungkin memiliki mekanisme tersendiri, tetapi keputusannya tetap mengikuti ketentuan yang berlaku. Hindari menggunakan jasa pihak tidak resmi yang menjanjikan penghapusan sanksi." },
        { t: "note", x: "Sanksi administratif diatur dalam ketentuan daerah. Artikel ini tidak menghitung besaran sanksi dan tidak menggantikan konsultasi resmi." }
      ],
      takeaways: [
        "Segera periksa dan laporkan kewajiban yang terlambat.",
        "Simpan bukti lapor dan bayar.",
        "Gunakan kanal resmi, bukan perantara tidak resmi."
      ]
    },
    {
      id: "air-tanah",
      title: "Pajak air tanah dan pemanfaatan yang bijak",
      category: "PAT",
      minutes: 5,
      level: "Menengah",
      module: "dasar",
      excerpt:
        "Volume pemakaian memengaruhi pajak, sementara izin dan konservasi diatur terpisah. Kenali perbedaannya.",
      body: [
        { t: "p", x: "Pajak air tanah dikenakan atas pemanfaatan air tanah. Nilainya umumnya mempertimbangkan volume pengambilan dan nilai perolehan air yang ditetapkan daerah." },
        { t: "h", x: "Pajak bukan izin" },
        { t: "p", x: "Izin pemanfaatan air tanah diterbitkan oleh instansi berwenang. Membayar pajak tidak otomatis memberikan izin, dan memiliki izin tidak menghapus kewajiban pajak." },
        { t: "h", x: "Pencatatan yang perlu dijaga" },
        { t: "list", x: ["Volume pemakaian atau pembacaan meter.", "Titik dan sumber pengambilan.", "Data izin dan masa berlaku.", "Bukti setor pada masa sebelumnya."] },
        { t: "p", x: "Pemanfaatan air tanah perlu mempertimbangkan daya dukung lingkungan. Pencatatan yang baik membantu usaha memahami pemakaian sekaligus memenuhi kewajiban." },
        { t: "note", x: "Tarif dan dasar perhitungan resmi mengikuti Perda dan ketentuan yang berlaku." }
      ],
      takeaways: [
        "Pajak air tanah umumnya berbasis volume dan nilai perolehan air.",
        "Izin pemanfaatan diatur terpisah dari kewajiban pajak.",
        "Pencatatan pemakaian yang rutin memudahkan pelaporan."
      ]
    },
    {
      id: "sanksi-administrasi",
      title: "Memahami sanksi administrasi tanpa panik",
      category: "Kepatuhan",
      minutes: 5,
      level: "Menengah",
      module: "patuh",
      excerpt:
        "Sanksi bukan tujuan utama, tetapi konsekuensi dari kewajiban yang tidak diselesaikan. Pahami jenis dan langkah menghadapinya.",
      body: [
        { t: "p", x: "Dalam administrasi pajak, sanksi dapat muncul ketika kewajiban tidak dipenuhi atau data yang disampaikan tidak sesuai. Jenis dan besarnya diatur dalam ketentuan yang berlaku." },
        { t: "h", x: "Bentuk yang umum dijumpai" },
        { t: "list", x: ["Bunga atau denda atas keterlambatan.", "Surat teguran atau peringatan.", "Koreksi atas data yang tidak sesuai.", "Tindakan penagihan jika kewajiban tetap tidak diselesaikan."] },
        { t: "h", x: "Yang sebaiknya dilakukan" },
        { t: "list", x: ["Baca surat atau pemberitahuan resmi dengan teliti.", "Cocokkan data dan hitungan dengan catatan usaha.", "Hubungi petugas melalui kanal resmi jika ada perbedaan.", "Simpan bukti komunikasi dan pembayaran.", "Ajukan keberatan atau tindak lanjut sesuai prosedur bila diperlukan."] },
        { t: "p", x: "Jangan mengabaikan surat resmi atau memberikan uang kepada pihak yang menjanjikan penghapusan sanksi. Semua proses memiliki kanal dan bukti yang jelas." },
        { t: "note", x: "Artikel ini bersifat edukasi umum. Besaran dan prosedur sanksi mengikuti peraturan daerah serta ketentuan yang berlaku." }
      ],
      takeaways: [
        "Sanksi mengikuti ketentuan, bukan negosiasi informal.",
        "Cocokkan data dan gunakan kanal resmi saat ada perbedaan.",
        "Simpan semua bukti komunikasi dan pembayaran."
      ]
    }
  ];

  const learningPaths = [
    { id: "dasar", title: "Dasar pajak daerah", desc: "Mulai dari konsep dan jenis pajak yang paling sering dijumpai.", icon: "book-open", tone: "forest" },
    { id: "administrasi", title: "Administrasi usaha", desc: "Daftar NPWPD, lapor, dan bayar tanpa kebingungan.", icon: "clipboard-check", tone: "peach" },
    { id: "hitung", title: "Cara menghitung", desc: "Latihan membaca dasar perhitungan dan contoh sederhana.", icon: "calculator", tone: "mint" },
    { id: "patuh", title: "Kepatuhan & sanksi", desc: "Apa yang terjadi jika terlambat dan bagaimana menyikapinya.", icon: "shield-check", tone: "sand" }
  ];

  const quiz = [
    {
      q: "Siapa yang memungut PBJT makanan dan minuman?",
      options: ["Pengusaha restoran atau kafe", "Setiap pembeli", "Hanya hotel", "Pemerintah pusat"],
      answer: 0,
      why: "Pengusaha memungut PBJT dari konsumen, lalu menyetorkannya ke kas daerah."
    },
    {
      q: "PBB-P2 umumnya dikenakan setiap...",
      options: ["Bulan", "Tahun", "Minggu", "Setiap transaksi"],
      answer: 1,
      why: "PBB-P2 adalah pajak tahunan yang mengikuti SPPT dan ketentuan daerah."
    },
    {
      q: "Apa yang paling penting disiapkan saat mendaftar NPWPD?",
      options: ["KTP dan dokumen usaha yang sesuai", "Kartu nama saja", "Foto kendaraan", "Bukti belanja pribadi"],
      answer: 0,
      why: "Identitas dan dokumen usaha yang konsisten mempercepat proses verifikasi."
    },
    {
      q: "BPHTB dalam jual beli tanah umumnya menjadi kewajiban...",
      options: ["Pembeli sebagai penerima hak", "Tetangga", "Bank", "Pembeli dan penjual selalu sama"],
      answer: 0,
      why: "BPHTB melekat pada perolehan hak, sehingga umumnya dibayar pihak yang memperoleh hak."
    }
  ];

  const faqs = [
    {
      q: "Apa itu PESONA?",
      a: "PESONA adalah prototipe platform edukasi dan administrasi pajak daerah. Di sini warga dan pelaku usaha dapat belajar, menghitung, menyiapkan pendaftaran, serta melihat contoh alur layanan. Ini bukan situs resmi dan bukan pengganti layanan BPKPD."
    },
    {
      q: "Apakah data yang saya isi tersimpan di server?",
      a: "Tidak. Seluruh data pada prototipe ini disimpan di browser Anda (localStorage) agar alur terasa nyata. Tidak ada koneksi ke server, pembayaran, atau pengiriman dokumen. Gunakan tombol reset data demo di footer untuk menghapusnya."
    },
    {
      q: "Apa beda pajak daerah dan pajak pusat?",
      a: "Pajak daerah dipungut pemerintah daerah, misalnya PBJT, PBB-P2, BPHTB, pajak reklame, dan pajak air tanah. Pajak pusat dikelola pemerintah pusat, seperti PPh dan PPN. Satu usaha dapat memiliki kewajiban pada keduanya."
    },
    {
      q: "Apakah semua UMKM wajib memiliki NPWPD?",
      a: "Kewajiban bergantung pada jenis kegiatan dan objek pajak daerah yang dimiliki. Usaha kecil dengan objek tertentu mungkin belum termasuk, tetapi tetap dianjurkan memahami ketentuan. Konsultasikan kasus Anda melalui kanal resmi."
    },
    {
      q: "Berapa tarif pajak yang benar?",
      a: "Tarif resmi ditetapkan dalam Perda dan peraturan pelaksanaannya. Angka pada kalkulator dan artikel prototipe ini adalah ilustrasi untuk belajar, bukan ketetapan pajak. Selalu cek kanal resmi pemerintah daerah."
    },
    {
      q: "Bagaimana cara melaporkan pungutan liar?",
      a: "Catat waktu, tempat, nama pihak, dan bukti transaksi. Sampaikan melalui kanal pengaduan resmi pemerintah daerah atau Inspektorat. Jangan membayar melalui rekening pribadi dan jangan menyerahkan dokumen asli tanpa tanda terima."
    },
    {
      q: "Apakah PESONA menerbitkan izin atau menerima pembayaran?",
      a: "Tidak. Pada konsepnya, PESONA adalah kanal edukasi dan administrasi. Izin tetap diterbitkan instansi berwenang, pajak tetap dipungut pemerintah daerah, dan pembayaran hanya melalui kanal resmi. Prototipe ini tidak memproses keduanya."
    },
    {
      q: "Berapa lama verifikasi NPWPD?",
      a: "Pada simulasi ini, verifikasi dicontohkan 3 hari kerja setelah dokumen lengkap. Waktu sebenarnya bergantung pada kelengkapan berkas dan kebijakan layanan setempat."
    },
    {
      q: "Apa itu registry penyedia PESONA?",
      a: "Registry adalah daftar usaha yang dokumen dasar dan komitmen layanannya sudah diperiksa. Status terverifikasi membantu warga membedakan usaha formal dari yang belum lengkap. PESONA tidak menerbitkan izin; verifikasi hanya untuk tampil di katalog dan menerima booking."
    },
    {
      q: "Apakah booking dan pembayaran di PESONA nyata?",
      a: "Tidak. Booking, QRIS, pajak, dan bagi hasil pada prototipe ini adalah simulasi. Pada implementasi nyata, pembayaran hanya melalui kanal resmi dan pajak disetor ke kas daerah, bukan ke PESONA."
    },
    {
      q: "Bagaimana skema bagi hasil koperasi 80/10/10?",
      a: "Ilustrasi pada prototipe: 80% untuk anggota atau operator usaha, 10% untuk kas koperasi, dan 10% untuk dana komunitas atau pelestarian. Persentase resmi harus disepakati anggota dan dituangkan dalam aturan koperasi."
    }
  ];

  const services = [
    {
      id: "daftar",
      title: "Daftar NPWPD",
      desc: "Siapkan identitas wajib pajak daerah untuk usaha Anda melalui alur terpandu.",
      icon: "id-card",
      meta: "± 7 menit · Gratis",
      tag: "Paling dicari",
      tone: "forest"
    },
    {
      id: "lapor",
      title: "Lapor & bayar",
      desc: "Hitung kewajiban masa pajak, buat ringkasan, dan lihat simulasi kanal pembayaran.",
      icon: "receipt-text",
      meta: "± 10 menit · Simulasi",
      tag: "Masa pajak",
      tone: "peach"
    },
    {
      id: "status",
      title: "Cek status",
      desc: "Pantau pendaftaran, pelaporan, atau tiket konsultasi dengan kode referensi.",
      icon: "clipboard-check",
      meta: "Realtime · Simulasi",
      tag: "Lacak",
      tone: "mint"
    },
    {
      id: "izin",
      title: "Lacak izin & sertifikasi",
      desc: "Pantau lima tahap persiapan NIB, TDUP/SLS, NPWPD, dan sertifikasi usaha dalam satu tracker.",
      icon: "clipboard-check",
      meta: "5 tahap · Simulasi",
      tag: "Citta Seva",
      tone: "mint"
    },
    {
      id: "temu",
      title: "Janji temu Meja PAD",
      desc: "Pesan slot konsultasi bersama petugas di MPP Klungkung atau satelit Nusa Penida.",
      icon: "calendar-check-2",
      meta: "Slot contoh · Gratis",
      tag: "Meja PAD",
      tone: "sand"
    },
    {
      id: "konsultasi",
      title: "Konsultasi & pengaduan",
      desc: "Tanyakan kewajiban pajak atau sampaikan keluhan melalui kanal yang tercatat.",
      icon: "message-square-text",
      meta: "Respons 3×24 jam",
      tag: "Bantuan",
      tone: "peach"
    }
  ];

  const usaha = {
    stats: {
      providers: 64,
      cooperatives: 10,
      bookings: 428,
      validatedPad: 2.1,
      trainingParticipants: 512,
      partners: 12
    },
    categories: [
      { id: "all", label: "Semua", icon: "list-filter" },
      { id: "homestay", label: "Homestay", icon: "house" },
      { id: "guide", label: "Pemandu", icon: "map-pin" },
      { id: "dive", label: "Dive & snorkel", icon: "waves" },
      { id: "kuliner", label: "Kuliner", icon: "utensils" },
      { id: "boat", label: "Boat & transfer", icon: "car-front" }
    ],
    verificationLevels: {
      1: { label: "Terverifikasi dasar", desc: "NIB dan identitas usaha sudah dicocokkan." },
      2: { label: "Terverifikasi", desc: "NIB, NPWPD, dan komitmen layanan sudah diperiksa." },
      3: { label: "Terverifikasi lanjutan", desc: "Dokumen lengkap, sertifikasi kompetensi, dan riwayat layanan baik." }
    },
    providers: [
      {
        id: "prov-nusa-asri",
        name: "Nusa Asri Homestay",
        category: "homestay",
        categoryLabel: "Homestay",
        area: "Nusa Penida",
        price: 285000,
        unit: "malam",
        rating: 4.8,
        reviews: 64,
        level: 3,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD", "SLS"],
        certifications: ["Homestay Ready", "Higiene & SLS"],
        desc: "Kamar tenang dengan sarapan lokal, halaman tropis, dan pengelolaan oleh keluarga.",
        capacity: "4 kamar",
        since: "2024",
        contact: "0812-xxxx-0182",
        tone: "mint",
        featured: true
      },
      {
        id: "prov-bukit-teletubbies",
        name: "Bukit Teletubbies Stay",
        category: "homestay",
        categoryLabel: "Homestay",
        area: "Nusa Penida",
        price: 250000,
        unit: "malam",
        rating: 4.7,
        reviews: 41,
        level: 2,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD"],
        certifications: ["Homestay Ready"],
        desc: "Homestay keluarga dengan pemandangan perbukitan dan akses mudah ke Pantai Atuh.",
        capacity: "3 kamar",
        since: "2025",
        contact: "0813-xxxx-0251",
        tone: "sand"
      },
      {
        id: "prov-kadek-guide",
        name: "Kadek Penida Guide",
        category: "guide",
        categoryLabel: "Pemandu",
        area: "Nusa Penida",
        price: 350000,
        unit: "trip",
        rating: 4.9,
        reviews: 88,
        level: 3,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD", "HPI"],
        certifications: ["Guide Competency", "First Aid"],
        desc: "Rute barat, cerita lokal, dan spot foto yang tidak ramai. Maksimal 6 peserta.",
        capacity: "6 peserta",
        since: "2023",
        contact: "0817-xxxx-0308",
        tone: "forest",
        featured: true
      },
      {
        id: "prov-mangku-guide",
        name: "Mangku Suta Guide",
        category: "guide",
        categoryLabel: "Pemandu",
        area: "Klungkung",
        price: 300000,
        unit: "trip",
        rating: 4.8,
        reviews: 37,
        level: 2,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD"],
        certifications: ["Pemandu budaya"],
        desc: "Spesialis wisata budaya Kertha Gosa, Kamasan, dan desa adat di Klungkung.",
        capacity: "8 peserta",
        since: "2024",
        contact: "0819-xxxx-0442",
        tone: "peach"
      },
      {
        id: "prov-penida-divers",
        name: "Penida Blue Divers",
        category: "dive",
        categoryLabel: "Dive & snorkel",
        area: "Nusa Penida",
        price: 650000,
        unit: "dive",
        rating: 4.9,
        reviews: 112,
        level: 3,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD", "Asuransi"],
        certifications: ["PADI Divemaster", "MPA Awareness"],
        desc: "Manta Point, Crystal Bay, dan dive guide bersertifikat dengan kelompok kecil.",
        capacity: "4 penyelam",
        since: "2022",
        contact: "0813-xxxx-0520",
        tone: "forest",
        featured: true
      },
      {
        id: "prov-manta-buddy",
        name: "Manta Buddy Snorkeling",
        category: "dive",
        categoryLabel: "Dive & snorkel",
        area: "Nusa Penida",
        price: 575000,
        unit: "trip",
        rating: 4.8,
        reviews: 73,
        level: 2,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD", "Asuransi"],
        certifications: ["Snorkel guide", "First Aid"],
        desc: "Snorkeling kelompok kecil, aman untuk pemula, dan menghormati zona konservasi.",
        capacity: "8 peserta",
        since: "2024",
        contact: "0812-xxxx-0615",
        tone: "mint"
      },
      {
        id: "prov-kafe-sunrise",
        name: "Kafe Sunrise Penida",
        category: "kuliner",
        categoryLabel: "Kuliner",
        area: "Nusa Penida",
        price: 85000,
        unit: "pax",
        rating: 4.7,
        reviews: 129,
        level: 2,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD", "SLS"],
        certifications: ["Higiene & SLS", "NPWPD & PBJT"],
        desc: "Menu sarapan lokal dan kopi pulau, dengan pajak yang tercantum pada struk.",
        capacity: "32 kursi",
        since: "2024",
        contact: "0813-xxxx-0941",
        tone: "peach",
        featured: true
      },
      {
        id: "prov-warung-segara",
        name: "Warung Segara",
        category: "kuliner",
        categoryLabel: "Kuliner",
        area: "Klungkung",
        price: 75000,
        unit: "pax",
        rating: 4.9,
        reviews: 96,
        level: 2,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD", "SLS"],
        certifications: ["Higiene & SLS"],
        desc: "Ikan segar, sambal matah, dan hasil laut lokal dari nelayan Kusamba.",
        capacity: "40 kursi",
        since: "2023",
        contact: "0812-xxxx-0771",
        tone: "mint"
      },
      {
        id: "prov-serombotan-made",
        name: "Serombotan Ibu Made",
        category: "kuliner",
        categoryLabel: "Kuliner",
        area: "Klungkung",
        price: 45000,
        unit: "pax",
        rating: 4.8,
        reviews: 58,
        level: 1,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD"],
        certifications: ["Higiene & SLS"],
        desc: "Serombotan otentik dengan bumbu kelapa khas Klungkung dan bahan dari pasar lokal.",
        capacity: "20 kursi",
        since: "2025",
        contact: "0815-xxxx-0864",
        tone: "sand"
      },
      {
        id: "prov-nusa-fastboat",
        name: "Nusa Penida Fast Boat",
        category: "boat",
        categoryLabel: "Boat & transfer",
        area: "Nusa Penida",
        price: 175000,
        unit: "pax",
        rating: 4.6,
        reviews: 204,
        level: 2,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD", "Asuransi"],
        certifications: ["Keselamatan laut"],
        desc: "Transfer Sanur–Nusa Penida dengan jadwal tetap dan asuransi penumpang.",
        capacity: "48 kursi",
        since: "2023",
        contact: "0818-xxxx-0912",
        tone: "forest"
      },
      {
        id: "prov-lembongan-boat",
        name: "Lembongan Sunset Boat",
        category: "boat",
        categoryLabel: "Boat & transfer",
        area: "Nusa Penida",
        price: 200000,
        unit: "pax",
        rating: 4.7,
        reviews: 86,
        level: 1,
        status: "Terverifikasi",
        licenses: ["NIB", "NPWPD", "Asuransi"],
        certifications: ["Keselamatan laut"],
        desc: "Transfer sore menuju Lembongan dengan kapasitas kecil dan pelayanan keluarga.",
        capacity: "24 kursi",
        since: "2025",
        contact: "0817-xxxx-1022",
        tone: "stone"
      }
    ],
    providerQueue: [
      {
        id: "pq-dapur-segara",
        code: "PVD-2026-0041",
        name: "Dapur Segara",
        category: "kuliner",
        categoryLabel: "Kuliner",
        area: "Nusa Penida",
        price: 70000,
        unit: "pax",
        rating: 0,
        reviews: 0,
        level: 1,
        status: "Dalam verifikasi",
        licenses: ["NIB"],
        certifications: [],
        desc: "Warung makan keluarga dengan menu ikan bakar dan sayur lokal.",
        capacity: "18 kursi",
        since: "2026",
        contact: "0812-xxxx-1130",
        submitted: "17 Nov 2026",
        docs: "4/5",
        tone: "peach"
      },
      {
        id: "pq-sunset-boat",
        code: "PVD-2026-0040",
        name: "Lembongan Sunrise Boat",
        category: "boat",
        categoryLabel: "Boat & transfer",
        area: "Nusa Penida",
        price: 200000,
        unit: "pax",
        rating: 0,
        reviews: 0,
        level: 1,
        status: "Perlu dokumen",
        licenses: ["NIB"],
        certifications: [],
        desc: "Transfer sore menuju Lembongan; dokumen asuransi masih dilengkapi.",
        capacity: "24 kursi",
        since: "2025",
        contact: "0817-xxxx-1022",
        submitted: "16 Nov 2026",
        docs: "3/5",
        tone: "stone"
      },
      {
        id: "pq-guide-timur",
        code: "PVD-2026-0039",
        name: "Guide Bali Timur",
        category: "guide",
        categoryLabel: "Pemandu",
        area: "Klungkung",
        price: 325000,
        unit: "trip",
        rating: 0,
        reviews: 0,
        level: 2,
        status: "Dalam verifikasi",
        licenses: ["NIB", "NPWPD"],
        certifications: ["Guide Competency"],
        desc: "Pemandu wilayah timur Bali dengan fokus sejarah dan budaya.",
        capacity: "6 peserta",
        since: "2026",
        contact: "0819-xxxx-1240",
        submitted: "15 Nov 2026",
        docs: "5/5",
        tone: "forest"
      }
    ],
    trainings: [
      {
        id: "tr-homestay",
        cat: "Homestay",
        title: "Homestay Naik Kelas",
        duration: "2 hari",
        mode: "Tatap muka · Nusa Penida",
        price: 500000,
        subsidy: 0.5,
        quota: 20,
        provider: "PLUT Klungkung · PHRI",
        desc: "Standar kamar, kebersihan, sarapan, tata kelola, dan kesiapan menerima tamu.",
        tone: "mint",
        certified: true,
        start: "24 Nov 2026"
      },
      {
        id: "tr-guide",
        cat: "Guide",
        title: "Pemandu Wisata Budaya",
        duration: "3 hari",
        mode: "Tatap muka · Klungkung",
        price: 750000,
        subsidy: 0.4,
        quota: 15,
        provider: "HPI · LSP/BNSP",
        desc: "Rute, interpretasi budaya, bahasa, dan keselamatan perjalanan.",
        tone: "forest",
        certified: true,
        start: "1 Des 2026"
      },
      {
        id: "tr-dive",
        cat: "Dive",
        title: "Dive Safety & MPA",
        duration: "4 hari",
        mode: "Tatap muka · Nusa Penida",
        price: 1500000,
        subsidy: 0.3,
        quota: 10,
        provider: "PADI · SSI",
        desc: "SOP dive, rescue dasar, asuransi, dan etika kawasan konservasi.",
        tone: "forest",
        certified: true,
        start: "8 Des 2026"
      },
      {
        id: "tr-kuliner",
        cat: "Kuliner",
        title: "Higiene & SLS Kuliner",
        duration: "1 hari",
        mode: "Tatap muka · MPP Klungkung",
        price: 350000,
        subsidy: 0.5,
        quota: 30,
        provider: "Dinkes · PLUT",
        desc: "Higiene, sanitasi, kemasan, dan standar sajian siap SLS.",
        tone: "peach",
        certified: true,
        start: "26 Nov 2026"
      },
      {
        id: "tr-digital",
        cat: "Digital",
        title: "Digital Marketing & Direct Booking",
        duration: "2 hari",
        mode: "Hybrid",
        price: 400000,
        subsidy: 0.5,
        quota: 25,
        provider: "PLUT · OTA mitra",
        desc: "Foto, konten, OTA, dan direct booking untuk usaha wisata.",
        tone: "sand",
        certified: false,
        start: "2 Des 2026"
      },
      {
        id: "tr-pajak",
        cat: "Pajak",
        title: "NPWPD, PBJT & Pembukuan",
        duration: "1 hari",
        mode: "Daring",
        price: 300000,
        subsidy: 0.5,
        quota: 30,
        provider: "BPKPD · DJP · PLUT",
        desc: "Dasar pajak daerah, catatan omzet, bukti pungut, dan pelaporan masa pajak.",
        tone: "stone",
        certified: false,
        start: "28 Nov 2026"
      }
    ],
    partners: [
      { name: "LSP/BNSP", role: "Sertifikasi kompetensi", icon: "badge-check", tone: "forest" },
      { name: "PADI", role: "Standar dive", icon: "waves", tone: "mint" },
      { name: "SSI", role: "Standar snorkel", icon: "droplets", tone: "mint" },
      { name: "HPI", role: "Pemandu wisata", icon: "map-pin", tone: "peach" },
      { name: "PHRI", role: "Hotel & restoran", icon: "hotel", tone: "sand" },
      { name: "PLUT", role: "Pelatihan & inkubasi", icon: "building-2", tone: "stone" },
      { name: "KDKMP", role: "Operator warga", icon: "users", tone: "forest" },
      { name: "Bank mitra", role: "QRIS & pembiayaan", icon: "wallet", tone: "sand" }
    ],
    cooperative: {
      name: "KDKMP Nusa Penida",
      area: "Nusa Penida",
      members: 46,
      listings: 12,
      monthlyBookings: 38,
      monthlyValue: 18250000,
      split: [
        { label: "Anggota / operator", pct: 80, tone: "forest" },
        { label: "Kas koperasi", pct: 10, tone: "sand" },
        { label: "Dana komunitas & pelestarian", pct: 10, tone: "peach" }
      ],
      report: [
        { label: "Anggota aktif", value: "46" },
        { label: "Listing aktif", value: "12" },
        { label: "Booking bulan ini", value: "38" },
        { label: "Nilai transaksi", value: "Rp18,25 jt" }
      ],
      note: "Ilustrasi skema bagi hasil. Angka dan persentase adalah simulasi, bukan ketetapan koperasi."
    },
    sampleBookings: [
      { code: "BKG-2611-1042", provider: "Nusa Asri Homestay", date: "12 Nov 2026", qty: 2, subtotal: 570000, tax: 57000, total: 627000, status: "Terkonfirmasi", channel: "QRIS" },
      { code: "BKG-2611-1041", provider: "Penida Blue Divers", date: "11 Nov 2026", qty: 2, subtotal: 1300000, tax: 130000, total: 1430000, status: "Terkonfirmasi", channel: "QRIS" },
      { code: "BKG-2611-1040", provider: "Kadek Penida Guide", date: "10 Nov 2026", qty: 1, subtotal: 350000, tax: 35000, total: 385000, status: "Menunggu", channel: "Virtual account" }
    ]
  };

  const serviceFlows = {
    daftar: {
      title: "Daftar NPWPD",
      desc: "Empat langkah. Tidak ada dokumen yang benar-benar diunggah pada prototipe ini.",
      steps: ["Identitas", "Usaha", "Dokumen", "Tinjau"],
      sla: "Verifikasi contoh: 3 hari kerja"
    },
    lapor: {
      title: "Lapor & bayar",
      desc: "Simulasikan perhitungan, pelaporan, dan instruksi pembayaran.",
      steps: ["Jenis pajak", "Masa & nilai", "Ringkasan", "Pembayaran"],
      sla: "Tidak ada transaksi nyata"
    },
    konsultasi: {
      title: "Konsultasi & pengaduan",
      desc: "Tulis pertanyaan Anda. Petugas akan merespons melalui kanal yang dipilih.",
      steps: ["Topik", "Detail", "Kirim"],
      sla: "Respons contoh: 1 hari kerja"
    }
  };

  const announcementList = [
    {
      date: "24–28 Nov 2026",
      tag: "Edukasi",
      title: "Pekan Sadar Pajak di MPP Klungkung",
      desc: "Klinik NPWPD, simulasi perhitungan, dan konsultasi terbuka untuk pelaku usaha."
    },
    {
      date: "Hingga 15 Des 2026",
      tag: "Pemutakhiran",
      title: "Perbarui data objek PBB-P2",
      desc: "Cocokkan luas, alamat, dan penggunaan objek agar SPPT tahun berikutnya akurat."
    },
    {
      date: "Setiap Selasa",
      tag: "Pendampingan",
      title: "Klinik NPWPD untuk usaha baru",
      desc: "Sesi pendampingan dokumen dan alur pendaftaran di meja layanan PESONA."
    },
    {
      date: "30 Nov 2026",
      tag: "Pengingat",
      title: "Batas lapor dan setor masa November",
      desc: "Tanggal ilustrasi. Selalu cocokkan dengan kode billing dan pengumuman resmi."
    }
  ];

  const demoUser = {
    name: "Ayu Pramesti",
    initials: "AP",
    npwpd: "NPWPD-2024-00871",
    business: "Kafe Sunrise Penida",
    type: "PBJT · Makanan & minuman",
    address: "Banjar Nyuh, Nusa Penida, Klungkung",
    status: "Aktif",
    since: "14 Feb 2024",
    nib: "NIB-8120-2024-00871",
    providerId: "prov-kafe-sunrise",
    listing: {
      status: "Terverifikasi",
      level: 2,
      since: "12 Mar 2025",
      bookings: 18,
      rating: 4.7,
      price: 85000,
      unit: "pax"
    },
    certifications: ["Higiene & SLS", "NPWPD & PBJT"],
    trainingDone: 2,
    trainingTotal: 6,
    cooperative: "KDKMP Nusa Penida",
    obligations: [
      { id: "OBL-2611-01", tax: "PBJT", period: "Masa Oktober 2026", amount: 2500000, due: "30 Nov 2026", status: "Belum dibayar" },
      { id: "OBL-2611-02", tax: "PBB-P2", period: "Tahun 2026", amount: 980000, due: "30 Sep 2026", status: "Lunas" }
    ],
    history: [
      { date: "12 Okt 2026", tax: "PBJT", period: "September 2026", amount: 2350000, method: "QRIS", status: "Berhasil" },
      { date: "11 Sep 2026", tax: "PBJT", period: "Agustus 2026", amount: 2180000, method: "Bank persepsi", status: "Berhasil" },
      { date: "10 Sep 2026", tax: "PBB-P2", period: "Tahun 2026", amount: 980000, method: "QRIS", status: "Berhasil" }
    ],
    documents: [
      { name: "NPWPD", meta: "Berlaku · diperbarui 12 Nov 2026", icon: "id-card" },
      { name: "SPPT PBB-P2 2026", meta: "Tersedia · 10 Agu 2026", icon: "file-text" },
      { name: "Bukti setor terakhir", meta: "12 Okt 2026", icon: "receipt-text" }
    ]
  };

  const notifications = [
    { id: "n1", title: "Batas lapor PBJT mendekat", desc: "Masa Oktober 2026 · contoh jatuh tempo 30 Nov.", time: "2 jam lalu", unread: true, icon: "clock" },
    { id: "n2", title: "Pendaftaran NPWPD diperbarui", desc: "Permohonan NPWPD-2026-0184 telah selesai.", time: "Kemarin", unread: true, icon: "badge-check" },
    { id: "n3", title: "Materi baru tersedia", desc: "Kalender kewajiban pajak daerah sudah terbit.", time: "2 hari lalu", unread: false, icon: "book-open" },
    { id: "n4", title: "Pengajuan penyedia menunggu", desc: "3 usaha baru menunggu verifikasi registry.", time: "3 hari lalu", unread: true, icon: "store" }
  ];

  const sampleStatuses = [
    {
      code: "NPWPD-2026-0184",
      type: "Pendaftaran NPWPD",
      subject: "Kafe Mangrove · Nusa Penida",
      status: "Selesai",
      updated: "15 Nov 2026",
      steps: [
        { date: "12 Nov 2026 · 09.14", title: "Permohonan diterima", desc: "Data dan dokumen awal diterima sistem.", state: "done" },
        { date: "14 Nov 2026 · 13.02", title: "Verifikasi dokumen", desc: "KTP dan NIB sesuai dengan data usaha.", state: "done" },
        { date: "15 Nov 2026 · 10.40", title: "NPWPD terbit", desc: "Nomor wajib pajak daerah dapat digunakan.", state: "done" }
      ],
      note: "Contoh status. Simpan nomor referensi untuk pengecekan berikutnya."
    },
    {
      code: "SPTPD-2026-10293",
      type: "Pelaporan PBJT",
      subject: "Kafe Sunrise Penida · masa Oktober 2026",
      status: "Diproses",
      updated: "17 Nov 2026",
      steps: [
        { date: "16 Nov 2026 · 16.22", title: "Laporan diterima", desc: "Ringkasan masa pajak berhasil dikirim.", state: "done" },
        { date: "17 Nov 2026 · 08.10", title: "Pemeriksaan data", desc: "Petugas mencocokkan nilai dengan data pendukung.", state: "active" },
        { date: "Menunggu", title: "Selesai diverifikasi", desc: "Status akan diperbarui setelah pemeriksaan.", state: "todo" }
      ],
      note: "Contoh status. Pelaporan pada prototipe ini tidak terhubung ke sistem resmi."
    },
    {
      code: "PSN-2611-2048",
      type: "Tiket konsultasi",
      subject: "Pertanyaan tarif PBJT untuk kafe baru",
      status: "Selesai",
      updated: "16 Nov 2026",
      steps: [
        { date: "15 Nov 2026 · 11.05", title: "Tiket dibuat", desc: "Pertanyaan diterima melalui kanal konsultasi.", state: "done" },
        { date: "16 Nov 2026 · 09.30", title: "Dijawab petugas", desc: "Penjelasan dan tautan panduan telah dikirim.", state: "done" }
      ],
      note: "Contoh status. Tiket baru dari formulir akan muncul di daftar Anda."
    },
    {
      code: "IZIN-2026-0045",
      type: "Tracker izin usaha",
      subject: "Nusa Asri Homestay · Nusa Penida",
      status: "Diproses",
      updated: "17 Nov 2026",
      steps: [
        { date: "10 Nov 2026 · 09.12", title: "Asesmen mandiri", desc: "Profil usaha dan kebutuhan izin dicocokkan dengan jenis kegiatan.", state: "done" },
        { date: "11 Nov 2026 · 14.40", title: "NIB & profil OSS", desc: "NIB tersedia; KBLI dan data lokasi sudah dicocokkan.", state: "done" },
        { date: "13 Nov 2026 · 10.05", title: "TDUP & SLS diajukan", desc: "Berkas diteruskan ke DPMPTSP dan Dinkes untuk verifikasi.", state: "active" },
        { date: "Menunggu", title: "Verifikasi OPD", desc: "PESONA memantau status. Izin tetap diterbitkan instansi berwenang.", state: "todo" },
        { date: "Menunggu", title: "Siap listing", desc: "Setelah izin dan NPWPD lengkap, usaha dapat tampil di registry.", state: "todo" }
      ],
      note: "Contoh tracker. PESONA tidak menerbitkan izin atau sertifikat."
    },
    {
      code: "PVD-2026-0041",
      type: "Pendaftaran penyedia",
      subject: "Dapur Segara · Nusa Penida",
      status: "Dalam verifikasi",
      updated: "17 Nov 2026",
      steps: [
        { date: "17 Nov 2026 · 08.42", title: "Pengajuan diterima", desc: "Profil usaha, NIB, dan NPWPD contoh tercatat.", state: "done" },
        { date: "18 Nov 2026 · 09.10", title: "Verifikasi dokumen", desc: "Petugas mencocokkan NIB, NPWPD, dan komitmen layanan.", state: "active" },
        { date: "Menunggu", title: "Keputusan registry", desc: "Jika lolos, usaha tampil di registry publik.", state: "todo" },
        { date: "Menunggu", title: "Listing aktif", desc: "Usaha dapat menerima booking melalui kanal PESONA.", state: "todo" }
      ],
      note: "Contoh status. PESONA tidak menerbitkan izin; verifikasi hanya untuk tampil di registry."
    },
    {
      code: "TEMU-2611-0301",
      type: "Janji temu Meja PAD",
      subject: "MPP Klungkung · Konsultasi PBJT & pembukuan",
      status: "Terkonfirmasi",
      updated: "17 Nov 2026",
      steps: [
        { date: "17 Nov 2026 · 08.30", title: "Slot dipilih", desc: "Peserta memilih layanan konsultasi dan kanal tatap muka.", state: "done" },
        { date: "18 Nov 2026 · 10.00", title: "Konfirmasi jadwal", desc: "Petugas mengonfirmasi kehadiran melalui WhatsApp contoh.", state: "done" },
        { date: "20 Nov 2026 · 09.00", title: "Sesi konsultasi", desc: "Hadir di Meja PAD, MPP Klungkung, lantai 1.", state: "active" }
      ],
      note: "Contoh janji temu. Tidak ada pemesanan nyata pada prototipe ini."
    },
    {
      code: "BKG-2611-1042",
      type: "Booking penyedia",
      subject: "Nusa Asri Homestay · 2 malam",
      status: "Terkonfirmasi",
      updated: "12 Nov 2026",
      steps: [
        { date: "11 Nov 2026 · 16.20", title: "Booking dibuat", desc: "Tanggal, jumlah tamu, dan paket dikonfirmasi.", state: "done" },
        { date: "11 Nov 2026 · 16.24", title: "Pembayaran QRIS (simulasi)", desc: "Transaksi tercatat; pajak dihitung pada ringkasan.", state: "done" },
        { date: "12 Nov 2026 · 14.00", title: "Check-in", desc: "Tunjukkan kode booking dan identitas saat tiba.", state: "active" }
      ],
      note: "Contoh booking. Tidak ada pembayaran nyata pada prototipe ini."
    }
  ];

  const admin = {
    year: 2026,
    target: 98.4,
    realization: 72.62,
    ytdTarget: 81.2,
    compliance: 82.6,
    complianceDelta: 2.4,
    activeTaxpayers: 18420,
    activeDelta: 1120,
    receivables: 4.28,
    receivablesDelta: -6.2,
    servicesDone: 1284,
    responseDays: 1.2,
    karya: {
      providersVerified: 64,
      providersPending: 8,
      bookingsMonth: 428,
      bookingValue: 386500000,
      validatedPad: 2.1,
      trainingParticipants: 512,
      cooperatives: 10,
      partners: 12
    },
    months: [
      { m: "Jan", real: 6.42, target: 7.2 },
      { m: "Feb", real: 5.88, target: 7.2 },
      { m: "Mar", real: 7.15, target: 7.8 },
      { m: "Apr", real: 6.74, target: 8.0 },
      { m: "Mei", real: 7.32, target: 7.9 },
      { m: "Jun", real: 8.06, target: 8.2 },
      { m: "Jul", real: 7.58, target: 8.6 },
      { m: "Agu", real: 7.94, target: 8.5 },
      { m: "Sep", real: 8.41, target: 8.7 },
      { m: "Okt", real: 7.12, target: 9.1 },
      { m: "Nov", real: 0, target: 8.6 },
      { m: "Des", real: 0, target: 8.6 }
    ],
    taxBreakdown: [
      { id: "pbjt", name: "PBJT", target: 58.0, real: 44.8, compliance: 78, wp: 8640, tone: "forest" },
      { id: "pbb", name: "PBB-P2", target: 18.5, real: 12.6, compliance: 84, wp: 7980, tone: "mint" },
      { id: "bphtb", name: "BPHTB", target: 12.0, real: 9.4, compliance: 96, wp: 500, tone: "peach" },
      { id: "reklame", name: "Reklame", target: 7.4, real: 4.3, compliance: 71, wp: 870, tone: "sand" },
      { id: "pat", name: "Air Tanah", target: 2.5, real: 1.5, compliance: 90, wp: 430, tone: "stone" }
    ],
    taxpayers: [
      { id: "NPWPD-2024-00182", name: "Warung Bu Nyoman", type: "PBJT", area: "Nusa Penida", status: "Patuh", compliance: 92, arrears: 0, last: "12 Nov 2026", contact: "0812-xxxx-0182", since: "Mar 2024" },
      { id: "NPWPD-2023-00941", name: "Kafe Sunrise Penida", type: "PBJT", area: "Nusa Penida", status: "Perlu perhatian", compliance: 78, arrears: 1250000, last: "05 Nov 2026", contact: "0813-xxxx-0941", since: "Jan 2023" },
      { id: "NPWPD-2022-00417", name: "Homestay Bukit Hijau", type: "PBJT", area: "Nusa Penida", status: "Menunggak", compliance: 64, arrears: 3400000, last: "20 Sep 2026", contact: "0817-xxxx-0417", since: "Jun 2022" },
      { id: "NPWPD-2021-00220", name: "Restoran Pelabuhan", type: "PBJT", area: "Klungkung", status: "Patuh", compliance: 88, arrears: 0, last: "14 Nov 2026", contact: "0819-xxxx-0220", since: "Feb 2021" },
      { id: "NPWPD-2020-00088", name: "Hotel Taman Sari", type: "PBJT", area: "Klungkung", status: "Patuh", compliance: 95, arrears: 0, last: "13 Nov 2026", contact: "0812-xxxx-0088", since: "Agu 2020" },
      { id: "PBB-2026-11820", name: "Toko Emas Giri", type: "PBB-P2", area: "Klungkung", status: "Patuh", compliance: 100, arrears: 0, last: "10 Sep 2026", contact: "0815-xxxx-1820", since: "2019" },
      { id: "PBB-2026-20314", name: "Villa Lembongan", type: "PBB-P2", area: "Nusa Penida", status: "Perlu perhatian", compliance: 86, arrears: 850000, last: "02 Okt 2026", contact: "0813-xxxx-0314", since: "2020" },
      { id: "NPWPD-2022-00532", name: "PT Nusa Wisata", type: "BPHTB", area: "Nusa Penida", status: "Patuh", compliance: 97, arrears: 0, last: "08 Nov 2026", contact: "0818-xxxx-0532", since: "Jul 2022" },
      { id: "NPWPD-2019-00042", name: "CV Bali Sejahtera", type: "BPHTB", area: "Klungkung", status: "Menunggak", compliance: 72, arrears: 12500000, last: "18 Jul 2026", contact: "0812-xxxx-0042", since: "2019" },
      { id: "REK-2025-01104", name: "Reklame Cahaya", type: "Reklame", area: "Klungkung", status: "Menunggak", compliance: 55, arrears: 2750000, last: "30 Agu 2026", contact: "0819-xxxx-1104", since: "Apr 2025" },
      { id: "REK-2024-00781", name: "Bali Billboard", type: "Reklame", area: "Banjarangkan", status: "Perlu perhatian", compliance: 68, arrears: 4100000, last: "12 Okt 2026", contact: "0817-xxxx-0781", since: "Feb 2024" },
      { id: "PAT-2023-00215", name: "PT Tirta Nusa", type: "Air Tanah", area: "Nusa Penida", status: "Patuh", compliance: 91, arrears: 0, last: "11 Nov 2026", contact: "0813-xxxx-0215", since: "Mei 2023" },
      { id: "NPWPD-2025-01430", name: "Penginapan Dawan Asri", type: "PBJT", area: "Dawan", status: "Perlu perhatian", compliance: 74, arrears: 1800000, last: "22 Okt 2026", contact: "0815-xxxx-1430", since: "Agu 2025" },
      { id: "PBB-2026-24055", name: "UD Sumber Rejeki", type: "PBB-P2", area: "Banjarangkan", status: "Patuh", compliance: 89, arrears: 0, last: "09 Sep 2026", contact: "0812-xxxx-4055", since: "2018" },
      { id: "NPWPD-2026-01588", name: "Kafe Bukit", type: "PBJT", area: "Nusa Penida", status: "Menunggak", compliance: 58, arrears: 2100000, last: "14 Sep 2026", contact: "0818-xxxx-1588", since: "Jan 2026" },
      { id: "NPWPD-2022-00620", name: "Waterpark Klungkung", type: "PBJT", area: "Klungkung", status: "Patuh", compliance: 81, arrears: 0, last: "12 Nov 2026", contact: "0817-xxxx-0620", since: "Nov 2022" }
    ],
    queues: {
      pendaftaran: [
        { id: "REG-2611-019", name: "Dapur Segara", meta: "Nusa Penida · PBJT", date: "17 Nov · 08.42", status: "Baru", priority: "Tinggi" },
        { id: "REG-2611-018", name: "Homestay Pesisir", meta: "Nusa Penida · PBJT", date: "16 Nov · 15.10", status: "Verifikasi", priority: "Normal" },
        { id: "REG-2611-017", name: "Reklame Toko Adi", meta: "Klungkung · Reklame", date: "15 Nov · 11.24", status: "Verifikasi", priority: "Normal" },
        { id: "REG-2610-016", name: "Dive Center Nusa", meta: "Nusa Penida · PBJT", date: "31 Okt · 09.05", status: "Perlu dokumen", priority: "Tinggi" },
        { id: "REG-2610-015", name: "Warung Segara", meta: "Dawan · PBJT", date: "30 Okt · 13.48", status: "Selesai", priority: "Normal" }
      ],
      pelaporan: [
        { id: "SPT-2611-223", name: "Kafe Sunrise Penida", meta: "PBJT · masa Oktober 2026", date: "17 Nov · 08.15", status: "Menunggu", priority: "Normal" },
        { id: "SPT-2611-222", name: "PT Tirta Nusa", meta: "Air tanah · masa Oktober 2026", date: "16 Nov · 14.02", status: "Menunggu", priority: "Normal" },
        { id: "SPT-2611-221", name: "Bali Billboard", meta: "Reklame · masa Oktober 2026", date: "15 Nov · 10.37", status: "Dikembalikan", priority: "Tinggi" },
        { id: "SPT-2611-220", name: "Warung Bu Nyoman", meta: "PBJT · masa Oktober 2026", date: "14 Nov · 09.22", status: "Selesai", priority: "Normal" }
      ],
      konsultasi: [
        { id: "TIK-2611-092", name: "Ayu Lestari", meta: "Cara lapor PBJT untuk kafe baru", date: "17 Nov · 07.31", status: "Baru", priority: "Tinggi" },
        { id: "TIK-2611-091", name: "Made Suarta", meta: "Tunggakan PBB atas nama orang tua", date: "17 Nov · 07.05", status: "Baru", priority: "Normal" },
        { id: "TIK-2611-090", name: "Ketut Yasa", meta: "Kode billing tidak terbaca", date: "16 Nov · 16.20", status: "Diproses", priority: "Normal" },
        { id: "TIK-2611-089", name: "Ni Luh Sari", meta: "Pertanyaan reklame digital", date: "15 Nov · 11.44", status: "Selesai", priority: "Normal" }
      ],
      pengaduan: [
        { id: "PGD-2611-011", name: "Pelapor anonim", meta: "Dugaan pungutan tidak resmi", date: "16 Nov · 19.12", status: "Baru", priority: "Tinggi" },
        { id: "PGD-2611-010", name: "I Made W.", meta: "Antrean layanan terlalu lama", date: "14 Nov · 10.05", status: "Diproses", priority: "Normal" }
      ]
    },
    education: [
      { id: "pbjt-dasar", title: "Apa itu PBJT dan siapa yang wajib memungutnya?", views: 4281, completion: 68, status: "Terbit" },
      { id: "daftar-npwpd", title: "Cara daftar NPWPD untuk usaha baru", views: 3642, completion: 74, status: "Terbit" },
      { id: "pbb-njoptkp", title: "Menghitung PBB-P2: kenali NJOP dan NJOPTKP", views: 2918, completion: 61, status: "Terbit" },
      { id: "kalender-pajak", title: "Kalender kewajiban pajak daerah", views: 2455, completion: 57, status: "Terbit" },
      { id: "bayar-qris", title: "Bayar pajak lewat QRIS: langkah demi langkah", views: 2104, completion: 82, status: "Terbit" },
      { id: "reklame-media", title: "Pajak reklame: media apa saja yang dikenakan?", views: 1782, completion: 49, status: "Terbit" },
      { id: "bphtb-jual-beli", title: "BPHTB saat jual beli tanah: siapa yang membayar?", views: 1560, completion: 55, status: "Terbit" },
      { id: "telat-lapor", title: "Terlambat lapor: apa yang perlu dilakukan?", views: 1302, completion: 63, status: "Terbit" }
    ],
    campaigns: [
      { name: "Pekan Sadar Pajak", desc: "Kampanye edukasi 24–28 Nov", reach: "12.480", rate: 68, status: "Berjalan" },
      { name: "Klinik NPWPD", desc: "Pendampingan usaha baru", reach: "32 peserta", rate: 84, status: "Selesai" },
      { name: "Kuis Pajak", desc: "Kuis interaktif untuk warga", reach: "1.840 percobaan", rate: 78, status: "Berjalan" }
    ],
    activity: [
      { icon: "inbox", title: "Pendaftaran baru", desc: "Kafe Mangrove · Nusa Penida", time: "08.42", tone: "accent" },
      { icon: "receipt-text", title: "Laporan masuk", desc: "Kafe Sunrise Penida · PBJT Oktober", time: "08.15", tone: "forest" },
      { icon: "check", title: "Pembayaran diterima", desc: "Warung Bu Nyoman · Rp2.500.000", time: "07.58", tone: "ok" },
      { icon: "message-square-text", title: "Konsultasi baru", desc: "Ayu Pramesti · pelaporan PBJT", time: "07.31", tone: "peach" },
      { icon: "book-open", title: "Materi diterbitkan", desc: "Kalender kewajiban pajak daerah", time: "Kemarin", tone: "muted" }
    ],
    weeklyReaders: [320, 410, 385, 520, 610, 480, 560]
  };

  const regions = ["Klungkung", "Nusa Penida", "Banjarangkan", "Dawan"];

  window.PESONA_DATA = {
    taxes,
    articles,
    learningPaths,
    quiz,
    faqs,
    services,
    serviceFlows,
    announcementList,
    demoUser,
    notifications,
    sampleStatuses,
    admin,
    usaha,
    regions
  };
})();
