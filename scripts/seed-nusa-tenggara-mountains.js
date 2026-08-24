/**
 * Seed notable Nusa Tenggara mountains (Lombok, Sumbawa, Flores, Timor, Sumba).
 * MAGMA as of 21 Aug 2026.
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
  ntb: new ObjectId('6a7ff6ada2e8ecd3b9393af2'),
  ntt: new ObjectId('6a7ff6ada2e8ecd3b9393af3'),
};

const CITY = {
  lombokTimur: new ObjectId('6a7ff6ada2e8ecd3b9393c23'),
  dompu: new ObjectId('6a7ff6ada2e8ecd3b9393c25'),
  bima: new ObjectId('6a7ff6ada2e8ecd3b9393c26'),
  manggarai: new ObjectId('6a7ff6ada2e8ecd3b9393c34'),
  ngada: new ObjectId('6a7ff6ada2e8ecd3b9393c33'),
  nagekeo: new ObjectId('6a7ff6ada2e8ecd3b9393c3a'),
  ende: new ObjectId('6a7ff6ada2e8ecd3b9393c32'),
  sikka: new ObjectId('6a7ff6ada2e8ecd3b9393c31'),
  floresTimur: new ObjectId('6a7ff6ada2e8ecd3b9393c30'),
  lembata: new ObjectId('6a7ff6ada2e8ecd3b9393c37'),
  alor: new ObjectId('6a7ff6ada2e8ecd3b9393c2f'),
  tts: new ObjectId('6a7ff6ada2e8ecd3b9393c2c'),
  sumbaTimur: new ObjectId('6a7ff6ada2e8ecd3b9393c35'),
};

const mountains = [
  {
    name: 'Gunung Rinjani',
    description:
      'Gunung Rinjani adalah gunung tertinggi di Nusa Tenggara Barat dan gunung berapi tertinggi kedua di Indonesia, dengan ketinggian 3.726 meter di atas permukaan laut. Terletak di Kabupaten Lombok Timur, Pulau Lombok, stratovolcano ini memiliki kaldera Segara Anak dan kerucut Barujari; status saat ini Waspada, dan pendakian Taman Nasional dibuka dengan kuota harian.',
    elevation: 3726,
    province: PROVINCE.ntb,
    city: CITY.lombokTimur,
    latitude: -8.41166,
    longitude: 116.45813,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Tambora',
    description:
      'Gunung Tambora adalah gunung berapi aktif di Kabupaten Dompu, Pulau Sumbawa, dengan ketinggian 2.850 meter di atas permukaan laut. Letusan 1815 termasuk yang terbesar dalam sejarah manusia dan membentuk kaldera raksasa; status saat ini Waspada, pendakian dibuka melalui jalur resmi dengan larangan mendekati radius 3 kilometer dari Doro Afi To’i.',
    elevation: 2850,
    province: PROVINCE.ntb,
    city: CITY.dompu,
    latitude: -8.24661,
    longitude: 117.9588,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sangeang Api',
    description:
      'Gunung Sangeang Api adalah gunung berapi aktif di Pulau Sangeang, Kabupaten Bima, dengan ketinggian 1.949 meter di atas permukaan laut. Stratovolcano terisolasi di utara Sumbawa ini saat ini berstatus Waspada; aktivitas di pulau dan pendakian ke kawah ditutup mengikuti rekomendasi PVMBG.',
    elevation: 1949,
    province: PROVINCE.ntb,
    city: CITY.bima,
    latitude: -8.19589,
    longitude: 119.0698,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Mutis',
    description:
      'Gunung Mutis adalah puncak tertinggi di Pulau Timor bagian Indonesia, dengan ketinggian 2.427 meter di atas permukaan laut. Terletak di Kabupaten Timor Tengah Selatan, gunung non-vulkanik ini disucikan masyarakat Dawan dan menjadi hulu sungai penting Timor di dalam Cagar Alam Gunung Mutis.',
    elevation: 2427,
    province: PROVINCE.ntt,
    city: CITY.tts,
    latitude: -9.56047,
    longitude: 124.22755,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Poco Mandasawu',
    description:
      'Gunung Poco Mandasawu adalah puncak tertinggi di Pulau Flores, dengan ketinggian 2.370 meter di atas permukaan laut. Terletak di Kabupaten Manggarai, kubah lava di kompleks Ranakah ini berhutan lebat dan jarang didaki dibanding Inerie, meski menjadi titik tertinggi pulau.',
    elevation: 2370,
    province: PROVINCE.ntt,
    city: CITY.manggarai,
    latitude: -8.65167,
    longitude: 120.44833,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Inerie',
    description:
      'Gunung Inerie adalah gunung berapi aktif berbentuk kerucut di Kabupaten Ngada, Flores, dengan ketinggian 2.227 meter di atas permukaan laut. Sering disebut salah satu gunung paling simetris di Indonesia, ia dipantau pada tingkat Normal dan menjadi pendakian favorit dari Bajawa dengan pemandangan savana dan laut Sawu.',
    elevation: 2227,
    province: PROVINCE.ntt,
    city: CITY.ngada,
    latitude: -8.87807,
    longitude: 120.95442,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Ebulobo',
    description:
      'Gunung Ebulobo adalah gunung berapi aktif di Kabupaten Nagekeo, Flores, dengan ketinggian 2.137 meter di atas permukaan laut. Stratovolcano kerucut di Boawae ini dipantau pada tingkat Normal dan menawarkan jalur pendek menuju kawah dengan pemandangan pesisir selatan Flores.',
    elevation: 2137,
    province: PROVINCE.ntt,
    city: CITY.nagekeo,
    latitude: -8.81712,
    longitude: 121.19052,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Anak Ranakah',
    description:
      'Gunung Anak Ranakah, juga dikenal sebagai Poco Ranaka, adalah gunung berapi aktif di Kabupaten Manggarai, Flores, dengan ketinggian 2.100 meter di atas permukaan laut. Kubah lava yang tumbuh sejak 1987 ini dipantau pada tingkat Normal; jalan setapak dan menara di puncaknya membuatnya salah satu gunung Flores yang paling mudah diakses dari Ruteng.',
    elevation: 2100,
    province: PROVINCE.ntt,
    city: CITY.manggarai,
    latitude: -8.62,
    longitude: 120.52,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Egon',
    description:
      'Gunung Egon adalah gunung berapi aktif di Kabupaten Sikka, Flores, dengan ketinggian 1.708 meter di atas permukaan laut. Stratovolcano dekat Maumere ini dipantau pada tingkat Normal dan memiliki kawah belerang; pendakian masih dimungkinkan dengan kewaspadaan gas di puncak.',
    elevation: 1708,
    province: PROVINCE.ntt,
    city: CITY.sikka,
    latitude: -8.67587,
    longitude: 122.45503,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Lewotobi Perempuan',
    description:
      'Gunung Lewotobi Perempuan adalah puncak lebih tinggi dari kembar Lewotobi di Kabupaten Flores Timur, dengan ketinggian 1.703 meter di atas permukaan laut. Meski statusnya Normal, pendakian ditutup karena kembarannya Lewotobi Laki-laki sedang Siaga dan zona bahaya mencakup kawasan sekitar kedua kerucut.',
    elevation: 1703,
    province: PROVINCE.ntt,
    city: CITY.floresTimur,
    latitude: -8.55452,
    longitude: 122.78185,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Ili Boleng',
    description:
      'Gunung Ili Boleng adalah gunung berapi aktif di Pulau Adonara, Kabupaten Flores Timur, dengan ketinggian 1.658 meter di atas permukaan laut. Stratovolcano ini dipantau pada tingkat Normal dan menjadi puncak ikonik Adonara dengan kawah di puncak serta pemandangan Selat Flores.',
    elevation: 1658,
    province: PROVINCE.ntt,
    city: CITY.floresTimur,
    latitude: -8.34555,
    longitude: 123.25626,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kelimutu',
    description:
      'Gunung Kelimutu adalah gunung berapi aktif di Kabupaten Ende, Flores, dengan ketinggian 1.639 meter di atas permukaan laut. Terkenal karena tiga danau kawah yang berubah warna, Tiwu Ata Mbupu, Tiwu Nuwa Muri Koo Fai, dan Tiwu Ata Polo; status saat ini Normal dan wisata kawah tetap dibuka melalui Taman Nasional Kelimutu.',
    elevation: 1639,
    province: PROVINCE.ntt,
    city: CITY.ende,
    latitude: -8.76,
    longitude: 121.83,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Lewotobi Laki-laki',
    description:
      'Gunung Lewotobi Laki-laki adalah gunung berapi aktif di Kabupaten Flores Timur, dengan ketinggian 1.584 meter di atas permukaan laut. Berdiri berpasangan dengan Lewotobi Perempuan, stratovolcano ini saat ini berstatus Siaga; masyarakat dan wisatawan dilarang beraktivitas dalam radius 5 kilometer dari pusat erupsi.',
    elevation: 1584,
    province: PROVINCE.ntt,
    city: CITY.floresTimur,
    latitude: -8.542,
    longitude: 122.775,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Inielika',
    description:
      'Gunung Inielika adalah gunung berapi aktif di Kabupaten Ngada, Flores, dengan ketinggian 1.559 meter di atas permukaan laut. Dekat Bajawa dan dipantau pada tingkat Normal, kompleks kawahnya terakhir meletus pada 2001 dan menjadi pendakian singkat di dataran tinggi Ngada.',
    elevation: 1559,
    province: PROVINCE.ntt,
    city: CITY.ngada,
    latitude: -8.73,
    longitude: 120.98,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Ili Lewotolok',
    description:
      'Gunung Ili Lewotolok adalah gunung berapi aktif di Kabupaten Lembata, dengan ketinggian 1.423 meter di atas permukaan laut. Stratovolcano di pesisir utara Lembata ini saat ini berstatus Waspada; pendakian ke kawasan kawah ditutup mengikuti rekomendasi PVMBG.',
    elevation: 1423,
    province: PROVINCE.ntt,
    city: CITY.lembata,
    latitude: -8.27,
    longitude: 123.51,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Wanggameti',
    description:
      'Gunung Wanggameti adalah puncak tertinggi di Pulau Sumba, dengan ketinggian 1.225 meter di atas permukaan laut. Terletak di Kabupaten Sumba Timur, gunung non-vulkanik di Taman Nasional Laiwangi Wanggameti ini berhutan tropis dan menjadi hulu sungai penting di Sumba bagian timur.',
    elevation: 1225,
    province: PROVINCE.ntt,
    city: CITY.sumbaTimur,
    latitude: -10.11635,
    longitude: 120.23637,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Rokatenda',
    description:
      'Gunung Rokatenda, atau Paluweh, adalah gunung berapi aktif di Pulau Palue, Kabupaten Sikka, dengan ketinggian 875 meter di atas permukaan laut. Stratovolcano pulau ini dipantau pada tingkat Normal setelah letusan 2012–2013; pendakian dimungkinkan dengan koordinasi penduduk Palue.',
    elevation: 875,
    province: PROVINCE.ntt,
    city: CITY.sikka,
    latitude: -8.32,
    longitude: 121.71,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sirung',
    description:
      'Gunung Sirung adalah gunung berapi aktif di Pulau Pantar, Kabupaten Alor, dengan ketinggian 862 meter di atas permukaan laut. Kawah belerang di puncaknya dipantau pada tingkat Normal; pendakian dari desa di Pantar menawarkan pemandangan kepulauan Alor dan Laut Banda.',
    elevation: 862,
    province: PROVINCE.ntt,
    city: CITY.alor,
    latitude: -8.51,
    longitude: 124.15,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Iya',
    description:
      'Gunung Iya adalah gunung berapi aktif di tepi Kota Ende, Kabupaten Ende, dengan ketinggian 637 meter di atas permukaan laut. Stratovolcano kecil di semenanjung selatan Ende ini saat ini berstatus Waspada; aktivitas di sekitar kawah dibatasi.',
    elevation: 637,
    province: PROVINCE.ntt,
    city: CITY.ende,
    latitude: -8.88,
    longitude: 121.63,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
];

async function main() {
  const uri = 'process.env.MONGODB_URI '|| 'mongodb://127.0.0.1:27017/ayuk-gunung';
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
