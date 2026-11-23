import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [first, food, research, places, review] = await Promise.all([
  read('plans/hangzhou-first.md'),
  read('notes/do-an-theo-diem-01-2027.md'), read('notes/deep-search-thuong-hai-tu-tuc-01-2027.md'),
  read('public/js/hangzhou-data.js'), read('notes/ra-soat-lich-trinh-01-2027.md'),
]);

function sections(markdown, level) {
  return markdown.replaceAll('\r', '').split(new RegExp(`^${level} `, 'm')).slice(1).map((section) => {
    const end = section.indexOf('\n');
    return { title: section.slice(0, end), body: section.slice(end).trim().replace(/\n---$/, '').trim() };
  });
}

function plan(markdown) {
  const main = sections(markdown, '##');
  const section = (pattern) => main.find(({ title }) => pattern.test(title)).body;
  return {
    days: main.filter(({ title }) => /^NGÀY /.test(title)),
    stay: section(/^3 khách sạn/),
    food: section(/^Ăn gì/),
    budget: section(/^Tiền nong/),
    checklist: section(/^Checklist/).split('\n').filter((line) => /^- \[ \]/.test(line)).map((line) => line.slice(6)),
  };
}

const context = { window: {} };
vm.runInNewContext(places, context, { timeout: 1000 });
const locationPhotos = new Set(['pvg', 'qinghefang', 'wuzhen_xizha', 'bund', 'lujiazui', 'disney', 'wukang', 'xintiandi']);
const verifiedPhotos = {
  hongqiao_station: 'img/trip-hongqiao.jpg',
  hz_east: 'img/trip-hangzhou-east.jpg',
  tongxiang: 'img/trip-tongxiang.jpg',
  duanqiao: 'img/trip-duanqiao.jpg',
  leifeng: 'img/trip-leifeng.jpg',
  tianzifang: 'img/trip-tianzifang.jpg',
  yuyuan: 'img/trip-yuyuan-night.jpg',
};
const westLakeArea = ['img/sight-westlake.jpg', 'Hồ Tây · ảnh minh họa khu vực Hàng Châu'];
const wuzhenArea = ['img/sight-wuzhen.jpg', 'Kênh Tây Sách · ảnh minh họa khu vực'];
const shanghaiArea = ['img/sight-bund.jpg', 'Bến Thượng Hải · ảnh minh họa khu vực'];
const chageeBrand = ['img/trip-chagee.jpg', 'CHAGEE · ảnh chi nhánh Trường Sa'];
const contextualPhotos = {
  homeinn_hz: westLakeArea,
  wuzhen_visitor: wuzhenArea,
  homeinn_sh: shanghaiArea,
  hongqiao_hub: ['img/trip-hongqiao.jpg', 'Ga Hồng Kiều nhìn từ phía tây · ảnh khu đầu mối'],
  hz_chengzhan_bus: ['img/sight-qinghefang.jpg', 'Thanh Hà Phường · ảnh khu vực trung tâm Hàng Châu'],
  hz_east_bus: ['img/trip-hangzhou-east.jpg', 'Sảnh ga Hàng Châu Đông · ảnh khu vực'],
  wuzhen_p1: wuzhenArea,
  sh_south: ['img/sight-lujiazui.jpg', 'Toàn cảnh Thượng Hải · ảnh minh họa thành phố'],
  liulang: ['img/trip-liulang.jpg', 'Bờ Hồ Tây · ảnh khu vực Liễu Lãng Văn Oanh'],
  tea_street: ['img/trip-longjing.jpg', 'Trà Long Tỉnh · ảnh minh họa'],
  dujinsheng: westLakeArea,
  chagee_hubin: chageeBrand,
  shusheng: wuzhenArea,
  qiaoliqiao_tea: wuzhenArea,
  luckin_bund: ['img/trip-luckin.jpg', 'Luckin Coffee · ảnh chi nhánh Raffles City Trường Ninh'],
  chagee_nanjing: chageeBrand,
  hanxiang: ['img/sight-wukang.jpg', 'Tòa Vũ Khang · ảnh minh họa khu vực'],
  linlee_yuyuan: ['img/trip-linlee.jpg', 'Đồ uống LINLEE · ảnh minh họa sản phẩm'],
  chagee_pvg: chageeBrand,
};
const mealPhotos = {
  waipojia: ['img/food-waipojia.jpg', 'Thịt Đông Pha'],
  xinzhouji: ['img/food-xinzhouji.jpg', 'Mâm món Hàng Châu'],
  greentea: ['img/food-greentea.jpg', 'Gà quay'],
  yuxingji: ['img/food-yuxingji.jpg', 'Mì cua'],
  shengjian: ['img/trip-shengjian.jpg', 'Bánh sinh tiễn'],
  butterful: ['img/trip-coffee-croissant.jpg', 'Bánh sừng bò'],
  manner_dingan: ['img/trip-coffee-croissant.jpg', 'Cà phê và bánh'],
  sanbao: ['img/food-sanbao.jpg', 'Mì cua'],
  dachafan: ['img/trip-roast-duck.jpg', 'Vịt quay'],
  fuxiaoguan: ['img/food-fuxiaoguan.jpg', 'Xiên nướng'],
};
const dayPhotos = [
  'img/transit-pvg.jpg', 'img/sight-westlake.jpg', 'img/trip-longjing.jpg', 'img/sight-wuzhen.jpg',
  'img/sight-bund.jpg', 'img/sight-disney.jpg', 'img/trip-yuyuan-night.jpg',
];
const photos = {
  days: dayPhotos,
  food: {
    A: { path: 'img/food-waipojia.jpg', caption: 'Thịt Đông Pha · ảnh minh họa món ăn' },
    B: { path: 'img/sight-wuzhen.jpg', caption: 'Kênh và phố cổ Ô Trấn' },
    C: { path: 'img/trip-shengjian.jpg', caption: 'Bánh sinh tiễn · ảnh minh họa món ăn' },
  },
};
const pins = Object.entries(context.window.PINS).map(([id, { img, ...pin }]) => {
  if (locationPhotos.has(id)) return { ...pin, img };
  if (verifiedPhotos[id]) return { ...pin, img: verifiedPhotos[id] };
  if (contextualPhotos[id]) {
    const [path, photoCaption] = contextualPhotos[id];
    return { ...pin, img: path, photoCaption };
  }
  if (mealPhotos[id]) {
    const [path, dish] = mealPhotos[id];
    return { ...pin, img: path, photoCaption: dish + ' · ảnh minh họa món ăn' };
  }
  return pin;
});
const data = {
  plan: plan(first),
  pins,
  photos,
  food: sections(food, '##'),
  review: sections(review, '##').map(({ title, body }) => '### ' + title + '\n\n' + body).join('\n\n'),
  tips: sections(research, '##').filter(({ title }) => /^(1|3|4|5|7|9|13)\./.test(title)),
};
const json = JSON.stringify(data, null, 2) + '\n';
const worker = await read('public/trip/sw.js');
const workerPattern = /const cacheName = prefix \+ '[^']+';/;
const shellFiles = ['index.html', 'trip.css', 'trip.js', 'trip-map.js', 'leaflet.js', 'leaflet.css', 'manifest.webmanifest'].map((path) => 'public/trip/' + path);
const images = [...new Set([
  ...photos.days,
  ...Object.values(photos.food).map(({ path }) => path),
  ...pins.map(({ img }) => img).filter(Boolean),
])];
const assets = [...shellFiles, ...images.map((path) => 'public/' + path),
  'public/trip/fonts/InterVariable.woff2', 'public/trip/fonts/InterVariable-Italic.woff2',
  ...['icon-192.png', 'icon-512.png', 'apple-touch-icon.png'].map((path) => 'public/icons/' + path)];
const hash = createHash('sha256').update(json).update(worker.replace(workerPattern, ''));
for (const asset of assets) hash.update(await readFile(new URL('../' + asset, import.meta.url)));
const revision = hash.digest('hex').slice(0, 16);
const redirect = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=./trip/">
  <link rel="canonical" href="./trip/">
  <title>Giang Nam · Sổ tay chuyến đi</title>
</head>
<body>
  <p><a href="./trip/">Mở sổ tay chuyến đi Giang Nam</a></p>
</body>
</html>
`;
await Promise.all([
  writeFile(new URL('../public/trip/data.json', import.meta.url), json),
  writeFile(new URL('../public/trip/sw.js', import.meta.url), worker.replace(workerPattern, "const cacheName = prefix + '" + revision + "';")),
  ...['index.html', 'shanghai-plan.html', 'shanghai-plan-2.html'].map((file) =>
    writeFile(new URL('../public/' + file, import.meta.url), redirect)),
]);
