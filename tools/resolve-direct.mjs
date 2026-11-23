const UA = "ShanghaiTripPlan/1.0";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function direct(file) {
  await sleep(1800);
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query",
    titles: `File:${file}`,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1280",
    format: "json",
  });
  const j = await fetch(u, { headers: { "User-Agent": UA } }).then((r) => r.json());
  const info = Object.values(j.query.pages)[0].imageinfo?.[0];
  const url = (info?.thumburl || info?.url || "").split("?")[0];
  console.log(JSON.stringify({ file, url }));
}

for (const f of [
  "20090913 Wuzhen 5129.jpg",
  "The Bund Shanghai.jpg",
  "Lingyin Temple, Hangzhou 20161003.jpg",
  "Hefang Street, Hangzhou.jpg",
  "Yuyuan Garden 4.jpg",
  "Dongpo pork (a Hangzhou dish).jpg",
  "Xiaolongbao Shanghai.jpg",
  "Broken Bridge, Hangzhou, China.jpg",
]) {
  await direct(f);
}
