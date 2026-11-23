import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/img");
const UA = "ShanghaiTripPlan/1.0 (personal itinerary)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(url, dest) {
  await sleep(2500);
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/jpeg,image/png,image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status} ${dest}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf[0] === 0x25 && buf[1] === 0x50) throw new Error(`pdf ${dest}`);
  if (!(buf[0] === 0xff && buf[1] === 0xd8) && !(buf[0] === 0x89 && buf[1] === 0x50)) {
    throw new Error(`bad magic ${dest} ${buf.slice(0, 4).toString("hex")}`);
  }
  fs.writeFileSync(path.join(out, dest), buf);
  console.log("ok", dest, buf.length);
}

// Direct thumb URLs from Commons (stable path style)
const jobs = [
  [
    "food-yuxingji.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Steamed_Hairy_Crab.jpg/1280px-Steamed_Hairy_Crab.jpg",
  ],
  [
    "food-waipojia.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Dongpo_pork_%28a_Hangzhou_dish%29.jpg/1280px-Dongpo_pork_%28a_Hangzhou_dish%29.jpg",
  ],
  [
    "food-greentea.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mapo_tofu_1.jpg/1280px-Mapo_tofu_1.jpg",
  ],
  [
    "sight-lingyin.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Lingyin_Temple_Hangzhou.jpg/1280px-Lingyin_Temple_Hangzhou.jpg",
  ],
];

for (const [dest, url] of jobs) {
  try {
    await download(url, dest);
  } catch (e) {
    console.log("ERR", dest, e.message);
  }
}

// If greentea/mapo failed or wrong cuisine, copy dongpo as temporary Hangzhou plate for green tea card
const gt = path.join(out, "food-greentea.jpg");
if (!fs.existsSync(gt) || fs.statSync(gt).size < 20000) {
  fs.copyFileSync(path.join(out, "food-xinzhouji.jpg"), gt);
  console.log("copied dongpo -> food-greentea");
}
if (!fs.existsSync(path.join(out, "sight-lingyin.jpg"))) {
  fs.copyFileSync(path.join(out, "sight-westlake.jpg"), path.join(out, "sight-lingyin.jpg"));
  console.log("copied westlake -> lingyin placeholder");
}
