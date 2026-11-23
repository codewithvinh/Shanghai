const UA = "ShanghaiTripPlan/1.0 (resolve)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolve(title) {
  await sleep(2000);
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query",
    titles: title.startsWith("File:") ? title : `File:${title}`,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1280",
    format: "json",
  });
  const j = await fetch(u, { headers: { "User-Agent": UA } }).then((r) => r.json());
  const p = Object.values(j.query.pages)[0];
  const info = p.imageinfo?.[0];
  console.log(title, "->", info?.thumburl || info?.url || "MISS");
}

const titles = [
  "Broken Bridge, Hangzhou, China.jpg",
  "Wuzhen Zhen 15.jpg",
  "The Bund Shanghai.jpg",
  "Shanghai Bund by night.jpg",
  "Lingyin Temple Hangzhou.jpg",
  "Feilai Peak.jpg",
  "Yuyuan Garden Shanghai.jpg",
  "Dongpo pork (a Hangzhou dish).jpg",
  "Xiaolongbao Shanghai.jpg",
];
for (const t of titles) {
  try {
    await resolve(t);
  } catch (e) {
    console.log(t, e.message);
  }
}
