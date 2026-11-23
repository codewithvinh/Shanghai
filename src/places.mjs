import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function i18n(vi, zh, en) {
  return `<span class="i18n"><span class="vi">${vi}</span><span class="zh">${zh}</span><span class="en">${en}</span></span>`;
}

function enc(s) {
  return encodeURIComponent(s);
}

function maps(query, amapUrl) {
  const q = enc(query);
  return {
    amap:
      amapUrl ||
      `https://uri.amap.com/search?keyword=${q}&src=shanghai-plan&callnative=1&view=map`,
    gmaps: `https://maps.google.com/maps?q=${q}`,
    apple: `https://maps.apple.com/?q=${q}`,
    query,
    amapDirect: Boolean(amapUrl),
  };
}

const here = path.dirname(fileURLToPath(import.meta.url));
const embedsPath = path.join(here, "embeds.json");

/** Prefer embedded JPEGs so a single HTML file shows photos offline on any phone. */
function loadEmbeds() {
  if (!fs.existsSync(embedsPath)) return null;
  return JSON.parse(fs.readFileSync(embedsPath, "utf8"));
}

const embeds = loadEmbeds();

function pic(key, fallbackUrl) {
  if (embeds && embeds[key]) return embeds[key];
  return fallbackUrl;
}

/** Hotlink fallbacks only used if embeds.json is missing (run tools/make-embeds.py). */
const unsplash = (id) =>
  `https://images.unsplash.com/${id}?auto=format&amp;fit=crop&amp;w=1200&amp;q=80`;

const IMG = {
  // Local public/img/sight-westlake.jpg is source of truth for hangzhou-trip;
  // Unsplash photo-1547981609 was Forbidden City — do not reuse.
  westlake: pic(
    "westlake",
    "https://upload.wikimedia.org/wikipedia/commons/e/ee/Broken_Bridge%2C_Hangzhou%2C_China.jpg",
  ),
  brokenBridge: pic(
    "brokenBridge",
    "https://upload.wikimedia.org/wikipedia/commons/e/ee/Broken_Bridge%2C_Hangzhou%2C_China.jpg",
  ),
  wuzhen: pic(
    "wuzhen",
    "https://upload.wikimedia.org/wikipedia/commons/d/d7/20090913_Wuzhen_5129.jpg",
  ),
  bund: pic(
    "bund",
    "https://upload.wikimedia.org/wikipedia/commons/f/f2/The_Bund_Shanghai.jpg",
  ),
  lingyin: pic(
    "lingyin",
    "https://upload.wikimedia.org/wikipedia/commons/6/66/Lingyin_Temple%2C_Hangzhou_20161003.jpg",
  ),
  qinghefang: pic(
    "qinghefang",
    "https://upload.wikimedia.org/wikipedia/commons/c/c4/Hefang_Street%2C_Hangzhou.jpg",
  ),
  disney: pic("disney", unsplash("photo-1596484552834-6a58f850e0a1")),
  yuyuan: pic(
    "yuyuan",
    "https://upload.wikimedia.org/wikipedia/commons/c/c3/Yuyuan_Garden_4.jpg",
  ),
  waipojia: pic("waipojia", unsplash("photo-1552566626-52f8b828add9")),
  greentea: pic("greentea", unsplash("photo-1552566626-52f8b828add9")),
  xinzhouji: pic("xinzhouji", unsplash("photo-1552566626-52f8b828add9")),
  sanbao: pic("sanbao", unsplash("photo-1563245372-f21724e3856d")),
  yuxingji: pic("yuxingji", unsplash("photo-1563245372-f21724e3856d")),
  shengjian: pic("shengjian", unsplash("photo-1563245372-f21724e3856d")),
  fuxiaoguan: pic("fuxiaoguan", unsplash("photo-1555939594-58d7cb561ad1")),
  dachafan: pic("wuzhen", unsplash("photo-1552566626-52f8b828add9")),
};

export { IMG };

