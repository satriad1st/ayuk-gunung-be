/**
 * Seed notable Java mountains into local MongoDB.
 * Status follows MAGMA Indonesia as of 21 Aug 2026.
 * Skips Semeru and Ciremai if already present. Images omitted.
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
  jabar: new ObjectId('6a7ff6ada2e8ecd3b9393aec'),
  jateng: new ObjectId('6a7ff6ada2e8ecd3b9393aed'),
  diy: new ObjectId('6a7ff6ada2e8ecd3b9393aee'),
  jatim: new ObjectId('6a7ff6ada2e8ecd3b9393aef'),
  banten: new ObjectId('6a7ff6ada2e8ecd3b9393af0'),
};

const CITY = {
  pandeglang: new ObjectId('6a7ff6ada2e8ecd3b9393c10'),
  bogor: new ObjectId('6a7ff6ada2e8ecd3b9393ba7'),
  cianjur: new ObjectId('6a7ff6ada2e8ecd3b9393ba9'),
  garut: new ObjectId('6a7ff6ada2e8ecd3b9393bab'),
  bandung: new ObjectId('6a7ff6ada2e8ecd3b9393baa'),
  bandungBarat: new ObjectId('6a7ff6ada2e8ecd3b9393bb7'),
  tasikmalaya: new ObjectId('6a7ff6ada2e8ecd3b9393bac'),
  sumedang: new ObjectId('6a7ff6ada2e8ecd3b9393bb1'),
  purbalingga: new ObjectId('6a7ff6ada2e8ecd3b9393bc4'),
  magelang: new ObjectId('6a7ff6ada2e8ecd3b9393bc9'),
  karanganyar: new ObjectId('6a7ff6ada2e8ecd3b9393bce'),
  wonosobo: new ObjectId('6a7ff6ada2e8ecd3b9393bc8'),
  semarang: new ObjectId('6a7ff6ada2e8ecd3b9393bd7'),
  kudus: new ObjectId('6a7ff6ada2e8ecd3b9393bd4'),
  sleman: new ObjectId('6a7ff6ada2e8ecd3b9393be8'),
  malang: new ObjectId('6a7ff6ada2e8ecd3b9393bf0'),
  banyuwangi: new ObjectId('6a7ff6ada2e8ecd3b9393bf3'),
  pasuruan: new ObjectId('6a7ff6ada2e8ecd3b9393bf7'),
  probolinggo: new ObjectId('6a7ff6ada2e8ecd3b9393bf6'),
  nganjuk: new ObjectId('6a7ff6ada2e8ecd3b9393bfb'),
  mojokerto: new ObjectId('6a7ff6ada2e8ecd3b9393bf9'),
  kediri: new ObjectId('6a7ff6ada2e8ecd3b9393bef'),
  lumajang: new ObjectId('6a7ff6ada2e8ecd3b9393bf1'),
  batu: new ObjectId('6a7ff6ada2e8ecd3b9393c0f'),
};

const mountains = [
  {
    name: 'Gunung Karang',
    description:
      'Gunung Karang adalah gunung berapi tidak aktif tertinggi di Banten, dengan ketinggian 1.778 meter di atas permukaan laut. Terletak di Kabupaten Pandeglang, stratovolcano berhutan lebat ini menjadi tujuan pendakian populer dekat Serang dengan pemandangan Selat Sunda dari puncaknya.',
    elevation: 1778,
    province: PROVINCE.banten,
    city: CITY.pandeglang,
    latitude: -6.26861,
    longitude: 106.04911,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Pulosari',
    description:
      'Gunung Pulosari adalah gunung berapi tidak aktif di Kabupaten Pandeglang, Banten, dengan ketinggian 1.346 meter di atas permukaan laut. Kaldera berhutan ini memiliki kawah dan situs suci masyarakat setempat, serta jalur pendakian yang relatif singkat dari kaki gunung di selatan Banten.',
    elevation: 1346,
    province: PROVINCE.banten,
    city: CITY.pandeglang,
    latitude: -6.343,
    longitude: 105.978,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Pangrango',
    description:
      'Gunung Pangrango adalah gunung berapi tidak aktif di Kabupaten Bogor, Jawa Barat, dengan ketinggian 3.019 meter di atas permukaan laut. Berdiri berpasangan dengan Gunung Gede di Taman Nasional Gede Pangrango, Puncak Mandalawangi terkenal dengan padang edelweis dan hutan tropis yang masih utuh.',
    elevation: 3019,
    province: PROVINCE.jabar,
    city: CITY.bogor,
    latitude: -6.77006,
    longitude: 106.96498,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Gede',
    description:
      'Gunung Gede adalah gunung berapi aktif di Kabupaten Cianjur, Jawa Barat, dengan ketinggian 2.958 meter di atas permukaan laut. Stratovolcano ini berada di Taman Nasional Gede Pangrango dan dipantau pada tingkat aktivitas Normal; kawah puncaknya dan pemandangan ke Pangrango menjadikannya salah satu pendakian paling ramai di Jawa.',
    elevation: 2958,
    province: PROVINCE.jabar,
    city: CITY.cianjur,
    latitude: -6.78,
    longitude: 106.98,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Cikuray',
    description:
      'Gunung Cikuray adalah gunung berapi tidak aktif tertinggi di Kabupaten Garut, Jawa Barat, dengan ketinggian 2.821 meter di atas permukaan laut. Puncaknya yang terbuka menawarkan pemandangan luas ke Papandayan, Guntur, dan dataran Garut, serta menjadi salah satu jalur pendakian klasik Priangan.',
    elevation: 2821,
    province: PROVINCE.jabar,
    city: CITY.garut,
    latitude: -7.32258,
    longitude: 107.85995,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Papandayan',
    description:
      'Gunung Papandayan adalah gunung berapi aktif di Kabupaten Garut, Jawa Barat, dengan ketinggian 2.665 meter di atas permukaan laut. Stratovolcano ini terkenal karena kawah belerang, hutan mati, dan padang edelweis Pondok Saladah, serta dipantau pada tingkat aktivitas Normal sehingga pendakian kawah masih dibuka.',
    elevation: 2665,
    province: PROVINCE.jabar,
    city: CITY.garut,
    latitude: -7.32,
    longitude: 107.73,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Patuha',
    description:
      'Gunung Patuha adalah gunung berapi tidak aktif di Kabupaten Bandung, Jawa Barat, dengan ketinggian 2.434 meter di atas permukaan laut. Kawah Putih di lerengnya menjadi destinasi wisata terkenal, sementara puncak sejati di atas kawah menawarkan jalur hutan dan pemandangan danau kawah berwarna toska.',
    elevation: 2434,
    province: PROVINCE.jabar,
    city: CITY.bandung,
    latitude: -7.16,
    longitude: 107.402,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Malabar',
    description:
      'Gunung Malabar adalah gunung berapi tidak aktif di Kabupaten Bandung, Jawa Barat, dengan ketinggian 2.321 meter di atas permukaan laut. Dikenal karena stasiun radio sejarah peninggalan Belanda di puncaknya, gunung ini menawarkan jalur hutan pinus dan pemandangan cekungan Bandung dari punggung Priangan.',
    elevation: 2321,
    province: PROVINCE.jabar,
    city: CITY.bandung,
    latitude: -7.136,
    longitude: 107.637,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Guntur',
    description:
      'Gunung Guntur adalah gunung berapi aktif di Kabupaten Garut, Jawa Barat, dengan ketinggian 2.249 meter di atas permukaan laut. Stratovolcano ini pernah menjadi salah satu yang paling aktif di Jawa pada abad ke-19 dan kini dipantau pada tingkat Normal, dengan jalur pendakian berbatu menuju kawah di puncaknya.',
    elevation: 2249,
    province: PROVINCE.jabar,
    city: CITY.garut,
    latitude: -7.13,
    longitude: 107.83,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Salak',
    description:
      'Gunung Salak adalah gunung berapi aktif di Kabupaten Bogor, Jawa Barat, dengan ketinggian 2.211 meter di atas permukaan laut. Berada di Taman Nasional Gunung Halimun Salak dan dipantau pada tingkat Normal, jalur pendakiannya dibuka kembali pada Juli 2026 dengan kuota terbatas melalui reservasi daring.',
    elevation: 2211,
    province: PROVINCE.jabar,
    city: CITY.bogor,
    latitude: -6.71606,
    longitude: 106.73357,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Galunggung',
    description:
      'Gunung Galunggung adalah gunung berapi aktif di Kabupaten Tasikmalaya, Jawa Barat, dengan ketinggian 2.168 meter di atas permukaan laut. Letusan 1982 terkenal mengganggu penerbangan internasional; kini statusnya Normal, dan kawah serta danau di puncaknya menjadi tujuan wisata alam Tasikmalaya.',
    elevation: 2168,
    province: PROVINCE.jabar,
    city: CITY.tasikmalaya,
    latitude: -7.25,
    longitude: 108.05,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Tangkuban Parahu',
    description:
      'Gunung Tangkuban Parahu adalah gunung berapi aktif di Kabupaten Bandung Barat, Jawa Barat, dengan ketinggian 2.084 meter di atas permukaan laut. Namanya merujuk pada perahu terbalik dalam legenda Sangkuriang; kawah Ratu dapat diakses dengan kendaraan dan dipantau pada tingkat aktivitas Normal.',
    elevation: 2084,
    province: PROVINCE.jabar,
    city: CITY.bandungBarat,
    latitude: -6.77,
    longitude: 107.6,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Burangrang',
    description:
      'Gunung Burangrang adalah gunung berapi tidak aktif di Kabupaten Bandung Barat, Jawa Barat, dengan ketinggian 2.064 meter di atas permukaan laut. Berdiri di sebelah Tangkuban Parahu, puncaknya menjadi tujuan pendakian sehari dengan pemandangan cekungan Bandung dan jajaran gunung Priangan.',
    elevation: 2064,
    province: PROVINCE.jabar,
    city: CITY.bandungBarat,
    latitude: -6.763,
    longitude: 107.583,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Tampomas',
    description:
      'Gunung Tampomas adalah gunung berapi tidak aktif di Kabupaten Sumedang, Jawa Barat, dengan ketinggian 1.684 meter di atas permukaan laut. Stratovolcano terisolasi ini menjadi ikon Sumedang dan tujuan pendakian populer dengan savana serta pemandangan ke arah Ciremai dan dataran Majalengka.',
    elevation: 1684,
    province: PROVINCE.jabar,
    city: CITY.sumedang,
    latitude: -6.76373,
    longitude: 107.96058,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Slamet',
    description:
      'Gunung Slamet adalah gunung tertinggi di Jawa Tengah dan tertinggi kedua di Pulau Jawa, dengan ketinggian 3.428 meter di atas permukaan laut. Terletak di Kabupaten Purbalingga, stratovolcano ini saat ini berstatus Waspada; pendakian dibuka terbatas hingga Pos 9 Pelawangan dan tidak sampai ke puncak kawah.',
    elevation: 3428,
    province: PROVINCE.jateng,
    city: CITY.purbalingga,
    latitude: -7.23907,
    longitude: 109.21994,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sumbing',
    description:
      'Gunung Sumbing adalah gunung berapi aktif di Kabupaten Magelang, Jawa Tengah, dengan ketinggian 3.371 meter di atas permukaan laut pada Puncak Rajawali. Berdiri berhadapan dengan Sindoro, stratovolcano ini dipantau pada tingkat Normal dan terkenal karena sabana luas serta matahari terbit dari puncaknya.',
    elevation: 3371,
    province: PROVINCE.jateng,
    city: CITY.magelang,
    latitude: -7.38343,
    longitude: 110.07121,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Lawu',
    description:
      'Gunung Lawu adalah gunung berapi tidak aktif di perbatasan Jawa Tengah dan Jawa Timur, dengan ketinggian 3.265 meter di atas permukaan laut. Terletak di Kabupaten Karanganyar, puncak Hargo Dumilah sangat disucikan dalam tradisi Jawa dan menjadi salah satu jalur pendakian paling ramai di Jawa.',
    elevation: 3265,
    province: PROVINCE.jateng,
    city: CITY.karanganyar,
    latitude: -7.62726,
    longitude: 111.19464,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Sindoro',
    description:
      'Gunung Sindoro, juga ditulis Sundoro, adalah gunung berapi aktif di Kabupaten Wonosobo, Jawa Tengah, dengan ketinggian 3.136 meter di atas permukaan laut. Kembar Sumbing ini dipantau pada tingkat Normal dan menawarkan jalur savana khas Dieng dengan pemandangan ke Prau, Sumbing, dan Slamet.',
    elevation: 3136,
    province: PROVINCE.jateng,
    city: CITY.wonosobo,
    latitude: -7.3,
    longitude: 109.99,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Merbabu',
    description:
      'Gunung Merbabu adalah gunung berapi tidak aktif di Kabupaten Magelang, Jawa Tengah, dengan ketinggian 3.145 meter di atas permukaan laut pada Puncak Triangulasi. Berdiri di sebelah utara Merapi, gunung ini terkenal karena padang savana dan menjadi salah satu pendakian favorit di Jawa Tengah.',
    elevation: 3145,
    province: PROVINCE.jateng,
    city: CITY.magelang,
    latitude: -7.45422,
    longitude: 110.43968,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Prau',
    description:
      'Gunung Prau adalah puncak tertinggi kawasan Dataran Tinggi Dieng, Kabupaten Wonosobo, Jawa Tengah, dengan ketinggian 2.565 meter di atas permukaan laut. Termasuk kompleks vulkanik Dieng yang berstatus Normal, puncaknya terkenal karena lautan awan dan menjadi salah satu pendakian paling ramai di Jawa.',
    elevation: 2565,
    province: PROVINCE.jateng,
    city: CITY.wonosobo,
    latitude: -7.2,
    longitude: 109.92,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Ungaran',
    description:
      'Gunung Ungaran adalah gunung berapi tidak aktif di Kabupaten Semarang, Jawa Tengah, dengan ketinggian 2.050 meter di atas permukaan laut. Puncak Botak dan Gedong Songo di lerengnya menjadi destinasi dekat Kota Semarang, dengan candi Hindu dan sumber air panas di kaki gunung.',
    elevation: 2050,
    province: PROVINCE.jateng,
    city: CITY.semarang,
    latitude: -7.18724,
    longitude: 110.3445,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Telomoyo',
    description:
      'Gunung Telomoyo adalah gunung berapi tidak aktif di Kabupaten Semarang, Jawa Tengah, dengan ketinggian 1.894 meter di atas permukaan laut. Jalur beraspal hampir sampai puncak membuatnya mudah diakses; dari atas terlihat Merapi, Merbabu, Andong, dan Danau Rawa Pening.',
    elevation: 1894,
    province: PROVINCE.jateng,
    city: CITY.semarang,
    latitude: -7.362,
    longitude: 110.398,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Andong',
    description:
      'Gunung Andong adalah gunung non-vulkanik di Kabupaten Magelang, Jawa Tengah, dengan ketinggian 1.726 meter di atas permukaan laut. Puncaknya yang landai dan savana pendek menjadikannya tujuan pendakian pemula yang populer, dengan pemandangan Merapi, Merbabu, dan Telomoyo.',
    elevation: 1726,
    province: PROVINCE.jateng,
    city: CITY.magelang,
    latitude: -7.392,
    longitude: 110.371,
    type: 'non_volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Muria',
    description:
      'Gunung Muria adalah gunung berapi tidak aktif di Kabupaten Kudus, Jawa Tengah, dengan ketinggian 1.610 meter di atas permukaan laut pada Puncak Songolikur. Lerengnya menyimpan Makam Sunan Muria di Desa Colo dan menjadi tujuan ziarah sekaligus pendakian di ujung utara Jawa Tengah.',
    elevation: 1610,
    province: PROVINCE.jateng,
    city: CITY.kudus,
    latitude: -6.61624,
    longitude: 110.89029,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Merapi',
    description:
      'Gunung Merapi adalah salah satu gunung berapi paling aktif di dunia, dengan ketinggian 2.930 meter di atas permukaan laut. Terletak di Kabupaten Sleman, Daerah Istimewa Yogyakarta, stratovolcano ini saat ini berstatus Siaga; pendakian ditutup mengikuti rekomendasi PVMBG dan Taman Nasional Gunung Merapi.',
    elevation: 2930,
    province: PROVINCE.diy,
    city: CITY.sleman,
    latitude: -7.53973,
    longitude: 110.44694,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'closed',
  },
  {
    name: 'Gunung Arjuno',
    description:
      'Gunung Arjuno adalah gunung berapi aktif di Kabupaten Malang, Jawa Timur, dengan ketinggian 3.339 meter di atas permukaan laut. Bersama Welirang ia membentuk kompleks Arjuno-Welirang yang dipantau pada tingkat Normal, dan menjadi salah satu dari Seven Summits Jawa di Taman Hutan Raya Raden Soerjo.',
    elevation: 3339,
    province: PROVINCE.jatim,
    city: CITY.malang,
    latitude: -7.76542,
    longitude: 112.59017,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Raung',
    description:
      'Gunung Raung adalah gunung berapi aktif di Kabupaten Banyuwangi, Jawa Timur, dengan ketinggian 3.332 meter di atas permukaan laut pada Puncak Sejati. Kaldera keringnya termasuk yang terbesar di Jawa; status saat ini Waspada, tetapi pendakian masih dibuka dengan larangan mendekati kawah dalam radius 3 kilometer.',
    elevation: 3332,
    province: PROVINCE.jatim,
    city: CITY.banyuwangi,
    latitude: -8.12558,
    longitude: 114.04666,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Welirang',
    description:
      'Gunung Welirang adalah gunung berapi aktif di Kabupaten Pasuruan, Jawa Timur, dengan ketinggian 3.156 meter di atas permukaan laut. Namanya berasal dari kata Jawa untuk belerang; kawah solfatara di puncaknya masih aktif dan dipantau bersama Arjuno pada tingkat Normal.',
    elevation: 3156,
    province: PROVINCE.jatim,
    city: CITY.pasuruan,
    latitude: -7.766,
    longitude: 112.573,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Argopuro',
    description:
      'Gunung Argopuro adalah gunung berapi tidak aktif di Kabupaten Probolinggo, Jawa Timur, dengan ketinggian 3.088 meter di atas permukaan laut. Memiliki salah satu jalur pendakian terpanjang di Jawa, sabana dan savana di sepanjang punggung Iyang-Argopuro menjadi daya tarik utama ekspedisi ini.',
    elevation: 3088,
    province: PROVINCE.jatim,
    city: CITY.probolinggo,
    latitude: -7.96436,
    longitude: 113.56641,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Butak',
    description:
      'Gunung Butak adalah gunung berapi tidak aktif di Kabupaten Malang, Jawa Timur, dengan ketinggian 2.868 meter di atas permukaan laut. Berdampingan dengan Kawi, puncaknya menawarkan pemandangan ke Arjuno-Welirang dan Bromo, serta menjadi pendakian menengah yang populer dari sisi Malang selatan.',
    elevation: 2868,
    province: PROVINCE.jatim,
    city: CITY.malang,
    latitude: -7.95525,
    longitude: 112.46513,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Ijen',
    description:
      'Gunung Ijen adalah gunung berapi aktif di Kabupaten Banyuwangi, Jawa Timur, dengan ketinggian 2.799 meter di atas permukaan laut. Kawah Ijen menyimpan danau asam berwarna toska dan api biru belerang yang terkenal di dunia; status saat ini Normal sehingga wisata kawah masih dibuka dengan pengaturan kuota.',
    elevation: 2799,
    province: PROVINCE.jatim,
    city: CITY.banyuwangi,
    latitude: -8.06,
    longitude: 114.24,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Wilis',
    description:
      'Gunung Wilis adalah gunung berapi tidak aktif di Kabupaten Nganjuk, Jawa Timur, dengan ketinggian 2.563 meter di atas permukaan laut pada Puncak Liman atau Trogati. Kompleks ini mencakup enam kabupaten dan menawarkan hutan yang masih sepi dibanding gunung-gunung Jawa yang lebih ramai.',
    elevation: 2563,
    province: PROVINCE.jatim,
    city: CITY.nganjuk,
    latitude: -7.8138,
    longitude: 111.7601,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kawi',
    description:
      'Gunung Kawi adalah gunung berapi tidak aktif di Kabupaten Malang, Jawa Timur, dengan ketinggian 2.551 meter di atas permukaan laut. Selain jalur pendakian, lerengnya dikenal sebagai kawasan spiritual dan petilasan, serta berpasangan dengan Gunung Butak di selatan Malang.',
    elevation: 2551,
    province: PROVINCE.jatim,
    city: CITY.malang,
    latitude: -7.92,
    longitude: 112.45,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Bromo',
    description:
      'Gunung Bromo adalah gunung berapi aktif di kaldera Tengger, Kabupaten Probolinggo, Jawa Timur, dengan ketinggian 2.329 meter di atas permukaan laut. Sangat disucikan oleh masyarakat Tengger, kawahnya menjadi destinasi matahari terbit paling terkenal di Indonesia; status saat ini Waspada, dan wisata dibuka kembali pada 20 Agustus 2026 setelah karhutla.',
    elevation: 2329,
    province: PROVINCE.jatim,
    city: CITY.probolinggo,
    latitude: -7.94,
    longitude: 112.95,
    type: 'volcano',
    status: 'alert',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Anjasmoro',
    description:
      'Gunung Anjasmoro adalah gunung berapi tidak aktif di Kabupaten Mojokerto, Jawa Timur, dengan ketinggian 2.277 meter di atas permukaan laut. Berada di kompleks Tahura Raden Soerjo bersama Arjuno-Welirang, puncaknya masih sepi dan dikelilingi hutan tropis yang lebat.',
    elevation: 2277,
    province: PROVINCE.jatim,
    city: CITY.mojokerto,
    latitude: -7.77,
    longitude: 112.533,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Panderman',
    description:
      'Gunung Panderman adalah gunung berapi tidak aktif di Kota Batu, Jawa Timur, dengan ketinggian 2.045 meter di atas permukaan laut. Menjadi destinasi pendakian dekat kota wisata Batu, dari puncaknya terlihat Arjuno, Welirang, dan hamparan Kota Malang.',
    elevation: 2045,
    province: PROVINCE.jatim,
    city: CITY.batu,
    latitude: -7.903,
    longitude: 112.507,
    type: 'volcano',
    status: 'inactive',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Kelud',
    description:
      'Gunung Kelud adalah gunung berapi aktif di Kabupaten Kediri, Jawa Timur, dengan ketinggian 1.731 meter di atas permukaan laut. Dikenal karena letusan eksplosif termasuk 2014, kawah dan danau puncaknya dipantau pada tingkat Normal dan menjadi destinasi wisata alam Kediri-Blitar.',
    elevation: 1731,
    province: PROVINCE.jatim,
    city: CITY.kediri,
    latitude: -7.93,
    longitude: 112.31,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Lamongan',
    description:
      'Gunung Lamongan adalah gunung berapi aktif di Kabupaten Lumajang, Jawa Timur, dengan ketinggian 1.651 meter di atas permukaan laut. Dikelilingi puluhan maar dan danau kawah, stratovolcano ini dipantau pada tingkat Normal dan jarang didaki dibanding Semeru di sebelahnya.',
    elevation: 1651,
    province: PROVINCE.jatim,
    city: CITY.lumajang,
    latitude: -7.97542,
    longitude: 113.3463,
    type: 'volcano',
    status: 'active',
    hikingStatus: 'open',
  },
  {
    name: 'Gunung Penanggungan',
    description:
      'Gunung Penanggungan adalah gunung berapi tidak aktif di Kabupaten Mojokerto, Jawa Timur, dengan ketinggian 1.653 meter di atas permukaan laut. Bentuknya yang simetris diyakini sebagai tiruan Gunung Mahameru; lerengnya penuh candi dan petilasan Majapahit sehingga sangat penting secara budaya.',
    elevation: 1653,
    province: PROVINCE.jatim,
    city: CITY.mojokerto,
    latitude: -7.61561,
    longitude: 112.61996,
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
