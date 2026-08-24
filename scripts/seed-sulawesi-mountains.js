/**
 * Seed notable Sulawesi mountains into local MongoDB.
 * MAGMA as of 21 Aug 2026: Awu, Karangetang, Lokon, Soputan = Level II.
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
  sulut: new ObjectId('6a7ff6ada2e8ecd3b9393af9'),
  sulteng: new ObjectId('6a7ff6ada2e8ecd3b9393afa'),
  sulsel: new ObjectId('6a7ff6ada2e8ecd3b9393afb'),
  sultra: new ObjectId('6a7ff6ada2e8ecd3b9393afc'),
  sulbar: new ObjectId('6a7ff6ada2e8ecd3b9393afe'),
};

const CITY = {
  enrekang: new ObjectId('6a7ff6ada2e8ecd3b9393ca4'),
  gowa: new ObjectId('6a7ff6ada2e8ecd3b9393c9a'),
  luwu: new ObjectId('6a7ff6ada2e8ecd3b9393ca5'),
  luwuUtara: new ObjectId('6a7ff6ada2e8ecd3b9393ca7'),
  torajaUtara: new ObjectId('6a7ff6ada2e8ecd3b9393ca9'),
  pangkep: new ObjectId('6a7ff6ada2e8ecd3b9393c9e'),
  mamasa: new ObjectId('6a7ff6ada2e8ecd3b9393cc6'),
  donggala: new ObjectId('6a7ff6ada2e8ecd3b9393c8a'),
  tojoUnaUna: new ObjectId('6a7ff6ada2e8ecd3b9393c90'),
  kolakaUtara: new ObjectId('6a7ff6ada2e8ecd3b9393cb4'),
  minahasaUtara: new ObjectId('6a7ff6ada2e8ecd3b9393c7e'),
  minahasaTenggara: new ObjectId('6a7ff6ada2e8ecd3b9393c7f'),
  bolaangMongondow: new ObjectId('6a7ff6ada2e8ecd3b9393c79'),
  tomohon: new ObjectId('6a7ff6ada2e8ecd3b9393c86'),
  bitung: new ObjectId('6a7ff6ada2e8ecd3b9393c85'),
  sangihe: new ObjectId('6a7ff6ada2e8ecd3b9393c7b'),
  sitaro: new ObjectId('6a7ff6ada2e8ecd3b9393c81'),
};

const mountains = [
  {
    name: 'Gunung Latimojong',
    description:
      'Gunung Latimojong adalah gunung tertinggi di Pulau Sulawesi dan salah satu Seven Summits Indonesia, dengan ketinggian 3.478 meter di atas permukaan laut pada Puncak Rantemario. Terletak di Kabupaten Enrekang, Sulawesi Selatan, gunung non-vulkanik ini menjadi tujuan ekspedisi savana dan hutan pegunungan yang menantang.',
    elevation: 3478,
    province: PROVINCE.sulsel,
    city: CITY.enrekang,
    latitude: -3.38513,
    longitude: 120.0243,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Gandang Dewata',
    description:
      'Gunung Gandang Dewata adalah puncak tertinggi di Sulawesi Barat, dengan ketinggian 3.074 meter di atas permukaan laut. Terletak di Kabupaten Mamasa, gunung non-vulkanik di Pegunungan Quarles ini disucikan masyarakat Mamasa dan menawarkan hutan lumut serta pemandangan dataran tinggi Toraja-Mamasa.',
    elevation: 3074,
    province: PROVINCE.sulbar,
    city: CITY.mamasa,
    latitude: -2.74802,
    longitude: 119.36852,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Balease',
    description:
      'Gunung Balease, juga disebut Buyu Tolangi, adalah gunung non-vulkanik di Kabupaten Luwu Utara, Sulawesi Selatan, dengan ketinggian 3.016 meter di atas permukaan laut. Puncaknya termasuk yang tertinggi di Sulawesi dan masih sepi, dikelilingi hutan primer di jajaran Latimojong bagian utara.',
    elevation: 3016,
    province: PROVINCE.sulsel,
    city: CITY.luwuUtara,
    latitude: -2.40567,
    longitude: 120.54194,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sojol',
    description:
      'Gunung Sojol adalah salah satu puncak tertinggi di Sulawesi Tengah, dengan ketinggian 2.890 meter di atas permukaan laut. Terletak di Kabupaten Donggala, gunung non-vulkanik ini berhutan lebat dan menjadi bagian dari cagar alam yang menyimpan flora endemik Sulawesi.',
    elevation: 2890,
    province: PROVINCE.sulteng,
    city: CITY.donggala,
    latitude: 0.57742,
    longitude: 120.2048,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Lompobatang',
    description:
      'Gunung Lompobatang adalah gunung berapi tidak aktif di Kabupaten Gowa, Sulawesi Selatan, dengan ketinggian 2.886 meter di atas permukaan laut. Moncong Lompobatang menjadi puncak ikonik di utara Bantaeng-Gowa dan sumber air penting bagi Makassar serta dataran selatan Sulawesi.',
    elevation: 2886,
    province: PROVINCE.sulsel,
    city: CITY.gowa,
    latitude: -5.35361,
    longitude: 119.93467,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kambuno',
    description:
      'Gunung Kambuno adalah gunung non-vulkanik di Kabupaten Luwu, Sulawesi Selatan, dengan ketinggian 2.855 meter di atas permukaan laut. Puncak Bulu Lantangunta ini berada di jajaran Latimojong dan menjadi tujuan ekspedisi yang lebih sepi dibanding Rantemario.',
    elevation: 2855,
    province: PROVINCE.sulsel,
    city: CITY.luwu,
    latitude: -2.35468,
    longitude: 120.0717,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Bawakaraeng',
    description:
      'Gunung Bawakaraeng adalah gunung berapi tidak aktif di Kabupaten Gowa, Sulawesi Selatan, dengan ketinggian 2.840 meter di atas permukaan laut. Sangat disucikan masyarakat Bugis-Makassar, gunung ini menjadi pendakian paling ramai di Sulawesi Selatan dengan jalur klasik dari Lembanna Malino.',
    elevation: 2840,
    province: PROVINCE.sulsel,
    city: CITY.gowa,
    latitude: -5.31694,
    longitude: 119.94444,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Mekongga',
    description:
      'Gunung Mekongga adalah puncak tertinggi di Sulawesi Tenggara, dengan ketinggian 2.650 meter di atas permukaan laut. Terletak di Kabupaten Kolaka Utara, gunung non-vulkanik ini berhutan primer dan menjadi habitat anoa serta burung endemik Wallacea.',
    elevation: 2650,
    province: PROVINCE.sultra,
    city: CITY.kolakaUtara,
    latitude: -3.6644,
    longitude: 121.23673,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sesean',
    description:
      'Gunung Sesean, atau Buntu Sesean, adalah puncak tertinggi di Toraja Utara, Sulawesi Selatan, dengan ketinggian 2.100 meter di atas permukaan laut. Dari Batutumonga pendakiannya relatif singkat dan menyuguhkan hamparan perbukitan, sawah, dan Rantepao di kaki budaya Toraja.',
    elevation: 2100,
    province: PROVINCE.sulsel,
    city: CITY.torajaUtara,
    latitude: -2.82419,
    longitude: 119.85639,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Klabat',
    description:
      'Gunung Klabat adalah gunung berapi tidak aktif tertinggi di Sulawesi Utara, dengan ketinggian 1.995 meter di atas permukaan laut. Terletak di Kabupaten Minahasa Utara, kerucut simetris ini menjadi pendakian populer dekat Manado dengan kawah di puncak dan pemandangan Teluk Manado.',
    elevation: 1995,
    province: PROVINCE.sulut,
    city: CITY.minahasaUtara,
    latitude: 1.45334,
    longitude: 125.03126,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Karangetang',
    description:
      'Gunung Karangetang adalah gunung berapi aktif di Pulau Siau, Kabupaten Kepulauan Siau Tagulandang Biaro, dengan ketinggian 1.827 meter di atas permukaan laut. Termasuk yang paling aktif di Indonesia, status saat ini Waspada; aktivitas di sekitar kawah dan pendakian ditutup.',
    elevation: 1827,
    province: PROVINCE.sulut,
    city: CITY.sitaro,
    latitude: 2.77553,
    longitude: 125.40621,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Soputan',
    description:
      'Gunung Soputan adalah gunung berapi aktif di Kabupaten Minahasa Tenggara, Sulawesi Utara, dengan ketinggian 1.809 meter di atas permukaan laut. Stratovolcano di tepi Danau Tondano ini saat ini berstatus Waspada; pendakian ke kawasan puncak ditutup mengikuti rekomendasi PVMBG.',
    elevation: 1809,
    province: PROVINCE.sulut,
    city: CITY.minahasaTenggara,
    latitude: 1.11252,
    longitude: 124.73499,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Ambang',
    description:
      'Gunung Ambang adalah gunung berapi aktif di Kabupaten Bolaang Mongondow, Sulawesi Utara, dengan ketinggian 1.795 meter di atas permukaan laut. Dipantau pada tingkat Normal, kompleks kawah dan danau di puncaknya menjadi tujuan pendakian di kawasan cagar alam Ambang.',
    elevation: 1795,
    province: PROVINCE.sulut,
    city: CITY.bolaangMongondow,
    latitude: 0.75713,
    longitude: 124.41595,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Lokon',
    description:
      'Gunung Lokon adalah gunung berapi aktif di Kota Tomohon, Sulawesi Utara, dengan ketinggian 1.580 meter di atas permukaan laut. Kawahnya berada di sisi gunung, bukan di puncak; status saat ini Waspada sehingga pendakian ke kawasan kawah ditutup.',
    elevation: 1580,
    province: PROVINCE.sulut,
    city: CITY.tomohon,
    latitude: 1.358,
    longitude: 124.792,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Bulusaraung',
    description:
      'Gunung Bulusaraung adalah puncak tertinggi ekosistem karst Taman Nasional Bantimurung Bulusaraung, dengan ketinggian 1.353 meter di atas permukaan laut. Terletak di Kabupaten Pangkajene dan Kepulauan, tebing kapur dan puncak andesitnya menjadi destinasi sunrise populer di Sulawesi Selatan.',
    elevation: 1353,
    province: PROVINCE.sulsel,
    city: CITY.pangkep,
    latitude: -4.95222,
    longitude: 119.715,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Awu',
    description:
      'Gunung Awu adalah gunung berapi aktif di Pulau Sangihe, Kabupaten Kepulauan Sangihe, dengan ketinggian 1.320 meter di atas permukaan laut. Kaldera di puncaknya pernah meletus dahsyat; status saat ini Waspada dan pendakian ke kawasan kawah ditutup.',
    elevation: 1320,
    province: PROVINCE.sulut,
    city: CITY.sangihe,
    latitude: 3.68832,
    longitude: 125.44768,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Mahawu',
    description:
      'Gunung Mahawu adalah gunung berapi aktif di Kota Tomohon, Sulawesi Utara, dengan ketinggian 1.324 meter di atas permukaan laut. Kawah belerang di puncaknya dapat dicapai lewat tangga wisata dan dipantau pada tingkat Normal, menjadikannya salah satu gunung api paling mudah dikunjungi di Minahasa.',
    elevation: 1324,
    province: PROVINCE.sulut,
    city: CITY.tomohon,
    latitude: 1.36,
    longitude: 124.86,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Tangkoko',
    description:
      'Gunung Tangkoko adalah gunung berapi aktif di Kota Bitung, Sulawesi Utara, dengan ketinggian 1.149 meter di atas permukaan laut. Berada di Taman Nasional Tangkoko Batuangus, habitat tarsius dan maleo, statusnya Normal dan jalur hutan menuju puncak dibuka dengan pemandu taman nasional.',
    elevation: 1149,
    province: PROVINCE.sulut,
    city: CITY.bitung,
    latitude: 1.52,
    longitude: 125.2,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Ruang',
    description:
      'Gunung Ruang adalah gunung berapi aktif di Pulau Ruang, Kabupaten Kepulauan Siau Tagulandang Biaro, dengan ketinggian 725 meter di atas permukaan laut. Letusan April 2024 menghancurkan permukiman di Tagulandang; meski statusnya kembali Normal, pendakian dan aktivitas di pulau masih ditutup untuk pemulihan.',
    elevation: 725,
    province: PROVINCE.sulut,
    city: CITY.sitaro,
    latitude: 2.28,
    longitude: 125.43,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Colo',
    description:
      'Gunung Colo adalah gunung berapi aktif di Pulau Una-Una, Kabupaten Tojo Una-Una, Sulawesi Tengah, dengan ketinggian 507 meter di atas permukaan laut. Letusan 1983 mengevakuasi seluruh pulau; kini statusnya Normal dan pulau yang hampir tak berpenghuni ini jarang didaki.',
    elevation: 507,
    province: PROVINCE.sulteng,
    city: CITY.tojoUnaUna,
    latitude: -0.17,
    longitude: 121.61,
    type: 'volcano',
    status: 'active',
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
