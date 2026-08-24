/**
 * Seed notable Sumatra mountains into local MongoDB.
 * Status follows MAGMA Indonesia as of 21 Aug 2026.
 * Images are omitted (empty array).
 */
const { MongoClient, ObjectId } = require('mongodb');

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const PROVINCE = {
  aceh: new ObjectId('6a7ff6ada2e8ecd3b9393ae1'),
  sumut: new ObjectId('6a7ff6ada2e8ecd3b9393ae2'),
  sumbar: new ObjectId('6a7ff6ada2e8ecd3b9393ae3'),
  jambi: new ObjectId('6a7ff6ada2e8ecd3b9393ae5'),
  sumsel: new ObjectId('6a7ff6ada2e8ecd3b9393ae6'),
  bengkulu: new ObjectId('6a7ff6ada2e8ecd3b9393ae7'),
  lampung: new ObjectId('6a7ff6ada2e8ecd3b9393ae8'),
};

const CITY = {
  gayoLues: new ObjectId('6a7ff6ada2e8ecd3b9393b13'),
  acehTenggara: new ObjectId('6a7ff6ada2e8ecd3b9393b08'),
  benerMeriah: new ObjectId('6a7ff6ada2e8ecd3b9393b17'),
  pidie: new ObjectId('6a7ff6ada2e8ecd3b9393b0d'),
  acehBesar: new ObjectId('6a7ff6ada2e8ecd3b9393b0c'),
  karo: new ObjectId('6a7ff6ada2e8ecd3b9393b23'),
  mandailingNatal: new ObjectId('6a7ff6ada2e8ecd3b9393b2a'),
  samosir: new ObjectId('6a7ff6ada2e8ecd3b9393b2e'),
  pasamanBarat: new ObjectId('6a7ff6ada2e8ecd3b9393b4a'),
  agam: new ObjectId('6a7ff6ada2e8ecd3b9393b44'),
  solok: new ObjectId('6a7ff6ada2e8ecd3b9393b40'),
  padangPariaman: new ObjectId('6a7ff6ada2e8ecd3b9393b43'),
  limaPuluhKota: new ObjectId('6a7ff6ada2e8ecd3b9393b45'),
  kerinci: new ObjectId('6a7ff6ada2e8ecd3b9393b5e'),
  merangin: new ObjectId('6a7ff6ada2e8ecd3b9393b5f'),
  pagarAlam: new ObjectId('6a7ff6ada2e8ecd3b9393b77'),
  lebong: new ObjectId('6a7ff6ada2e8ecd3b9393b80'),
  rejangLebong: new ObjectId('6a7ff6ada2e8ecd3b9393b7b'),
  lampungBarat: new ObjectId('6a7ff6ada2e8ecd3b9393b87'),
  tanggamus: new ObjectId('6a7ff6ada2e8ecd3b9393b89'),
  lampungSelatan: new ObjectId('6a7ff6ada2e8ecd3b9393b84'),
};

