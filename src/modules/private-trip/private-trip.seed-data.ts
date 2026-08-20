import type { PrivateTripContent } from './schemas/private-trip.schema';
import { PRIVATE_TRIP_KEY } from './schemas/private-trip.schema';

export const PRIVATE_TRIP_SEED: Omit<
  PrivateTripContent,
  'createdAt' | 'updatedAt'
> = {
  key: PRIVATE_TRIP_KEY,
  eyebrow: 'Private Trip',
  title: 'Explore the Peaks: Pilih Gaya Petualanganmu!',
  intro:
    'Kami hadir untuk mewujudkan mimpi pendakianmu tanpa ribet. Apapun gayamu, kami siap mengawal hingga puncak. Pilih paket yang paling pas buat kamu.',
  contactName: undefined,
  whatsappPhone: undefined,
  whatsappCtaLabel: 'Tanya Jadwal & Harga',
  whatsappMessage:
    'Halo Ayuk Gunung, saya ingin konsultasi Private Trip. Boleh bantu cek jadwal dan estimasi harganya?',
  packages: [
    {
      key: 'tektok',
      name: 'Paket TEKTOK (One Day Challenge)',
      tagline:
        'Cocok untuk kamu yang aktif, punya waktu terbatas, dan ingin tantangan fisik yang instan.',
      philosophy: 'Datang, Mendaki, Menang, Pulang.',
      duration: '1 Hari (Tanpa menginap di gunung).',
      extrasIntro: undefined,
      facilities: [
        'Transportasi Eksklusif: Jemput dari Meeting Point (Jakarta/Bandara/Stasiun) PP.',
        'Leader & Runner: Pemandu berpengalaman yang paham manajemen waktu trekking cepat.',
        'Energy Kit: Paket snack tinggi kalori, buah, dan minuman isotonik untuk tenaga ekstra.',
        'Lunch Box Premium: Makan siang hangat yang disiapkan di jalur/basecamp.',
        'Standard Gear: Peminjaman Headlamp (untuk start dini hari) & Trekking Pole.',
        'Homebase: Akses homestay di basecamp untuk mandi dan istirahat sebelum/sesudah mendaki.',
        'Dokumentasi: Foto/Video selama pendakian untuk konten sosial mediamu.',
        'P3K & Safety: Oksigen portabel dan obat-obatan standar pendakian.',
        'Sertifikat: Bukti keberhasilanmu menaklukkan puncak dalam waktu singkat.',
      ],
      startingPrice: 'Rp 1.xxx.xxx / pax',
      minPax: 4,
    },
    {
      key: 'camp',
      name: 'Paket CAMP (The Full Experience)',
      tagline:
        'Cocok untuk kamu yang ingin menikmati senja, kopi di depan tenda, dan taburan bintang.',
      philosophy:
        'Menikmati setiap jengkal alam dengan kenyamanan maksimal.',
      duration: '2 Hari 1 Malam atau lebih.',
      extrasIntro: 'Semua fasilitas Paket Tektok, ditambah dengan:',
      facilities: [
        'Akomodasi Tenda: Tenda kapasitas 4 yang diisi hanya 2 orang (lebih luas & privat).',
        'Glamping Standard: Penggunaan matras tiup/double matras, bantal, dan sleeping bag bersih.',
        'Full Service Meals: Makan besar 3–5 kali di gunung dengan menu spesial (bukan mie instan).',
        'Coffee Break: Kopi seduh asli, teh hangat, dan camilan gorengan/rebusan di tenda.',
        'Porter Tim: Kamu cukup bawa tas kecil (daypack) berisi perlengkapan pribadi; tenda dan logistik kami yang bawa.',
        'Outdoor Dining: Set meja dan kursi lapangan untuk makan yang lebih nyaman.',
        'Simaksi & Asuransi: Pengurusan izin masuk taman nasional dan asuransi jiwa.',
      ],
      startingPrice: 'Rp 2.xxx.xxx / pax',
      minPax: 4,
    },
  ],
  comparisonTitle: 'Perbandingan Cepat: Pilih Mana?',
  comparisonRows: [
    {
      feature: 'Beban Bawaan',
      tektok: 'Sangat Ringan',
      camp: 'Ringan (hanya keperluan pribadi)',
    },
    {
      feature: 'Waktu',
      tektok: 'Efisien (Sabtu–Minggu balik)',
      camp: 'Santai (bisa eksplor lebih banyak)',
    },
    {
      feature: 'Istirahat',
      tektok: 'Di homestay basecamp',
      camp: 'Di tenda (camping)',
    },
    {
      feature: 'Tingkat Kesulitan',
      tektok: 'Menengah–Tinggi (fisik harus kuat)',
      camp: 'Menengah (bisa atur ritme jalan)',
    },
    {
      feature: 'Output',
      tektok: 'Achievement & Speed',
      camp: 'Healing & view sunrise/sunset',
    },
  ],
  whyTitle: 'Mengapa Private Trip Bersama Kami?',
  whyItems: [
    {
      title: 'Berbasis di Lampung, operasional nasional',
      description:
        'Kami mengerti kebutuhan mobilitas tamu dari Sumatera maupun Jawa.',
    },
    {
      title: 'Custom itinerary',
      description:
        'Ingin mampir kulineran dulu setelah turun gunung? Kita atur.',
    },
    {
      title: 'Safety first',
      description: 'Guide kami terlatih menangani kondisi darurat di gunung.',
    },
  ],
  ctaTitle: 'Konsultasikan Trip Impianmu Sekarang!',
  ctaDescription:
    'Private trip biasanya butuh tanya-jawab dulu sebelum deal. Langsung chat kami untuk cek jadwal, estimasi harga, dan penyesuaian itinerary.',
  notes: [
    'Add-on: kamu bisa tambahkan pilihan porter pribadi jika benar-benar tidak mau bawa tas sama sekali (bahkan daypack).',
    'Harga “mulai dari” menyesuaikan gunung, musim, dan jumlah peserta. Tiket Rinjani beda jauh dengan Merbabu, jadi angka ini filter budget tanpa mengunci satu harga kaku.',
  ],
};
