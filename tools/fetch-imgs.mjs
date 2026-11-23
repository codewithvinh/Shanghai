import fs from "node:fs";

const UA = "ShanghaiTripPlan/1.0 (personal itinerary)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.search = new URLSearchParams({ format: "json", ...params });
  const res = await fetch(u, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`api ${res.status}`);
  return res.json();
}

async function find(q) {
  const j = await api({ action: "query", list: "search", srsearch: q, srnamespace: "6", srlimit: "8" });
  return (j.query?.search || []).map((x) => x.title);
}

async function fileUrl(title) {
  const j = await api({ action: "query", titles: title, prop: "imageinfo", iiprop: "url", iiurlwidth: "1400" });
  const p = Object.values(j.query.pages)[0];
  return p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url || null;
}

async function save(title, dest) {
  await sleep(1200);
  const link = await fileUrl(title);
  if (!link) {
    console.log("no url", title);
    return false;
  }
  await sleep(800);
  const res = await fetch(link, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    console.log("http", res.status, title);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(new URL(`../public/img/${dest}`, import.meta.url), buf);
  console.log("ok", dest, title, buf.length);
  return true;
}

const jobs = [
  { q: "Dongpo pork", dest: "food-xinzhouji.jpg", prefer: /Dongpo|东坡/i },
  { q: "File:Longjingxiaoren.jpg", dest: "food-greentea.jpg", exact: true },
  { q: "hairy crab cooked", dest: "food-yuxingji.jpg", prefer: /crab|大闸蟹|hairy/i },
  { q: "xiaolongbao", dest: "food-sanbao.jpg", prefer: /xiaolongbao|小笼/i },
  { q: "shengjianbao", dest: "food-shengjian.jpg", prefer: /shengjian|生煎/i },
  { q: "hong shao rou", dest: "food-waipojia.jpg", prefer: /braised|红烧|Hongshao|hong shao/i },
  { q: "Lingyin Temple Hangzhou", dest: "sight-lingyin.jpg", prefer: /Lingyin|灵隐/i },
];

for (const job of jobs) {
  try {
    if (job.exact) {
      await save(job.q.startsWith("File:") ? job.q : `File:${job.q}`, job.dest);
      continue;
    }
    const hits = await find(job.q);
    console.log("search", job.q, hits.slice(0, 5));
    const pick = hits.find((t) => job.prefer?.test(t)) || hits[0];
    if (pick) await save(pick, job.dest);
    else console.log("miss", job.dest);
  } catch (e) {
    console.log("ERR", job.dest, e.message);
  }
}
