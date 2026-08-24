/**
 * Seed notable Bali mountains into local MongoDB.
 * MAGMA as of 21 Aug 2026: Agung and Batur are Level I (Normal).
 * Images omitted.
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
  bali: new ObjectId('6a7ff6ada2e8ecd3b9393af1'),
};

const CITY = {
  badung: new ObjectId('6a7ff6ada2e8ecd3b9393c1a'),
  bangli: new ObjectId('6a7ff6ada2e8ecd3b9393c1d'),
  buleleng: new ObjectId('6a7ff6ada2e8ecd3b9393c1f'),
  jembrana: new ObjectId('6a7ff6ada2e8ecd3b9393c18'),
  karangasem: new ObjectId('6a7ff6ada2e8ecd3b9393c1e'),
  tabanan: new ObjectId('6a7ff6ada2e8ecd3b9393c19'),
};

const mountains = [
  {
    name: 'Gunung Agung',
    description:
      'Gunung Agung adalah gunung berapi aktif tertinggi di pulau Bali, Indonesia, dengan ketinggian 3.142 meter di atas permukaan laut. Terletak di Kabupaten Karangasem, gunung stratovolcano ini sangat disucikan oleh masyarakat Hindu Bali karena diyakini sebagai istana dewa atau poros alam semesta.',
    elevation: 3142,
    province: PROVINCE.bali,
    city: CITY.karangasem,
    latitude: -8.3429,
    longitude: 115.5072,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Batukaru',
    description:
      'Gunung Batukaru, juga disebut Batukau, adalah gunung tertinggi kedua di Bali, dengan ketinggian 2.276 meter di atas permukaan laut. Terletak di Kabupaten Tabanan, stratovolcano yang sudah tidak aktif ini sangat disucikan; Pura Luhur Batukaru di kaki gunungnya termasuk sad kahyangan, dan hutannya termasuk yang paling basah dan liar di Bali.',
    elevation: 2276,
    province: PROVINCE.bali,
    city: CITY.tabanan,
    latitude: -8.33485,
    longitude: 115.08844,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Abang',
    description:
      'Gunung Abang adalah puncak tertinggi di tepi kaldera Batur, Kabupaten Bangli, dengan ketinggian 2.151 meter di atas permukaan laut. Gunung berapi yang sudah tidak meletus ini menghadap Danau Batur dan Agung, serta menjadi alternatif pendakian yang jauh lebih sepi dibanding Batur di dasar kaldera.',
    elevation: 2151,
    province: PROVINCE.bali,
    city: CITY.bangli,
    latitude: -8.2803,
    longitude: 115.4297,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Catur',
    description:
      'Gunung Catur, dikenal juga sebagai Puncak Mangu, adalah gunung berapi tidak aktif di Kabupaten Badung, dengan ketinggian 2.096 meter di atas permukaan laut. Puncaknya di tepi kaldera Bedugul menyimpan Pura Puncak Mangu dan menawarkan pemandangan Danau Beratan serta dataran tinggi Bali tengah.',
    elevation: 2096,
    province: PROVINCE.bali,
    city: CITY.badung,
    latitude: -8.25524,
    longitude: 115.19014,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sanghyang',
    description:
      'Gunung Sanghyang adalah gunung berapi tidak aktif di kompleks Batukaru-Bedugul, Kabupaten Tabanan, dengan ketinggian 2.087 meter di atas permukaan laut. Namanya merujuk pada yang suci; puncak berhutan ini jarang didaki dan menjadi bagian dari kaldera Bratan purba di Bali barat.',
    elevation: 2087,
    province: PROVINCE.bali,
    city: CITY.tabanan,
    latitude: -8.322,
    longitude: 115.103,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Pohen',
    description:
      'Gunung Pohen adalah gunung berapi tidak aktif di kawasan Bedugul, Kabupaten Tabanan, dengan ketinggian 2.063 meter di atas permukaan laut. Lerengnya menyimpan lapangan panas bumi Bedugul dan hutan Cagar Alam Batukahu, serta menghadap Danau Beratan dari sisi selatan kaldera.',
    elevation: 2063,
    province: PROVINCE.bali,
    city: CITY.tabanan,
    latitude: -8.27,
    longitude: 115.15,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Tapak',
    description:
      'Gunung Tapak adalah gunung berapi tidak aktif di Bedugul, Kabupaten Tabanan, dengan ketinggian 1.909 meter di atas permukaan laut. Di puncaknya terdapat Pura Puncak Terate Bang dan makam yang dikeramatkan, sehingga gunung ini ramai diziarahi sekaligus didaki di kawasan tiga danau Bali.',
    elevation: 1909,
    province: PROVINCE.bali,
    city: CITY.tabanan,
    latitude: -8.257,
    longitude: 115.103,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Lesung',
    description:
      'Gunung Lesung adalah gunung berapi tidak aktif di tepi Danau Tamblingan, Kabupaten Tabanan, dengan ketinggian 1.865 meter di atas permukaan laut. Kawah lebarnya disebut Lubang Nagaloka; jalur mengelilingi bibir kawah masih sepi dan melewati hutan basah kaldera Bratan.',
    elevation: 1865,
    province: PROVINCE.bali,
    city: CITY.tabanan,
    latitude: -8.281,
    longitude: 115.081,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Adeng',
    description:
      'Gunung Adeng adalah gunung berapi tidak aktif di sisi selatan kompleks Batukaru, Kabupaten Tabanan, dengan ketinggian 1.826 meter di atas permukaan laut. Puncak berhutan ini jarang didaki dibanding Agung atau Batur, dan menjadi bagian dari jajaran gunung suci Bali barat.',
    elevation: 1826,
    province: PROVINCE.bali,
    city: CITY.tabanan,
    latitude: -8.378,
    longitude: 115.095,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Batur',
    description:
      'Gunung Batur adalah gunung berapi aktif di Kecamatan Kintamani, Kabupaten Bangli, dengan ketinggian 1.717 meter di atas permukaan laut. Kerucut di dalam kaldera ganda ini menghadap Danau Batur dan dipantau pada tingkat aktivitas Normal; pendakian matahari terbit ke kawah menjadi salah satu yang paling ramai di Bali.',
    elevation: 1717,
    province: PROVINCE.bali,
    city: CITY.bangli,
    latitude: -8.2372,
    longitude: 115.3769,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Patas',
    description:
      'Gunung Patas adalah gunung berapi tidak aktif di Kabupaten Buleleng, Bali utara, dengan ketinggian 1.414 meter di atas permukaan laut. Terletak di dekat Pantai Celukan Bawang, puncaknya menghadap Laut Bali dan menjadi salah satu gunung tertinggi di Buleleng yang masih sepi dari pendaki wisata.',
    elevation: 1414,
    province: PROVINCE.bali,
    city: CITY.buleleng,
    latitude: -8.247,
    longitude: 114.837,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Merbuk',
    description:
      'Gunung Merbuk adalah gunung berapi tidak aktif tertinggi di Kabupaten Jembrana, Bali barat, dengan ketinggian 1.386 meter di atas permukaan laut. Bersama Gunung Mesehe ia membagi aliran sungai ke pesisir utara dan selatan, termasuk hulu Sungai Ijo Gading yang melewati pusat kota Jembrana.',
    elevation: 1386,
    province: PROVINCE.bali,
    city: CITY.jembrana,
    latitude: -8.22,
    longitude: 114.65,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Seraya',
    description:
      'Gunung Seraya adalah gunung berapi tidak aktif paling timur di Bali, Kabupaten Karangasem, dengan ketinggian 1.058 meter di atas permukaan laut. Di sisi kawah purbanya berdiri Pura Lempuyang Luhur; dari puncak dan pura ini terlihat Agung, Selat Lombok, dan pesisir Amed.',
    elevation: 1058,
    province: PROVINCE.bali,
    city: CITY.karangasem,
    latitude: -8.394,
    longitude: 115.647,
    type: 'volcano',
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
