/**
 * Seed notable Maluku and Maluku Utara mountains into local MongoDB.
 * MAGMA as of 21 Aug 2026: Banda Api, Dukono, Gamalama, Ibu = Level II.
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
  maluku: new ObjectId('6a7ff6ada2e8ecd3b9393aff'),
  malut: new ObjectId('6a7ff6ada2e8ecd3b9393b00'),
};

const CITY = {
  malukuTengah: new ObjectId('6a7ff6ada2e8ecd3b9393cca'),
  buru: new ObjectId('6a7ff6ada2e8ecd3b9393ccd'),
  malukuBaratDaya: new ObjectId('6a7ff6ada2e8ecd3b9393cd1'),
  halmaheraBarat: new ObjectId('6a7ff6ada2e8ecd3b9393cd5'),
  halmaheraSelatan: new ObjectId('6a7ff6ada2e8ecd3b9393cd8'),
  halmaheraUtara: new ObjectId('6a7ff6ada2e8ecd3b9393cd7'),
  ternate: new ObjectId('6a7ff6ada2e8ecd3b9393cdd'),
  tidore: new ObjectId('6a7ff6ada2e8ecd3b9393cde'),
};

const mountains = [
  {
    name: 'Gunung Binaiya',
    description:
      'Gunung Binaiya adalah gunung tertinggi di Kepulauan Maluku dan salah satu Seven Summits Indonesia, dengan ketinggian 3.027 meter di atas permukaan laut pada Puncak Siale. Terletak di Kabupaten Maluku Tengah, Pulau Seram, gunung non-vulkanik di Taman Nasional Manusela ini menjadi ekspedisi hutan hujan tropis yang menantang dari permukaan laut.',
    elevation: 3027,
    province: PROVINCE.maluku,
    city: CITY.malukuTengah,
    latitude: -3.17333,
    longitude: 129.45557,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kapalatmada',
    description:
      'Gunung Kapalatmada adalah puncak tertinggi di Pulau Buru, Kabupaten Buru, dengan ketinggian 2.700 meter di atas permukaan laut. Gunung non-vulkanik ini berhutan lebat dan masih sepi, menjadi habitat spesies endemik Buru di jajaran Kaku Ghegan.',
    elevation: 2700,
    province: PROVINCE.maluku,
    city: CITY.buru,
    latitude: -3.30065,
    longitude: 126.21989,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sibela',
    description:
      'Gunung Sibela, atau Buku Sibela, adalah puncak tertinggi di Maluku Utara, dengan ketinggian 2.085 meter di atas permukaan laut. Terletak di Pulau Bacan, Kabupaten Halmahera Selatan, kerucut vulkanik tidak aktif ini berhutan lebat dan menjadi tujuan ekspedisi yang jarang didaki.',
    elevation: 2085,
    province: PROVINCE.malut,
    city: CITY.halmaheraSelatan,
    latitude: -0.737,
    longitude: 127.52441,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kie Matubu',
    description:
      'Gunung Kie Matubu adalah gunung berapi tidak aktif yang membentuk hampir seluruh Pulau Tidore, dengan ketinggian 1.730 meter di atas permukaan laut. Terletak di Kota Tidore Kepulauan, kerucut simetris ini menjadi pendakian ikonik Maluku Utara dengan pemandangan Ternate, Makian, dan Laut Halmahera.',
    elevation: 1730,
    province: PROVINCE.malut,
    city: CITY.tidore,
    latitude: 0.65,
    longitude: 127.4,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Gamalama',
    description:
      'Gunung Gamalama adalah gunung berapi aktif yang membentuk Pulau Ternate, dengan ketinggian 1.715 meter di atas permukaan laut. Terletak di Kota Ternate, status saat ini Waspada; pendakian ke kawasan puncak dan kawah ditutup mengikuti rekomendasi PVMBG.',
    elevation: 1715,
    province: PROVINCE.malut,
    city: CITY.ternate,
    latitude: 0.80908,
    longitude: 127.33304,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Gamkonora',
    description:
      'Gunung Gamkonora adalah gunung berapi aktif tertinggi di Pulau Halmahera, dengan ketinggian 1.635 meter di atas permukaan laut. Terletak di Kabupaten Halmahera Barat, statusnya Normal; kawah di puncak pernah meletus pada 2007 dan kini menjadi tujuan pendakian di pesisir barat Halmahera.',
    elevation: 1635,
    province: PROVINCE.malut,
    city: CITY.halmaheraBarat,
    latitude: 1.37835,
    longitude: 127.53411,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kie Besi',
    description:
      'Gunung Kie Besi adalah gunung berapi aktif di Pulau Makian, Kabupaten Halmahera Selatan, dengan ketinggian 1.357 meter di atas permukaan laut. Letusan 1988 mengevakuasi hampir seluruh pulau; kini statusnya Normal dan kerucut kawah di puncak dapat didaki dari sisi Makian.',
    elevation: 1357,
    province: PROVINCE.malut,
    city: CITY.halmaheraSelatan,
    latitude: 0.31886,
    longitude: 127.39111,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Ibu',
    description:
      'Gunung Ibu adalah gunung berapi aktif di Kabupaten Halmahera Barat, dengan ketinggian 1.325 meter di atas permukaan laut. Termasuk yang paling sering erupsi di Indonesia saat ini, statusnya Waspada; masyarakat dan wisatawan dilarang beraktivitas dalam radius dua kilometer dari kawah aktif.',
    elevation: 1325,
    province: PROVINCE.malut,
    city: CITY.halmaheraBarat,
    latitude: 1.49067,
    longitude: 127.6305,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Dukono',
    description:
      'Gunung Dukono adalah gunung berapi aktif di Kabupaten Halmahera Utara, dengan ketinggian 1.229 meter di atas permukaan laut. Hampir terus-menerus erupsi sejak 1933, status saat ini Waspada; pendakian dan aktivitas di sekitar Kawah Malupang Warirang ditutup.',
    elevation: 1229,
    province: PROVINCE.malut,
    city: CITY.halmaheraUtara,
    latitude: 1.68,
    longitude: 127.88,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Jailolo',
    description:
      'Gunung Jailolo adalah gunung berapi tidak aktif di Kabupaten Halmahera Barat, dengan ketinggian 1.130 meter di atas permukaan laut. Kerucut di pesisir Jailolo ini menjadi destinasi pendakian dan wisata dekat Ternate, dengan kawah dan hutan tropis di lerengnya.',
    elevation: 1130,
    province: PROVINCE.malut,
    city: CITY.halmaheraBarat,
    latitude: 1.08038,
    longitude: 127.43928,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Salahutu',
    description:
      'Gunung Salahutu adalah puncak tertinggi di Pulau Ambon, Kabupaten Maluku Tengah, dengan ketinggian 1.038 meter di atas permukaan laut. Juga disebut Gunung Simalopu, gunung non-vulkanik ini menjadi pendakian populer warga Ambon dengan pemandangan Teluk Ambon dan Laut Banda.',
    elevation: 1038,
    province: PROVINCE.maluku,
    city: CITY.malukuTengah,
    latitude: -3.54568,
    longitude: 128.2558,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Wurlali',
    description:
      'Gunung Wurlali adalah gunung berapi aktif di Pulau Damar, Kabupaten Maluku Barat Daya, dengan ketinggian 868 meter di atas permukaan laut. Dipantau pada tingkat Normal, kawah belerang di puncaknya menjadi tujuan pendakian di gugusan vulkanik Laut Banda.',
    elevation: 868,
    province: PROVINCE.maluku,
    city: CITY.malukuBaratDaya,
    latitude: -7.13,
    longitude: 128.68,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Banda Api',
    description:
      'Gunung Banda Api adalah gunung berapi aktif di Kepulauan Banda, Kabupaten Maluku Tengah, dengan ketinggian 641 meter di atas permukaan laut. Letusan 1988 mengubah wajah pulau; status saat ini Waspada sehingga pendakian ke kawasan kawah ditutup.',
    elevation: 641,
    province: PROVINCE.maluku,
    city: CITY.malukuTengah,
    latitude: -4.53,
    longitude: 129.87,
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
