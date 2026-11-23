import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "img");
const UA = "ShanghaiTripPlan/1.0 (personal itinerary)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function commonsThumb(title, width = 1400) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query",
    titles: title.startsWith("File:") ? title : `File:${title}`,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: String(width),
    format: "json",
  });
  await sleep(2000);
  const j = await fetch(u, { headers: { "User-Agent": UA } }).then((r) => r.json());
  const p = Object.values(j.query.pages)[0];
  return p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url || null;
}

async function save(url, dest) {
  await sleep(1500);
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/*" } });
  if (!res.ok) throw new Error(`${res.status} ${dest}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("image") && !url.includes(".jpg") && !url.includes(".jpeg") && !url.includes(".png")) {
    throw new Error(`not image: ${ct} ${dest}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.slice(0, 4).toString() === "%PDF") throw new Error(`pdf saved as ${dest}`);
  fs.writeFileSync(path.join(out, dest), buf);
  console.log("ok", dest, buf.length, url.slice(0, 80));
}

const jobs = [
  ["Dongpo pork (a Hangzhou dish).jpg", "food-xinzhouji.jpg"],
  ["Xiaolongbao Shanghai.jpg", "food-sanbao.jpg"],
  ["Chinese mitten crab.jpg", "food-yuxingji.jpg"],
  ["Hongshao rou.jpg", "food-waipojia.jpg"],
  ["Feilaifeng Maitreya.JPG", "sight-lingyin.jpg"],
  ["Longjing tea shrimp.jpg", "food-greentea.jpg"],
];

for (const [title, dest] of jobs) {
  try {
    const url = await commonsThumb(title);
    if (!url) {
      console.log("miss", title);
      continue;
    }
    await save(url, dest);
  } catch (e) {
    console.log("ERR", dest, e.message);
  }
}

// Unsplash fallbacks (stable photo ids) if Commons failed
const unsplash = [
  ["food-greentea.jpg", "https://images.unsplash.com/photo-1525755662778-989d0524087d?auto=format&fit=crop&w=1200&q=80"], // chinese dishes
  ["food-waipojia.jpg", "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80"], // chinese braised-ish
  ["food-fuxiaoguan.jpg", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80"], // grill skewers
];
for (const [dest, url] of unsplash) {
  const p = path.join(out, dest);
  if (fs.existsSync(p) && fs.statSync(p).size > 20000) {
    // keep commons if good; still refresh greentea/waipo if missing lingyin-related
  }
  try {
    if (!fs.existsSync(p) || fs.statSync(p).size < 20000 || dest === "food-greentea.jpg" || dest === "food-waipojia.jpg") {
      await save(url, dest);
    }
  } catch (e) {
    console.log("unsplash ERR", dest, e.message);
  }
}
