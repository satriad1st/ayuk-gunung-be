/**
 * Seed notable Kalimantan mountains into local MongoDB.
 * Kalimantan has no active volcanoes; images are omitted.
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
  kalbar: new ObjectId('6a7ff6ada2e8ecd3b9393af4'),
  kalteng: new ObjectId('6a7ff6ada2e8ecd3b9393af5'),
  kalsel: new ObjectId('6a7ff6ada2e8ecd3b9393af6'),
  kaltim: new ObjectId('6a7ff6ada2e8ecd3b9393af7'),
  kaltara: new ObjectId('6a7ff6ada2e8ecd3b9393af8'),
};

const CITY = {
  katingan: new ObjectId('6a7ff6ada2e8ecd3b9393c54'),
  kapuasHulu: new ObjectId('6a7ff6ada2e8ecd3b9393c46'),
  bengkayang: new ObjectId('6a7ff6ada2e8ecd3b9393c47'),
  landak: new ObjectId('6a7ff6ada2e8ecd3b9393c48'),
  kayongUtara: new ObjectId('6a7ff6ada2e8ecd3b9393c4b'),
  sintang: new ObjectId('6a7ff6ada2e8ecd3b9393c45'),
  murungRaya: new ObjectId('6a7ff6ada2e8ecd3b9393c5a'),
  huluSungaiTengah: new ObjectId('6a7ff6ada2e8ecd3b9393c63'),
  banjar: new ObjectId('6a7ff6ada2e8ecd3b9393c5f'),
  mahakamUlu: new ObjectId('6a7ff6ada2e8ecd3b9393c70'),
  kutaiBarat: new ObjectId('6a7ff6ada2e8ecd3b9393c6d'),
  penajam: new ObjectId('6a7ff6ada2e8ecd3b9393c6f'),
  paser: new ObjectId('6a7ff6ada2e8ecd3b9393c6a'),
  malinau: new ObjectId('6a7ff6ada2e8ecd3b9393c75'),
};

const mountains = [
  {
    name: 'Gunung Bukit Raya',
    description:
      'Gunung Bukit Raya adalah gunung tertinggi di Kalimantan bagian Indonesia, dengan ketinggian 2.278 meter di atas permukaan laut pada Puncak Kakam. Terletak di Kabupaten Katingan, Kalimantan Tengah, di perbatasan dengan Kalimantan Barat, puncak non-vulkanik ini masuk Taman Nasional Bukit Baka Bukit Raya dan menjadi perwakilan Kalimantan dalam Seven Summits Indonesia.',
    elevation: 2278,
    province: PROVINCE.kalteng,
    city: CITY.katingan,
    latitude: -0.6599,
    longitude: 112.6889,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Batu Jumak',
    description:
      'Batu Jumak adalah salah satu puncak tertinggi di Kalimantan Utara, dengan ketinggian 2.250 meter di atas permukaan laut. Terletak di Kabupaten Malinau di jajaran terpencil Heart of Borneo, gunung non-vulkanik ini masih jarang didaki dan dikelilingi hutan primer yang menjadi bagian dari lanskap Kayan Mentarang.',
    elevation: 2250,
    province: PROVINCE.kaltara,
    city: CITY.malinau,
    latitude: 1.81961,
    longitude: 115.2725,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Liangpran',
    description:
      'Gunung Liangpran adalah puncak tertinggi di Kalimantan Timur, dengan ketinggian 2.240 meter di atas permukaan laut. Terletak di Kecamatan Long Pahangai, Kabupaten Mahakam Ulu, gunung non-vulkanik di Pegunungan Muller ini menjadi tujuan ekspedisi terpencil menuju hutan hulu Mahakam.',
    elevation: 2240,
    province: PROVINCE.kaltim,
    city: CITY.mahakamUlu,
    latitude: 1.0446,
    longitude: 114.3671,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Belayan',
    description:
      'Gunung Belayan adalah gunung non-vulkanik di pedalaman Kalimantan Timur, dengan ketinggian 2.195 meter di atas permukaan laut. Terletak di Kabupaten Kutai Barat, puncak ini termasuk yang tertinggi di pulau Kalimantan bagian Indonesia dan masih jarang dijelajahi karena aksesnya yang jauh di hulu daerah aliran Sungai Belayan.',
    elevation: 2195,
    province: PROVINCE.kaltim,
    city: CITY.kutaiBarat,
    latitude: 1.5258,
    longitude: 115.9958,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kerihun',
    description:
      'Gunung Kerihun adalah puncak tertinggi di Kalimantan Barat, dengan ketinggian 2.005 meter di atas permukaan laut. Terletak di Kabupaten Kapuas Hulu, gunung non-vulkanik ini berada di Taman Nasional Betung Kerihun dekat perbatasan Sarawak dan memerlukan ekspedisi sungai selama berhari-hari dari Putussibau.',
    elevation: 2005,
    province: PROVINCE.kalbar,
    city: CITY.kapuasHulu,
    latitude: 1.0354,
    longitude: 113.8895,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Bukit Sapat Hawung',
    description:
      'Bukit Sapat Hawung adalah salah satu puncak tertinggi di Kalimantan Tengah, dengan ketinggian 1.906 meter di atas permukaan laut. Terletak di Kabupaten Murung Raya, gunung non-vulkanik di jajaran Muller-Schwaner ini dikelilingi hutan primer Heart of Borneo yang masih sangat sepi dari jalur pendakian reguler.',
    elevation: 1906,
    province: PROVINCE.kalteng,
    city: CITY.murungRaya,
    latitude: 0.44539,
    longitude: 114.13043,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Halau-Halau',
    description:
      'Gunung Halau-Halau, juga disebut Gunung Besar, adalah puncak tertinggi di Kalimantan Selatan, dengan ketinggian 1.901 meter di atas permukaan laut. Terletak di Kabupaten Hulu Sungai Tengah pada Pegunungan Meratus, gunung suci masyarakat adat Dayak Meratus ini ditutup untuk pendakian umum sejak Mei 2026 demi menjaga kesakralan puncak dan hutan adat.',
    elevation: 1901,
    province: PROVINCE.kalsel,
    city: CITY.huluSungaiTengah,
    latitude: -2.7105,
    longitude: 115.626,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Lawit',
    description:
      'Gunung Lawit adalah gunung non-vulkanik di perbatasan Indonesia-Malaysia, dengan ketinggian 1.767 meter di atas permukaan laut. Terletak di Kabupaten Kapuas Hulu, Kalimantan Barat, puncak ini menjadi titik tertinggi Pegunungan Kapuas Hulu dan masuk kawasan Taman Nasional Betung Kerihun sebagai hulu Sungai Embaloh dan Sungai Sibau.',
    elevation: 1767,
    province: PROVINCE.kalbar,
    city: CITY.kapuasHulu,
    latitude: 1.3417,
    longitude: 112.9554,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Niut',
    description:
      'Gunung Niut adalah gunung non-vulkanik di Kabupaten Landak, Kalimantan Barat, dengan ketinggian 1.682 meter di atas permukaan laut. Puncak ini memberi nama Cagar Alam Gunung Nyiut-Penrissen dan dikenal karena hutan lumut serta flora pegunungan; pendakian memerlukan izin BKSDA karena kawasannya dikelola sebagai cagar alam.',
    elevation: 1682,
    province: PROVINCE.kalbar,
    city: CITY.landak,
    latitude: 1.0025,
    longitude: 109.9333,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Bawang',
    description:
      'Gunung Bawang adalah gunung non-vulkanik yang dikeramatkan masyarakat Dayak di Kabupaten Bengkayang, Kalimantan Barat, dengan ketinggian 1.428 meter di atas permukaan laut. Memiliki beberapa puncak runcing, gunung ini menjadi salah satu jalur pendakian paling mudah dijangkau dari Pontianak, dengan pemandangan hutan, sungai, dan kantong semar di sepanjang ridgenya.',
    elevation: 1428,
    province: PROVINCE.kalbar,
    city: CITY.bengkayang,
    latitude: 0.9111,
    longitude: 109.3855,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kahung',
    description:
      'Gunung Kahung adalah gunung non-vulkanik di Pegunungan Meratus, Kalimantan Selatan, dengan ketinggian 1.285 meter di atas permukaan laut. Terletak di Kabupaten Banjar, puncak ini menjadi tujuan ekspedisi yang lebih sepi dibanding Halau-Halau dan menawarkan hutan Meratus serta pemandangan Danau Riam Kanan dari punggungnya.',
    elevation: 1285,
    province: PROVINCE.kalsel,
    city: CITY.banjar,
    latitude: -3.69035,
    longitude: 115.03069,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Lumut',
    description:
      'Gunung Lumut adalah gunung non-vulkanik di Kabupaten Paser, Kalimantan Timur, dengan ketinggian 1.236 meter di atas permukaan laut. Namanya merujuk pada hutan lumut di puncaknya; gunung ini termasuk yang relatif lebih mudah dijangkau dari Balikpapan dibanding puncak-puncak pedalaman Borneo lainnya.',
    elevation: 1236,
    province: PROVINCE.kaltim,
    city: CITY.paser,
    latitude: -1.3962,
    longitude: 115.9903,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Beratus',
    description:
      'Gunung Beratus adalah gunung non-vulkanik di hinterland Balikpapan, Kabupaten Penajam Paser Utara, Kalimantan Timur, dengan ketinggian 1.235 meter di atas permukaan laut. Puncaknya yang disebut Teringkang Tajau dikelilingi hutan dan jalan logging; pendakian masih sepi dan sering dikelirukan dengan Pegunungan Meratus di Kalimantan Selatan.',
    elevation: 1235,
    province: PROVINCE.kaltim,
    city: CITY.penajam,
    latitude: -1.0211,
    longitude: 116.3362,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Palung',
    description:
      'Gunung Palung adalah gunung non-vulkanik di Kabupaten Kayong Utara, Kalimantan Barat, dengan ketinggian 1.151 meter di atas permukaan laut. Gunung ini memberi nama Taman Nasional Gunung Palung, habitat penting orangutan, owa, dan hutan gambut; jalur ke puncak melewati stasiun riset Cabang Panti sehingga akses pendakian umum ke puncak dibatasi.',
    elevation: 1151,
    province: PROVINCE.kalbar,
    city: CITY.kayongUtara,
    latitude: -1.2334,
    longitude: 110.1448,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Kelam',
    description:
      'Gunung Kelam, sering disebut Bukit Kelam, adalah kubah granit raksasa di Kabupaten Sintang, Kalimantan Barat, dengan ketinggian 940 meter di atas permukaan laut. Meski tidak setinggi puncak pedalaman Borneo, tebing vertikalnya yang didaki lewat tangga besi dan habitat kantong semar endemik menjadikannya salah satu gunung paling ikonik di Kalimantan.',
    elevation: 940,
    province: PROVINCE.kalbar,
    city: CITY.sintang,
    latitude: 0.0756,
    longitude: 111.6526,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
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