/** Online illustrative photos (embedded data URIs when embeds.json exists). */
const PLACES = [
  {
    group: "hotel",
    img: IMG.westlake,
    name: i18n(
      "Homeinn Selected · Hồ Tây Định An",
      "如家精选（西湖湖滨定安路地铁站店）",
      "Homeinn Selected · Ding'an / West Lake",
    ),
    cn: "杭州市上城区延安路126号耀江大厦A座",
    query: "如家精选酒店杭州西湖湖滨定安路地铁站店",
    amap: "https://www.amap.com/?p=B0I1PYM4KB,30.244835,120.165478,%E5%A6%82%E5%AE%B6%E7%B2%BE%E9%80%89%E9%85%92%E5%BA%97(%E6%9D%AD%E5%B7%9E%E8%A5%BF%E6%B9%96%E6%B9%96%E6%BB%A8%E5%AE%9A%E5%AE%89%E8%B7%AF%E5%9C%B0%E9%93%81%E7%AB%99%E5%BA%97),%E5%BB%B6%E5%AE%89%E8%B7%AF126",
    note: i18n(
      "P1: 09–10/01 · P2: 09–11/01 (2 đêm) · gửi vali ~08:00 · nhận 14:00 · 0571-86077977",
      "方案一9–10日 · 方案二9–11日两晚 · 约08:00存行李 · 14:00入住 · 0571-86077977",
      "P1: 9–10 Jan · P2: 9–11 Jan (2 nights) · bags ~08:00 · check-in 14:00 · 0571-86077977",
    ),
  },
  {
    group: "hotel",
    img: IMG.wuzhen,
    name: i18n(
      "乌镇民宿 · ngay trong Tây Sách (miễn vé)",
      "乌镇民宿 · 西栅景区内（免门票）",
      "Wuzhen Guest House · inside Xizha (free entry)",
    ),
    cn: "浙江省桐乡市乌镇西栅游客服务中心",
    query: "乌镇西栅游客服务中心",
    amap: "https://www.amap.com/?p=B0H6ORT05Y,30.748054,120.489158,%E4%B9%8C%E9%95%87%E8%A5%BF%E6%A0%85%E6%99%AF%E5%8C%BA1%E5%8F%B7%E6%B8%B8%E5%AE%A2%E6%9C%8D%E5%8A%A1%E4%B8%AD%E5%BF%83,%E4%B9%8C%E9%95%87%E8%A5%BF%E6%A0%85%E5%A4%A7%E8%A1%97129%E5%8F%B7%E8%A5%BF%E6%A0%85%E6%99%AF%E5%8C%BA%E5%86%85",
    note: i18n(
      "P1: 10–11/01 · P2: 11–12/01 · Didi tới trung tâm khách, đừng cổng Nam · +86-573-88731088",
      "方案一10–11日 · 方案二11–12日 · 滴滴游客中心，不要南门 · +86-573-88731088",
      "P1: 10–11 Jan · P2: 11–12 Jan · Didi to visitor centre, not south gate · +86-573-88731088",
    ),
  },
  {
    group: "hotel",
    img: IMG.bund,
    name: i18n(
      "Homeinn Selected · Bund Center / Nam Kinh Lộ",
      "如家商旅（南京路步行街外滩中心店）",
      "Homeinn Selected · Bund Center / Nanjing Road",
    ),
    cn: "上海市黄浦区江西中路135弄11号",
    query: "如家商旅酒店上海南京路步行街外滩中心店",
    amap: "https://www.amap.com/?p=B00155KKGY,31.233775,121.486551,%E5%A6%82%E5%AE%B6%E5%95%86%E6%97%85%E9%85%92%E5%BA%97(%E4%B8%8A%E6%B5%B7%E5%8D%97%E4%BA%AC%E8%B7%AF%E6%AD%A5%E8%A1%8C%E8%A1%97%E5%A4%96%E6%BB%A9%E4%B8%AD%E5%BF%83%E5%BA%97),%E6%B1%9F%E8%A5%BF%E4%B8%AD%E8%B7%AF135%E5%BC%8411%E5%8F%B7",
    note: i18n(
      "P1: 11–13/01 · P2: 12–14/01 · trả phòng 12:00 · +86-21-63239966",
      "方案一11–13日 · 方案二12–14日 · 12:00退房 · +86-21-63239966",
      "P1: 11–13 Jan · P2: 12–14 Jan · checkout 12:00 · +86-21-63239966",
    ),
  },
  {
    group: "sight",
    img: IMG.brokenBridge,
    name: i18n("Hồ Tây · Liễu Lãng Văn Oanh", "西湖 · 柳浪闻莺", "West Lake · Liulang Wenying"),
    cn: "杭州市西湖区南山路柳浪闻莺公园",
    query: "柳浪闻莺",
    amap: "https://www.amap.com/?p=B023B0247C,30.240389,120.156326,%E6%9D%AD%E5%B7%9E%E8%A5%BF%E6%B9%96%E9%A3%8E%E6%99%AF%E5%90%8D%E8%83%9C%E5%8C%BA-%E6%9F%B3%E6%B5%AA%E9%97%BB%E8%8E%BA,%E5%8D%97%E5%B1%B1%E8%B7%AF87%E5%8F%B7",
    note: i18n(
      "Sáng 09/01 · bờ đông / Đoạn Kiều miễn phí",
      "1月9日上午 · 东岸/断桥免费",
      "Morning 9 Jan · east shore / Broken Bridge free",
    ),
  },
  {
    group: "sight",
    img: IMG.lingyin,
    name: i18n("Linh Ẩn / Phi Lai Phong", "灵隐寺 / 飞来峰", "Lingyin / Feilai Feng"),
    cn: "杭州市西湖区灵隐路法云弄1号",
    query: "杭州灵隐飞来峰",
    amap: "https://www.amap.com/?p=B023B02842,30.240826,120.101406,%E7%81%B5%E9%9A%90%E5%AF%BA,%E6%B3%95%E4%BA%91%E5%BC%841%E5%8F%B7",
    note: i18n(
      "Optional · P2 ngày 10/01 đã chốt dạo thành phố + bảo tàng, không đi Linh Ẩn",
      "可选 · 方案二1月10日已定城里+博物馆，不去灵隐",
      "Optional · Plan 2 on 10 Jan stays in the city + museum, no Lingyin",
    ),
  },
  {
    group: "sight",
    img: IMG.qinghefang,
    name: i18n("Thanh Hà Phường / phố cổ", "清河坊历史文化街区", "Qinghefang old street"),
    cn: "杭州市上城区清河坊历史文化街区",
    query: "清河坊",
    amap: "https://www.amap.com/?p=B023B07SJZ,30.239827,120.169899,%E6%B8%85%E6%B2%B3%E5%9D%8A%E5%8E%86%E5%8F%B2%E6%96%87%E5%8C%96%E7%89%B9%E8%89%B2%E8%A1%97%E5%8C%BA,%E6%B2%B3%E5%9D%8A%E8%A1%97180%E5%8F%B7",
    note: i18n(
      "Chiều 09/01 · P2 thêm 10/01 quanh phố cổ + Bảo tàng Hàng Châu · miễn phí",
      "1月9日下午 · 方案二10日老街+杭州博物馆 · 免费",
      "Afternoon 9 Jan · Plan 2 on 10 Jan: old street + Hangzhou Museum · free",
    ),
  },
  {
    group: "sight",
    img: IMG.wuzhen,
    name: i18n("Ô Trấn Tây Sách", "乌镇西栅", "Wuzhen Xizha"),
    cn: "浙江省桐乡市乌镇西栅景区",
    query: "乌镇西栅",
    amap: "https://www.amap.com/?p=B023D02SCY,30.750270,120.484263,%E4%B9%8C%E9%95%87%E8%A5%BF%E6%A0%85%E6%99%AF%E5%8C%BA,%E7%9F%B3%E4%BD%9B%E5%8D%97%E8%B7%AF18%E5%8F%B7",
    note: i18n(
      "P1: chiều 10 + sáng 11 · P2: chiều 11 + sáng 12 · ngủ trong trấn thì khỏi mua vé",
      "方案一10下午+11早 · 方案二11下午+12早 · 住景区内免门票",
      "P1: aft 10 + morn 11 · P2: aft 11 + morn 12 · free if staying inside",
    ),
  },
  {
    group: "sight",
    img: IMG.bund,
    name: i18n("Bến Thượng Hải (外滩)", "外滩", "The Bund"),
    cn: "上海市黄浦区中山东一路外滩",
    query: "上海外滩",
    amap: "https://www.amap.com/?p=B00155FXB3,31.233516,121.492127,%E5%A4%96%E6%BB%A9,%E4%B8%AD%E5%B1%B1%E4%B8%9C%E4%B8%80%E8%B7%AF",
    note: i18n("P1 tối 11/01 · P2 tối 12/01 · đi bộ từ Nam Kinh Lộ", "方案一11日晚 · 方案二12日晚 · 从南京路步行", "P1 eve 11 Jan · P2 eve 12 Jan · walk from Nanjing Road"),
  },
  {
    group: "sight",
    img: IMG.disney,
    name: i18n("Shanghai Disneyland", "上海迪士尼乐园", "Shanghai Disneyland"),
    cn: "上海市浦东新区川沙镇黄赵路310号上海迪士尼乐园",
    query: "上海迪士尼乐园",
    amap: "https://www.amap.com/?p=B0KDJ78DYD,31.143212,121.660294,%E4%B8%8A%E6%B5%B7%E8%BF%AA%E5%A3%AB%E5%B0%BC%E4%B9%90%E5%9B%AD,%E7%94%B3%E8%BF%AA%E8%A5%BF%E8%B7%AF753%E5%8F%B7%E4%B8%8A%E6%B5%B7%E8%BF%AA%E5%A3%AB%E5%B0%BC%E5%BA%A6%E5%81%87%E5%8C%BA",
    note: i18n("P1: 12/01 · P2: 13/01 · xem ILLUMINATE! rồi metro về", "方案一12日 · 方案二13日 · 看完烟花坐地铁回", "P1: 12 Jan · P2: 13 Jan · ILLUMINATE! then metro back"),
  },
  {
    group: "sight",
    img: IMG.yuyuan,
    name: i18n("Phố chợ Dự Viên", "豫园商城", "Yuyuan Bazaar"),
    cn: "上海市黄浦区豫园商城福佑路",
    query: "豫园商城",
    amap: "https://www.amap.com/?p=B0FFJURK3P,31.226425,121.491239,%E8%B1%AB%E5%9B%AD%E5%95%86%E5%9F%8E,%E6%96%B9%E6%B5%9A%E4%B8%AD%E8%B7%AF265%E5%8F%B7",
    note: i18n(
      "P1 tối 13/01 · P2 tối 14/01 · chỉ phố chợ miễn phí, không mua vé vườn",
      "方案一13日晚 · 方案二14日晚 · 只逛商城，不买园林票",
      "P1 eve 13 Jan · P2 eve 14 Jan · bazaar only, no garden ticket",
    ),
  },
  {
    group: "food",
    img: IMG.waipojia,
    name: i18n("外婆家 / Gramma House · Đoạn Kiều", "外婆家西湖断桥店", "Grandma’s Home / Gramma House · Duanqiao"),
    cn: "杭州市西湖区北山路10号",
    query: "外婆家西湖断桥店 北山路10号",
    amap: "https://www.amap.com/?p=B0KAFHC5Y9,30.259385,120.152510,%E5%A4%96%E5%A9%86%E5%AE%B6(%E8%A5%BF%E6%B9%96%E6%96%AD%E6%A1%A5%E5%BA%97),%E5%8C%97%E5%B1%B1%E8%A1%9710%E5%8F%B7",
    note: i18n(
      "P2 trưa 09/01 · 红烧肉, 龙井虾仁, 粉丝虾 · 60–100 tệ · đến sớm",
      "方案二1月9日午饭 · 红烧肉、龙井虾仁、粉丝虾 · 60–100元 · 早点到",
      "Plan 2 lunch 9 Jan · braised pork, Longjing shrimp · 60–100 CNY · arrive early",
    ),
  },
  {
    group: "food",
    img: IMG.greentea,
    name: i18n("绿茶餐厅 · Hồ Tân IN77", "绿茶餐厅 湖滨银泰IN77", "Green Tea · Hubin IN77"),
    cn: "杭州市上城区延安路258号湖滨银泰IN77 C2 3F",
    query: "绿茶餐厅 湖滨银泰IN77",
    amap: "https://www.amap.com/?p=B0J09RYXWE,30.253246,120.165468,%E7%BB%BF%E8%8C%B6%E9%A4%90%E5%8E%85(%E6%9D%AD%E5%B7%9E%E6%B9%96%E6%BB%A8in77%E5%BA%97),%E5%BB%B6%E5%AE%89%E8%B7%AF258%E5%8F%B7%E6%B9%96%E6%BB%A8%E9%93%B6%E6%B3%B0in77C%E5%8C%BA%E4%B8%89%E6%A5%BC",
    note: i18n(
      "P2 tối 09/01 · 粉丝裹虾, 烤肉/烤鸡, 面包诱惑 · 70–100 tệ",
      "方案二1月9日晚 · 粉丝裹虾、烤肉烤鸡、面包诱惑 · 70–100元",
      "Plan 2 dinner 9 Jan · vermicelli prawns, roast, bread · 70–100 CNY",
    ),
  },
  {
    group: "food",
    img: IMG.xinzhouji,
    name: i18n("新周记 · phố cổ / 鼓楼", "新周记鼓楼店", "Xinzhouji · Gulou"),
    cn: "杭州市上城区十五奎巷3号",
    query: "新周记鼓楼店 十五奎巷3号",
    amap: "https://www.amap.com/?p=B0FFF4XZMX,30.238027,120.170421,%E6%96%B0%E5%91%A8%E8%AE%B0%C2%B7%E5%B7%B7%E5%AD%90%E9%87%8C%E7%9A%84%E6%B1%9F%E5%8D%97%E5%91%B3(%E9%BC%93%E6%A5%BC%E5%BA%97),%E5%8D%81%E4%BA%94%E5%A5%8E%E5%B7%B72-3%E5%8F%B7",
    note: i18n(
      "P2 trưa 10/01 (hoặc backup) · Đông Pha, tôm xì dầu · 70–90 tệ",
      "方案二1月10日午饭（或备选）· 东坡肉、酱油虾 · 70–90元",
      "Plan 2 lunch 10 Jan (or backup) · Dongpo, soy prawns · 70–90 CNY",
    ),
  },
  {
    group: "food",
    img: IMG.dachafan,
    name: i18n("大茶饭 · Tây Sách", "大茶饭（嘉兴桐乡·西栅）", "Dachafan · Xizha"),
    cn: "浙江省桐乡市乌镇西栅大街612号",
    query: "大茶饭 西栅大街612号",
    amap: "https://surl.amap.com/7vU4xfA1q8E7",
    note: i18n(
      "Ô Trấn · 粤菜 / tea restaurant · ~156 tệ/người · Xizha St 612 · link Amap sẵn",
      "乌镇 · 粤菜茶楼 · 约156元/人 · 西栅大街612号 · 已附高德短链",
      "Wuzhen · Cantonese tea house · ~¥156/person · Xizha St 612 · Amap short link",
    ),
  },
  {
    group: "food",
    img: IMG.sanbao,
    name: i18n("蟹叁寳 · Vũ Lâm (tùy)", "蟹叁寳 武林路", "San Bao · Wulin (optional)"),
    cn: "杭州市拱墅区武林路129号",
    query: "蟹叁寳 武林路129号",
    amap: "https://www.amap.com/?p=B0J6SM1E1H,30.260480,120.159890,%E8%9F%B9%E5%8F%81%E5%AF%B3%C2%B7%E8%9F%B9%E9%BB%84%E6%8D%9E%E9%A5%AD(%E6%9D%AD%E5%B7%9E%E6%AD%A6%E6%9E%97%E5%BA%97),%E6%AD%A6%E6%9E%97%E8%B7%AF129%E5%8F%B7",
    note: i18n(
      "P1 tối 09/01 tùy sức · P2 thì skip (đã chốt 绿茶) · mì cua + tiểu long bao",
      "方案一9日晚看体力 · 方案二已定绿茶可跳过 · 蟹粉面+小笼",
      "P1 eve 9 Jan optional · P2 skip (Green Tea locked) · crab noodles + xlb",
    ),
  },
  {
    group: "food",
    img: IMG.yuxingji,
    name: i18n("裕兴记 · mì/cơm cua Bến", "裕兴记·蟹黄面馆（外滩店）", "Yuxingji · Bund crab noodles"),
    cn: "上海市黄浦区四川中路410号",
    query: "裕兴记蟹黄面馆 四川中路410号",
    amap: "https://www.amap.com/?p=B0JUVH6ICN,31.238965,121.487579,%E8%A3%95%E5%85%B4%E8%AE%B0%C2%B7%E8%9F%B9%E9%BB%84%E9%9D%A2%E9%A6%86(%E5%A4%96%E6%BB%A9%E5%BA%97),%E5%9B%9B%E5%B7%9D%E4%B8%AD%E8%B7%AF410%E5%8F%B7",
    note: i18n(
      "P1 tối 11/01 · P2 tối 12/01 · gọi cơm cua; mì thì 1 tô chia đôi",
      "方案一11日晚 · 方案二12日晚 · 点蟹粉饭；面可两人分一碗",
      "P1 eve 11 Jan · P2 eve 12 Jan · crab rice; share noodles if curious",
    ),
  },
  {
    group: "food",
    img: IMG.shengjian,
    name: i18n("小杨生煎", "小杨生煎", "Yang’s fried dumplings"),
    cn: "上海市黄浦区宁波路",
    query: "小杨生煎 宁波路",
    amap: "https://www.amap.com/?p=B00155HPX3,31.239273,121.483806,%E5%B0%8F%E6%A5%A0%E7%94%9F%E7%85%8E(%E4%B8%8A%E6%B5%B7%E5%AE%81%E6%B3%A2%E8%B7%AF%E5%BA%97),%E5%AE%81%E6%B3%A2%E8%B7%AF178%E5%8F%B7",
    note: i18n("P1 sáng 13/01 · P2 sáng 14/01 · gần khách sạn", "方案一13日早 · 方案二14日早 · 酒店附近", "P1 morn 13 Jan · P2 morn 14 Jan · near hotel"),
  },
  {
    group: "food",
    img: IMG.fuxiaoguan,
    name: i18n("富小馆 · sau Disney", "富小馆", "Fu Xiaoguan · after Disney"),
    cn: "上海市黄浦区黄河路85号",
    query: "富小馆 黄河路85号",
    amap: "https://www.amap.com/?p=B0K0Y7GEVU,31.234983,121.471008,%E5%AF%8C%E5%B0%8F%E9%A6%86%E7%83%A7%E7%83%A4%C2%B7%E7%89%9B%E8%85%A9%E7%85%B2(%E9%BB%84%E6%B2%B3%E8%B7%AF%E5%BA%97),%E9%BB%84%E6%B2%B3%E8%B7%AF5-87%E5%8F%B7",
    note: i18n("P1 đêm 12/01 · P2 đêm 13/01 · canh bò + nướng", "方案一12日夜 · 方案二13日夜 · 牛肉汤加烧烤", "P1 night 12 Jan · P2 night 13 Jan · beef soup + grill"),
  },
];

