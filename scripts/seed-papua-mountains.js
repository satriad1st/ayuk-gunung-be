/**
 * Seed notable Papua mountains into local MongoDB.
 * MAGMA does not monitor Papua volcanoes; all entries are non-volcanic.
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
  papua: new ObjectId('6a7ff6ada2e8ecd3b9393b01'),
  papuaBarat: new ObjectId('6a7ff6ada2e8ecd3b9393b02'),
  papuaTengah: new ObjectId('6a7ff6ada2e8ecd3b9393b04'),
  papuaPegunungan: new ObjectId('6a7ff6ada2e8ecd3b9393b05'),
};

const CITY = {
  jayapura: new ObjectId('6a7ff6ada2e8ecd3b9393cdf'),
  arfak: new ObjectId('6a7ff6ada2e8ecd3b9393cee'),
  mimika: new ObjectId('6a7ff6ada2e8ecd3b9393cf6'),
  jayawijaya: new ObjectId('6a7ff6ada2e8ecd3b9393cfb'),
  pegununganBintang: new ObjectId('6a7ff6ada2e8ecd3b9393cfc'),
};

const mountains = [
  {
    name: 'Puncak Jaya',
    description:
      'Puncak Jaya, atau Carstensz Pyramid / Nemangkawi, adalah gunung tertinggi di Indonesia dan Oseania, dengan ketinggian 4.884 meter di atas permukaan laut. Terletak di Kabupaten Mimika, Papua Tengah, di dalam Taman Nasional Lorentz, puncak kapur ini masih menyimpan sisa gletser tropis dan didaki lewat operator resmi dengan SIMAKSI.',
    elevation: 4884,
    province: PROVINCE.papuaTengah,
    city: CITY.mimika,
    latitude: -4.0789,
    longitude: 137.1595,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Puncak Mandala',
    description:
      'Puncak Mandala adalah puncak tertinggi kedua di Indonesia, dengan ketinggian 4.760 meter di atas permukaan laut. Terletak di Kabupaten Pegunungan Bintang, Papua Pegunungan, gunung kapur di Pegunungan Bintang ini sangat terpencil; tudung esnya telah mencair dan ekspedisi ke puncak jarang dilakukan.',
    elevation: 4760,
    province: PROVINCE.papuaPegunungan,
    city: CITY.pegununganBintang,
    latitude: -4.7087,
    longitude: 140.2894,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Puncak Trikora',
    description:
      'Puncak Trikora adalah salah satu dari tiga puncak tertinggi Papua, dengan ketinggian 4.750 meter di atas permukaan laut. Terletak di Kabupaten Jayawijaya, Papua Pegunungan, gunung ini paling mudah diakses dari Wamena melalui Danau Habbema; gletsernya sudah hilang dan puncak sejati memerlukan teknik panjat tebing.',
    elevation: 4750,
    province: PROVINCE.papuaPegunungan,
    city: CITY.jayawijaya,
    latitude: -4.2618,
    longitude: 138.6817,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Ngga Pilimsit',
    description:
      'Ngga Pilimsit, atau Puncak Idenburg, adalah gunung di Barisan Sudirman, Papua Tengah, dengan ketinggian 4.717 meter di atas permukaan laut. Terletak sekitar 21 kilometer barat laut Puncak Jaya di Kabupaten Mimika, cirque gletsernya sudah lenyap pada awal 1990-an.',
    elevation: 4717,
    province: PROVINCE.papuaTengah,
    city: CITY.mimika,
    latitude: -4.03556,
    longitude: 137.05917,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Puncak Yamin',
    description:
      'Puncak Yamin adalah gunung kapur di Pegunungan Jayawijaya, dengan ketinggian 4.540 meter di atas permukaan laut. Terletak di Kabupaten Pegunungan Bintang, Papua Pegunungan, salju abadi yang pernah dilaporkan pada 1913 telah hilang; puncaknya baru didaki pada 2018.',
    elevation: 4540,
    province: PROVINCE.papuaPegunungan,
    city: CITY.pegununganBintang,
    latitude: -4.68306,
    longitude: 140.08111,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Arfak',
    description:
      'Gunung Arfak adalah puncak tertinggi di Papua Barat, dengan ketinggian 2.955 meter di atas permukaan laut. Terletak di Kabupaten Pegunungan Arfak, gunung non-vulkanik ini menjadi habitat cenderawasih dan burung namdur; jalur dari Mokwam menawarkan pemandangan Manokwari dan Danau Anggi.',
    elevation: 2955,
    province: PROVINCE.papuaBarat,
    city: CITY.arfak,
    latitude: -1.1563,
    longitude: 133.9796,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Dafonsoro',
    description:
      'Gunung Dafonsoro, puncak Pegunungan Cycloop, adalah jajaran pantai utara dekat Sentani, Kabupaten Jayapura, dengan ketinggian 2.034 meter di atas permukaan laut. Kawasan ini cagar alam dan sumber air Jayapura; pendakian wisata massal tidak dibuka demi konservasi dan mitigasi longsor.',
    elevation: 2034,
    province: PROVINCE.papua,
    city: CITY.jayapura,
    latitude: -2.5067,
    longitude: 140.5255,
    type: 'non_volcano',
    status: 'inactive',
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