const mountains = [
  {
    name: 'Gunung Leuser',
    description:
      'Gunung Leuser adalah puncak ikonik di jajaran Taman Nasional Gunung Leuser, Aceh, dengan ketinggian sekitar 3.466 meter di atas permukaan laut pada Puncak Tanpa Nama. Terletak di Kabupaten Gayo Lues, kompleks gunung non-vulkanik ini menjadi salah satu habitat terakhir harimau, orangutan, dan gajah Sumatra, serta terkenal sebagai jalur pendakian liar yang menuntut ketahanan tinggi.',
    elevation: 3466,
    province: PROVINCE.aceh,
    city: CITY.gayoLues,
    latitude: 3.7475,
    longitude: 97.2192,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kemiri',
    description:
      'Gunung Kemiri adalah salah satu puncak tertinggi di Taman Nasional Gunung Leuser, dengan ketinggian 3.317 meter di atas permukaan laut. Terletak di Kabupaten Gayo Lues, Aceh, gunung non-vulkanik ini dikenal karena padang sabana di ketinggian sekitar 2.800 mdpl serta keanekaragaman hayati yang dilindungi, termasuk orangutan Sumatra.',
    elevation: 3317,
    province: PROVINCE.aceh,
    city: CITY.gayoLues,
    latitude: 3.7477,
    longitude: 97.4791,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Bandahara',
    description:
      'Gunung Bandahara adalah gunung non-vulkanik di Pegunungan Bukit Barisan, Aceh, dengan ketinggian 3.012 meter di atas permukaan laut. Terletak di Kabupaten Aceh Tenggara, puncak ini berada di kawasan Taman Nasional Gunung Leuser dan menawarkan jalur pendakian hutan hujan yang masih sepi serta pemandangan jajaran puncak Aceh yang bergelombang.',
    elevation: 3012,
    province: PROVINCE.aceh,
    city: CITY.acehTenggara,
    latitude: 3.8667,
    longitude: 97.6333,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Geureudong',
    description:
      'Gunung Geureudong, atau Bur ni Geureudong, adalah kompleks stratovolcano di dataran tinggi Aceh dengan ketinggian 2.885 meter di atas permukaan laut. Terletak di Kabupaten Bener Meriah, gunung ini merupakan bangunan vulkanik tua yang sudah tidak aktif, sementara kerucut aktif di sisi selatannya adalah Gunung Burni Telong.',
    elevation: 2885,
    province: PROVINCE.aceh,
    city: CITY.benerMeriah,
    latitude: 4.8106,
    longitude: 96.8163,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Peut Sague',
    description:
      'Gunung Peut Sague adalah gunung berapi aktif di Aceh dengan ketinggian 2.801 meter di atas permukaan laut. Terletak di Kabupaten Pidie, stratovolcano ini dipantau PVMBG dan saat ini berada pada tingkat aktivitas Normal. Kawasan sekitarnya berupa hutan lebat di punggung Bukit Barisan yang masih jarang didaki.',
    elevation: 2801,
    province: PROVINCE.aceh,
    city: CITY.pidie,
    latitude: 4.914,
    longitude: 96.329,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Burni Telong',
    description:
      'Gunung Burni Telong adalah gunung berapi aktif di Kabupaten Bener Meriah, Aceh, dengan ketinggian 2.624 meter di atas permukaan laut. Kerucut ini berdiri di sisi selatan kompleks Geureudong dan saat ini berstatus Waspada menurut MAGMA Indonesia, sehingga aktivitas di sekitar kawah dibatasi.',
    elevation: 2624,
    province: PROVINCE.aceh,
    city: CITY.benerMeriah,
    latitude: 4.769,
    longitude: 96.821,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Seulawah Agam',
    description:
      'Gunung Seulawah Agam adalah gunung berapi aktif di ujung barat laut Sumatra, dengan ketinggian 1.810 meter di atas permukaan laut. Terletak di Kabupaten Aceh Besar, stratovolcano berhutan lebat ini memiliki kaldera Lam Teuba dan dipantau pada tingkat aktivitas Normal, sehingga pendakian ke kawasan hutan di lerengnya masih dimungkinkan dengan kewaspadaan di sekitar kawah.',
    elevation: 1810,
    province: PROVINCE.aceh,
    city: CITY.acehBesar,
    latitude: 5.4475,
    longitude: 95.6558,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sibuatan',
    description:
      'Gunung Sibuatan adalah puncak tertinggi di Sumatera Utara, dengan ketinggian 2.457 meter di atas permukaan laut. Terletak di perbatasan Kabupaten Karo dan Dairi, gunung non-vulkanik di tepi kaldera Toba ini dijuluki atap Sumatera Utara karena pemandangannya ke Danau Toba, Sinabung, dan Sibayak.',
    elevation: 2457,
    province: PROVINCE.sumut,
    city: CITY.karo,
    latitude: 2.9183,
    longitude: 98.4235,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sinabung',
    description:
      'Gunung Sinabung adalah gunung berapi aktif di Kabupaten Karo, Sumatera Utara, dengan ketinggian 2.460 meter di atas permukaan laut. Stratovolcano kerucut ini kembali meletus setelah berabad-abad tidur dan saat ini berstatus Waspada; zona bahaya diperluas hingga radius 3 kilometer dari puncak sehingga pendakian ditutup.',
    elevation: 2460,
    province: PROVINCE.sumut,
    city: CITY.karo,
    latitude: 3.1714,
    longitude: 98.3906,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Sibayak',
    description:
      'Gunung Sibayak adalah gunung berapi di atas kota wisata Berastagi, Kabupaten Karo, Sumatera Utara, dengan ketinggian 2.212 meter di atas permukaan laut. Meskipun letusan terakhirnya terjadi pada 1881, aktivitas panas bumi masih kuat berupa fumarol, belerang, dan mata air panas, sehingga gunung ini menjadi salah satu jalur pendakian sehari yang paling mudah di Sumatra.',
    elevation: 2212,
    province: PROVINCE.sumut,
    city: CITY.karo,
    latitude: 3.2474,
    longitude: 98.5006,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sorikmarapi',
    description:
      'Gunung Sorikmarapi adalah gunung berapi aktif di Kabupaten Mandailing Natal, Sumatera Utara, dengan ketinggian 2.145 meter di atas permukaan laut. Stratovolcano ini memiliki kawah dan danau kawah di puncaknya, serta saat ini berstatus Waspada menurut MAGMA Indonesia sehingga pendakian ke kawasan puncak ditutup.',
    elevation: 2145,
    province: PROVINCE.sumut,
    city: CITY.mandailingNatal,
    latitude: 0.686,
    longitude: 99.539,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Pusuk Buhit',
    description:
      'Gunung Pusuk Buhit adalah gunung suci masyarakat Batak di tepi barat Danau Toba, Kabupaten Samosir, Sumatera Utara, dengan ketinggian 1.982 meter di atas permukaan laut. Menurut tradisi, leluhur Batak Si Raja Batak turun di lereng gunung ini; secara geologi ia terkait dengan sisa kaldera Toba yang sudah tidak aktif.',
    elevation: 1982,
    province: PROVINCE.sumut,
    city: CITY.samosir,
    latitude: 2.603,
    longitude: 98.652,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Talamau',
    description:
      'Gunung Talamau, juga disebut Gunung Ophir, adalah gunung tertinggi di Sumatera Barat dengan ketinggian 2.919 meter di atas permukaan laut. Terletak di Kabupaten Pasaman Barat, gunung non-vulkanik ini memiliki beberapa puncak termasuk Puncak Rajawali dan Puncak Trimarta, serta jalur hutan yang menantang menuju padang edelweis.',
    elevation: 2919,
    province: PROVINCE.sumbar,
    city: CITY.pasamanBarat,
    latitude: 0.0792,
    longitude: 99.9833,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Marapi',
    description:
      'Gunung Marapi adalah gunung berapi paling aktif di Pulau Sumatra, dengan ketinggian 2.891 meter di atas permukaan laut pada Puncak Garuda. Terletak di Kabupaten Agam, Sumatera Barat, stratovolcano ini sangat penting dalam mitos Minangkabau sebagai tempat pertama nenek moyang mendarat, dan saat ini berstatus Waspada dengan larangan aktivitas dalam radius 3 kilometer dari Kawah Verbeek.',
    elevation: 2891,
    province: PROVINCE.sumbar,
    city: CITY.agam,
    latitude: -0.3804,
    longitude: 100.4736,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Singgalang',
    description:
      'Gunung Singgalang adalah gunung berapi tidak aktif di Kabupaten Agam, Sumatera Barat, dengan ketinggian 2.877 meter di atas permukaan laut. Berdiri berhadapan dengan Marapi di seberang Bukittinggi, puncaknya menyimpan Danau Dewi dan Danau Kumbang, dan menjadi salah satu jalur pendakian klasik Minangkabau yang relatif aman karena tidak memiliki catatan letusan historis.',
    elevation: 2877,
    province: PROVINCE.sumbar,
    city: CITY.agam,
    latitude: -0.39,
    longitude: 100.3308,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Talang',
    description:
      'Gunung Talang adalah gunung berapi aktif di Kabupaten Solok, Sumatera Barat, dengan ketinggian 2.597 meter di atas permukaan laut. Stratovolcano ini memiliki Danau Talang di lerengnya dan dipantau pada tingkat aktivitas Normal, sehingga pendakian masih dibuka dengan kewaspadaan di kawasan kawah.',
    elevation: 2597,
    province: PROVINCE.sumbar,
    city: CITY.solok,
    latitude: -0.9783,
    longitude: 100.6794,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Tandikat',
    description:
      'Gunung Tandikat adalah gunung berapi aktif yang berpasangan dengan Singgalang di Sumatera Barat, dengan ketinggian 2.438 meter di atas permukaan laut. Terletak di Kabupaten Padang Pariaman, stratovolcano ini lebih jarang didaki dibanding tetangganya dan saat ini berstatus Normal menurut MAGMA Indonesia.',
    elevation: 2438,
    province: PROVINCE.sumbar,
    city: CITY.padangPariaman,
    latitude: -0.433,
    longitude: 100.317,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sago',
    description:
      'Gunung Sago, juga dikenal sebagai Gunung Malintang, adalah gunung berapi tidak aktif di Kabupaten Lima Puluh Kota, Sumatera Barat, dengan ketinggian 2.261 meter di atas permukaan laut. Gunung ini menghadap kota Payakumbuh dan dikenal dengan jalur hutan serta pemandangan hamparan sawah Minangkabau dari puncaknya.',
    elevation: 2261,
    province: PROVINCE.sumbar,
    city: CITY.limaPuluhKota,
    latitude: -0.323,
    longitude: 100.661,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kerinci',
    description:
      'Gunung Kerinci adalah gunung tertinggi di Pulau Sumatra dan gunung berapi tertinggi di Indonesia, dengan ketinggian 3.805 meter di atas permukaan laut pada Puncak Indrapura. Terletak di Kabupaten Kerinci, Jambi, di dalam Taman Nasional Kerinci Seblat, stratovolcano ini menjadi habitat harimau Sumatra dan saat ini berstatus Waspada; pendakian jalur Kayo Aro masih dibuka dengan larangan mendekati kawah.',
    elevation: 3805,
    province: PROVINCE.jambi,
    city: CITY.kerinci,
    latitude: -1.6966,
    longitude: 101.2642,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Masurai',
    description:
      'Gunung Masurai adalah gunung berapi tidak aktif di Kabupaten Merangin, Jambi, dengan ketinggian 2.933 meter di atas permukaan laut. Puncaknya menyimpan danau kawah dan hutan TNKS yang masih sepi, menjadikannya salah satu tujuan pendakian menengah yang menantang di jajaran Bukit Barisan bagian tengah.',
    elevation: 2933,
    province: PROVINCE.jambi,
    city: CITY.merangin,
    latitude: -2.5025,
    longitude: 101.8583,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Tujuh',
    description:
      'Gunung Tujuh adalah gunung di Kabupaten Kerinci, Jambi, dengan ketinggian 2.732 meter di atas permukaan laut. Nama tujuh merujuk pada tujuh puncak yang mengelilingi Danau Gunung Tujuh, danau kawah kaldera tertinggi di Asia Tenggara, yang terletak di dalam Taman Nasional Kerinci Seblat dan menjadi tujuan pendakian serta wisata alam yang populer.',
    elevation: 2732,
    province: PROVINCE.jambi,
    city: CITY.kerinci,
    latitude: -1.6747,
    longitude: 101.425,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Dempo',
    description:
      'Gunung Dempo adalah gunung berapi aktif tertinggi di Sumatera Selatan, dengan ketinggian 3.173 meter di atas permukaan laut. Terletak di Kota Pagar Alam, stratovolcano ini memiliki kompleks kawah dan danau di puncaknya, serta saat ini berstatus Waspada setelah aktivitas freatik; pendakian ke kawasan puncak ditutup mengikuti rekomendasi PVMBG.',
    elevation: 3173,
    province: PROVINCE.sumsel,
    city: CITY.pagarAlam,
    latitude: -4.0158,
    longitude: 103.1283,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Seblat',
    description:
      'Gunung Seblat adalah gunung non-vulkanik di Pegunungan Bukit Barisan, Bengkulu, dengan ketinggian 2.383 meter di atas permukaan laut. Terletak di Kabupaten Lebong, puncak ini berada di kawasan Taman Nasional Kerinci Seblat dan menjadi bagian dari habitat penting badak Sumatra serta hutan primer yang masih utuh.',
    elevation: 2383,
    province: PROVINCE.bengkulu,
    city: CITY.lebong,
    latitude: -3.227,
    longitude: 102.366,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kaba',
    description:
      'Gunung Kaba adalah gunung berapi aktif di Kabupaten Rejang Lebong, Bengkulu, dengan ketinggian 1.952 meter di atas permukaan laut. Stratovolcano ini memiliki beberapa kawah di puncaknya dan dipantau pada tingkat aktivitas Normal, sehingga pendakian menuju kawah masih menjadi destinasi populer dari Kota Curup.',
    elevation: 1952,
    province: PROVINCE.bengkulu,
    city: CITY.rejangLebong,
    latitude: -3.522,
    longitude: 102.615,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Pesagi',
    description:
      'Gunung Pesagi adalah puncak tertinggi di Provinsi Lampung, dengan ketinggian 2.230 meter di atas permukaan laut. Terletak di Kabupaten Lampung Barat, gunung non-vulkanik ini menawarkan pemandangan dataran tinggi Liwa dan jajaran Bukit Barisan selatan, serta menjadi tujuan pendakian yang relatif sepi dibanding gunung-gunung di Jawa.',
    elevation: 2230,
    province: PROVINCE.lampung,
    city: CITY.lampungBarat,
    latitude: -4.904,
    longitude: 104.135,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Tanggamus',
    description:
      'Gunung Tanggamus adalah gunung berapi kuarter yang sudah tidak aktif di Kabupaten Tanggamus, Lampung, dengan ketinggian 2.102 meter di atas permukaan laut. Stratovolcano berhutan lebat ini tidak memiliki catatan letusan historis dan menjadi tujuan pendakian dekat Bandar Lampung dengan pemandangan Teluk Semangka dari puncaknya.',
    elevation: 2102,
    province: PROVINCE.lampung,
    city: CITY.tanggamus,
    latitude: -5.427,
    longitude: 104.675,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Seminung',
    description:
      'Gunung Seminung adalah gunung berapi tidak aktif di tepi Danau Ranau, Kabupaten Lampung Barat, dengan ketinggian 1.881 meter di atas permukaan laut. Lerengnya yang hijau menghadap danau kaldera terbesar kedua di Sumatra, dan jalur pendakiannya relatif singkat menuju pemandangan Danau Ranau dan perbatasan Sumatera Selatan.',
    elevation: 1881,
    province: PROVINCE.lampung,
    city: CITY.lampungBarat,
    latitude: -4.926,
    longitude: 103.868,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Anak Krakatau',
    description:
      'Anak Krakatau adalah gunung berapi aktif yang tumbuh di Kaldera Krakatau, Selat Sunda, dengan ketinggian sekitar 157 meter di atas permukaan laut yang terus berubah karena erupsi. Secara administratif masuk Kabupaten Lampung Selatan, pulau vulkanik ini saat ini berstatus Siaga; aktivitas di sekitar kawah dan perairan dekat pulau dilarang.',
    elevation: 157,
    province: PROVINCE.lampung,
    city: CITY.lampungSelatan,
    latitude: -6.102,
    longitude: 105.423,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
];

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ayuk-gunung';
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const col = db.collection('mountains');

  const now = new Date();
  let inserted = 0;
  let skipped = 0;

  for (const mountain of mountains) {
    const slug = slugify(mountain.name);
    const exists = await col.findOne({
      $or: [{ slug }, { name: mountain.name }],
    });
    if (exists) {
      skipped += 1;
      console.log(`skip  ${mountain.name}`);
      continue;
    }

    await col.insertOne({
      ...mountain,
      slug,
      images: [],
      createdAt: now,
      updatedAt: now,
    });
    inserted += 1;
    console.log(`ok    ${mountain.name} (${slug})`);
  }

  const total = await col.countDocuments();
  console.log(`\ninserted=${inserted} skipped=${skipped} total_mountains=${total}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