const GROUP_LABEL = {
  hotel: i18n("Khách sạn", "酒店", "Hotels"),
  sight: i18n("Tham quan", "景点", "Places"),
  food: i18n("Ăn uống", "餐饮", "Food"),
};

function renderCard(p) {
  const m = maps(p.query || p.cn, p.amap);
  const tag =
    p.group === "hotel"
      ? i18n("KS", "酒店", "Hotel")
      : p.group === "food"
        ? i18n("Ăn", "吃", "Food")
        : i18n("Điểm", "景", "Sight");
  // target=_blank helps iOS Files/WebView hand the URL to Safari, where 高德 callnative works
  const amapAttrs = m.amapDirect
    ? `href="${m.amap}" data-map="amap" data-amap-direct="1" data-q="${enc(m.query)}" target="_blank" rel="noopener"`
    : `href="${m.amap}" data-map="amap" data-q="${enc(m.query)}" target="_blank" rel="noopener"`;
  return `<article class="place-card" data-group="${p.group}">
  <div class="place-card__media">
    <img src="${p.img}" alt="" decoding="async" width="900" height="600">
    <span class="place-card__tag">${tag}</span>
  </div>
  <div class="place-card__body">
    <h3 class="place-card__title">${p.name}</h3>
    <p class="place-card__cn" lang="zh">${p.cn}</p>
    <p class="place-card__note">${p.note}</p>
    <div class="place-card__actions">
      <button type="button" class="btn-copy" data-copy="${p.cn.replace(/"/g, "&quot;")}">${i18n("Copy địa chỉ", "复制中文地址", "Copy CN address")}</button>
      <a class="btn-map" ${amapAttrs}>${i18n("Amap 高德", "高德地图", "Amap")}</a>
      <a class="btn-map btn-map--g" href="${m.gmaps}" data-map="google" data-q="${enc(m.query)}" data-apple="${m.apple}" rel="noopener">${i18n("Google Maps", "谷歌地图", "Google Maps")}</a>
    </div>
  </div>
</article>`;
}

export function renderPlacesPanel() {
  const groups = ["hotel", "sight", "food"];
  const blocks = groups
    .map((g) => {
      const cards = PLACES.filter((p) => p.group === g)
        .map(renderCard)
        .join("\n");
      return `<div class="place-group">
  <h3 class="place-group__title">${GROUP_LABEL[g]}</h3>
  <div class="place-grid">${cards}</div>
</div>`;
    })
    .join("\n");

  return `<section class="panel panel--cards" id="pins">
  <h2>${i18n("Địa chỉ & bản đồ — bấm là đi", "地址与地图", "Addresses & maps")}</h2>
  <p class="panel-lead">${i18n(
    "Copy địa chỉ tiếng Trung, dán Amap hoặc Didi là đi. Ảnh nằm sẵn trong file này — máy nào mở cũng thấy, không cần mạng.",
    "复制中文地址，贴到高德或滴滴就行。照片已经嵌在这个文件里，换手机离线也能看。",
    "Copy the Chinese address into Amap or Didi and go. Photos live in this file — any phone, even offline.",
  )}</p>
  ${blocks}
</section>`;
}
