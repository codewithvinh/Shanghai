/**
 * Resolve place queries to Amap deep links of the form:
 *   https://www.amap.com/?p=POIID,lat,lng,name,address
 * (same final target as https://surl.amap.com/... share links)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(root, "src", "amap-links.json");

const PLACES = [
  { key: "homeinn_hz", keywords: "如家精选酒店杭州西湖湖滨定安路地铁站店", city: "330100" },
  { key: "wuzhen_visitor", keywords: "乌镇西栅游客服务中心", city: "330400" },
  { key: "homeinn_sh", keywords: "如家商旅酒店上海南京路步行街外滩中心店", city: "310000" },
  { key: "liulang", keywords: "柳浪闻莺", city: "330100" },
  { key: "lingyin", keywords: "杭州灵隐飞来峰", city: "330100" },
  { key: "qinghefang", keywords: "清河坊历史文化街区", city: "330100" },
  { key: "wuzhen_xizha", keywords: "乌镇西栅", city: "330400" },
  { key: "bund", keywords: "上海外滩", city: "310000" },
  { key: "disney", keywords: "上海迪士尼乐园", city: "310000" },
  { key: "yuyuan", keywords: "豫园商城", city: "310000" },
  { key: "waipojia", keywords: "外婆家西湖断桥店", city: "330100" },
  { key: "greentea", keywords: "绿茶餐厅 湖滨银泰IN77", city: "330100" },
  { key: "xinzhouji", keywords: "新周记鼓楼店 十五奎巷3号", city: "330100" },
  { key: "dachafan", keywords: "大茶饭 西栅大街612号", city: "330400", surl: "https://surl.amap.com/7vU4xfA1q8E7" },
  { key: "sanbao", keywords: "蟹叁寳 武林路129号", city: "330100" },
  { key: "yuxingji", keywords: "裕兴记蟹黄面馆 四川中路410号", city: "310000" },
  { key: "shengjian", keywords: "小杨生煎 宁波路", city: "310000" },
  { key: "fuxiaoguan", keywords: "富小馆 黄河路85号", city: "310000" },
];

function encPart(s) {
  return encodeURIComponent(String(s || "").replace(/,/g, " ")).replace(/%20/g, "+");
}

function buildPLink(poi) {
  const id = poi.id;
  const lat = poi.latitude;
  const lng = poi.longitude;
  const name = poi.disp_name || poi.name || "";
  const addr = poi.address || "";
  return `https://www.amap.com/?p=${id},${lat},${lng},${encPart(name)},${encPart(addr)}`;
}

async function fetchPoi(keywords, city) {
  const params = new URLSearchParams({
    query_type: "TQUERY",
    pagesize: "5",
    pagenum: "1",
    qii: "true",
    cluster_state: "5",
    need_utd: "true",
    utd_sceneid: "1000",
    div: "PC1000",
    addr_poi_merge: "true",
    is_classify: "true",
    zoom: "15",
    keywords,
    city,
    sec_scene: "service_poiInfo",
  });
  const url = `https://www.amap.com/service/poiInfo?${params}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.amap.com/",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${keywords}`);
  const json = await res.json();
  const list = json?.data?.poi_list || [];
  if (!list.length) throw new Error(`No POI for ${keywords}`);
  return list[0];
}

const out = {};
for (const place of PLACES) {
  try {
    if (place.surl) {
      out[place.key] = { amap: place.surl, keywords: place.keywords, via: "surl" };
      console.log(`OK ${place.key} (kept surl)`);
      continue;
    }
    const poi = await fetchPoi(place.keywords, place.city);
    const amap = buildPLink(poi);
    out[place.key] = {
      amap,
      id: poi.id,
      name: poi.disp_name || poi.name,
      address: poi.address,
      lat: poi.latitude,
      lng: poi.longitude,
      keywords: place.keywords,
      via: "p",
    };
    console.log(`OK ${place.key} -> ${poi.id} ${poi.disp_name || poi.name}`);
    await new Promise((r) => setTimeout(r, 350));
  } catch (err) {
    console.error(`FAIL ${place.key}: ${err.message}`);
  }
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(`wrote ${outPath} (${Object.keys(out).length} links)`);
