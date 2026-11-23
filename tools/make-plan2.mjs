/**
 * Build Plan 2 from Plan 1:
 * - Same route Hangzhou → Wuzhen → Shanghai
 * - +1 Hangzhou day (9–10 Jan full)
 * - Return VJ6011 on 15/01 (not 14/01)
 * - Shift Wuzhen/Shanghai/Disney/Yuyuan +1 day
 * - Lunch 9/1: 外婆家 (Gramma House); dinner 9/1: 绿茶
 * - No Dihang hotel row
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p1 = fs.readFileSync(path.join(root, "src/pages/plan-1.body.html"), "utf8");

function i18n(vi, zh, en) {
  return `<span class="i18n"><span class="vi">${vi}</span><span class="zh">${zh}</span><span class="en">${en}</span></span>`;
}

/** Shift only post-Hangzhou calendar markers using tokens to avoid double-shift. */
function shiftAfterHangzhou(html) {
  const map = [
    ["13/01/2027", "__D14Y__"],
    ["12/01/2027", "__D13Y__"],
    ["11/01/2027", "__D12Y__"],
    ["10/01/2027", "__D11Y__"],
    ["13/01", "__D14__"],
    ["12/01", "__D13__"],
    ["11/01", "__D12__"],
    ["10/01", "__D11__"],
    // short chip forms: 10/1, 11/1…
    ["13/1", "__S14__"],
    ["12/1", "__S13__"],
    ["11/1", "__S12__"],
    ["10/1", "__S11__"],
    ["1月13日", "__Z14__"],
    ["1月12日", "__Z13__"],
    ["1月11日", "__Z12__"],
    ["1月10日", "__Z11__"],
    // zh chip 1/13, 1/12…
    ["1/13", "__ZC14__"],
    ["1/12", "__ZC13__"],
    ["1/11", "__ZC12__"],
    ["1/10", "__ZC11__"],
    // en phrases inside chips/headings
    ["13 Jan", "__E14__"],
    ["12 Jan", "__E13__"],
    ["11 Jan", "__E12__"],
    ["10 Jan", "__E11__"],
  ];
  // Only apply date shifts inside articles after the first Hangzhou day card ends —
  // we do a two-pass: protect D1 Hangzhou block, shift the rest, unprotect.
  const startD2 = html.indexOf('<article class="day-card">\n<div class="day-head">\n  <span class="chip day"><span class="i18n"><span class="vi">D2 10/1');
  if (startD2 < 0) throw new Error("D2 marker not found");
  const head = html.slice(0, startD2);
  let tail = html.slice(startD2);
  for (const [from, to] of map.slice(0, -1)) {
    tail = tail.split(from).join(to);
  }
  // Flight markers in tail
  tail = tail.replace(/VJ6011 PVG 02:20 14\/01/g, "VJ6011 PVG 02:20 15/01");
  tail = tail.replace(/\(14\/01\)/g, "(15/01)");
  tail = tail.replace(/Ngày 14\/01/g, "Ngày 15/01");
  tail = tail.replace(/1月14日/g, "1月15日");
  tail = tail.replace(/14 Jan/g, "15 Jan");
  const back = [
    ["__D14Y__", "14/01/2027"],
    ["__D13Y__", "13/01/2027"],
    ["__D12Y__", "12/01/2027"],
    ["__D11Y__", "11/01/2027"],
    ["__D14__", "14/01"],
    ["__D13__", "13/01"],
    ["__D12__", "12/01"],
    ["__D11__", "11/01"],
    ["__S14__", "14/1"],
    ["__S13__", "13/1"],
    ["__S12__", "12/1"],
    ["__S11__", "11/1"],
    ["__Z14__", "1月14日"],
    ["__Z13__", "1月13日"],
    ["__Z12__", "1月12日"],
    ["__Z11__", "1月11日"],
    ["__ZC14__", "1/14"],
    ["__ZC13__", "1/13"],
    ["__ZC12__", "1/12"],
    ["__ZC11__", "1/11"],
    ["__E14__", "14 Jan"],
    ["__E13__", "13 Jan"],
    ["__E12__", "12 Jan"],
    ["__E11__", "11 Jan"],
  ];
  for (const [from, to] of back) tail = tail.split(from).join(to);

  // Day chips / headings: D2→D3, D3→D4, D4→D5, D5→D6 (token)
  tail = tail
    .replaceAll(">D5 ", ">__DX6__ ")
    .replaceAll(">D4 ", ">__DX5__ ")
    .replaceAll(">D3 ", ">__DX4__ ")
    .replaceAll(">D2 ", ">__DX3__ ")
    .replaceAll(">__DX6__ ", ">D6 ")
    .replaceAll(">__DX5__ ", ">D5 ")
    .replaceAll(">__DX4__ ", ">D4 ")
    .replaceAll(">__DX3__ ", ">D3 ");

  tail = tail
    .replaceAll("Ngày 5 –", "__N6__")
    .replaceAll("Ngày 4 –", "__N5__")
    .replaceAll("Ngày 3 –", "__N4__")
    .replaceAll("Ngày 2 –", "__N3__")
    .replaceAll("__N6__", "Ngày 6 –")
    .replaceAll("__N5__", "Ngày 5 –")
    .replaceAll("__N4__", "Ngày 4 –")
    .replaceAll("__N3__", "Ngày 3 –");

  tail = tail
    .replaceAll("第5天", "__ZDN6__")
    .replaceAll("第4天", "__ZDN5__")
    .replaceAll("第3天", "__ZDN4__")
    .replaceAll("第2天", "__ZDN3__")
    .replaceAll("__ZDN6__", "第6天")
    .replaceAll("__ZDN5__", "第5天")
    .replaceAll("__ZDN4__", "第4天")
    .replaceAll("__ZDN3__", "第3天");

  tail = tail
    .replaceAll("Day 5 –", "__ED6__")
    .replaceAll("Day 4 –", "__ED5__")
    .replaceAll("Day 3 –", "__ED4__")
    .replaceAll("Day 2 –", "__ED3__")
    .replaceAll("__ED6__", "Day 6 –")
    .replaceAll("__ED5__", "Day 5 –")
    .replaceAll("__ED4__", "Day 4 –")
    .replaceAll("__ED3__", "Day 3 –");

  // Weekday labels after shift for chips that still say old weekdays in vi
  // D3 was Mon 11 → now Tue 12: T2→T3 etc. Fix via explicit chip strings in insert.
  return head + tail;
}

const HANGZHOU_D2 = `<article class="day-card">
<div class="day-head">
  <span class="chip day"><span class="i18n"><span class="vi">D2 10/1 CN</span><span class="zh">D2 1/10 日</span><span class="en">D2 Sun 10 Jan</span></span></span>
  <span class="chip mid"><span class="i18n"><span class="vi">Vừa</span><span class="zh">中</span><span class="en">Medium</span></span></span>
</div>
<h3>${i18n(
  "Ngày 2 – Chủ nhật 10/01: Hàng Châu ngày 2 — Linh Ẩn / Phi Lai Phong + làng trà Long Tĩnh",
  "第2天 周日1月10日：杭州第二天 — 灵隐/飞来峰 + 龙井村",
  "Day 2 – Sun 10 Jan: Hangzhou day 2 — Lingyin / Feilai Feng + Longjing village",
)}</h3>
<p class="city-line">${i18n("Hàng Châu · Linh Ẩn · Long Tĩnh", "杭州 · 灵隐 · 龙井", "Hangzhou · Lingyin · Longjing")}</p>
<p>${i18n(
  "Ngủ bù xong đi Linh Ẩn / Phi Lai Phong buổi sáng (nhớ book mini-program Alipay/WeChat trước ít nhất 1 ngày, passport ok). Chiều taxi lên làng trà Long Tĩnh uống trà, tối về Hồ Tân ăn nhẹ rồi ngủ sớm — mai đi Ô Trấn.",
  "补觉后上午灵隐/飞来峰（至少提前1天用支付宝/微信小程序预约，护照可用）。下午打车去龙井村喝茶，晚上回湖滨简单吃，早睡——明天去乌镇。",
  "Sleep in, then Lingyin / Feilai Feng in the morning (book the Alipay/WeChat mini-program at least 1 day ahead; passport works). Afternoon taxi to Longjing village for tea, light dinner back in Hubin, sleep early — Wuzhen tomorrow.",
)}</p>
<details class="day-more"><summary>${i18n("Xem giờ giấc & chi phí", "展开当日时刻与费用", "Show times and costs")}</summary>
<div style="overflow-x:auto"><table><thead><tr><th>${i18n("Thời gian", "时间", "Time")}</th><th>${i18n("Việc", "安排", "What")}</th><th>${i18n("Địa điểm", "地点", "Where")}</th><th>${i18n("Chi tiết", "说明", "Details")}</th><th>${i18n("Chi phí", "费用", "Cost")}</th><th>${i18n("Đơn vị", "单位", "Unit")}</th><th>${i18n("SL", "数量", "Qty")}</th><th>${i18n("Ghi chú", "备注", "Notes")}</th><th>${i18n("Nguồn", "来源", "Source")}</th></tr></thead><tbody>
<tr><td>08:00–09:00</td><td>${i18n("Ăn sáng", "早餐", "Breakfast")}</td><td>${i18n("Gần khách sạn", "酒店附近", "Near hotel")}</td><td>${i18n("Ngủ bù rồi ăn nóng.", "补觉后再吃热的。", "Eat hot food after sleeping in.")}</td><td class="num">50.000</td><td>${i18n("người", "人", "person")}</td><td class="num">2</td><td>${i18n("Buffet Homeinn tầm 38 tệ cũng được.", "如家自助大约38元也行。", "Homeinn buffet ~38 CNY is fine.")}</td><td></td></tr>
<tr><td>09:00–12:00</td><td>${i18n("Tham quan", "游览", "Visit")}</td><td>${i18n("Linh Ẩn / Phi Lai Phong", "灵隐寺 / 飞来峰", "Lingyin / Feilai Feng")}</td><td>${i18n("Từ 1/12/2025 khu vực miễn phí nhưng phải đặt suất real-name trước 1–7 ngày trên mini-program「杭州灵隐飞来峰」.", "2025年12月1日起免门票，但须提前1–7天实名预约小程序「杭州灵隐飞来峰」。", "Free since 1 Dec 2025, but real-name booking 1–7 days ahead on the「杭州灵隐飞来峰」mini-program.")}</td><td class="num">0</td><td>${i18n("người", "人", "person")}</td><td class="num">2</td><td>${i18n("<ul class=\"tips\"><li>Suất sáng 07:30–12:00 hoặc chiều 12:00–17:00</li><li>Last entry 17:00</li><li>Didi từ Định An tầm 25–40 phút</li><li>Tháng 1 lạnh — mặc ấm</li></ul>", "<ul class=\"tips\"><li>上午07:30–12:00或下午12:00–17:00</li><li>17:00停止入园</li><li>定安路打车大约25–40分钟</li><li>1月很冷，穿厚</li></ul>", "<ul class=\"tips\"><li>Morning 07:30–12:00 or afternoon 12:00–17:00</li><li>Last entry 17:00</li><li>Didi from Ding'an ~25–40 min</li><li>January is cold — dress warm</li></ul>")}</td><td>Alipay</td></tr>
<tr><td>12:00–13:15</td><td>${i18n("Ăn trưa", "午餐", "Lunch")}</td><td>${i18n("Gần Linh Ẩn hoặc về phố cổ", "灵隐附近或回清河坊", "Near Lingyin or back to old street")}</td><td>${i18n("Ưu tiên 新周记 鼓楼 十五奎巷3号 (Đông Pha, tôm xì dầu) nếu về phố cổ. Backup: 齐心老弄堂面馆 / 新白鹿.", "优先回鼓楼新周记十五奎巷3号。备选齐心老弄堂面馆或新白鹿。", "Prefer Xinzhouji Gulou 3 Shiwukui Lane. Backup: Qixin alley noodles / Xinbailu.")}</td><td class="num">180.000</td><td>${i18n("người", "人", "person")}</td><td class="num">2</td><td>${i18n("Đừng ăn no quá nếu chiều lên Long Tĩnh — trên đồi chủ yếu trà.", "下午要上龙井的话别吃太撑——山上主要是茶。", "Don't overeat if heading to Longjing — it's mostly tea up there.")}</td><td></td></tr>
<tr><td>13:30–16:30</td><td>${i18n("Trà + dạo", "喝茶散步", "Tea walk")}</td><td>${i18n("Làng trà Long Tĩnh (龙井村)", "龙井村", "Longjing Village")}</td><td>${i18n("Didi từ Linh Ẩn hoặc từ Hồ Tân. Ngồi quán nông hộ uống Long Tĩnh, mua lá nếu thích — hỏi giá trước.", "从灵隐或湖滨打车。农家茶馆喝龙井，想买茶叶先问价。", "Didi from Lingyin or Hubin. Farmhouse tea; ask price before buying leaves.")}</td><td class="num">120.000</td><td>${i18n("người", "人", "person")}</td><td class="num">2</td><td>${i18n("<ul class=\"tips\"><li>Làng miễn phí, không cổng vé</li><li>Bảo tàng trà quốc gia gần đó — vào nếu còn sức</li><li>Lạnh/mưa thì rút ngắn, về Hồ Tân sớm</li></ul>", "<ul class=\"tips\"><li>村子免费，无门票</li><li>附近有中国茶叶博物馆，有体力再去</li><li>下雨或太冷就缩短，早回湖滨</li></ul>", "<ul class=\"tips\"><li>Village is free, no ticket gate</li><li>National Tea Museum nearby if you still have energy</li><li>Cut short if cold/rainy; return to Hubin early</li></ul>")}</td><td>Didi</td></tr>
<tr><td>17:00–18:00</td><td>${i18n("Về khách sạn", "回酒店", "Back to hotel")}</td><td>${i18n("Homeinn Định An", "如家定安路", "Homeinn Ding'an")}</td><td>${i18n("Tắm, gom đồ cho mai đi Ô Trấn.", "洗澡，收拾明天去乌镇的行李。", "Shower; pack for Wuzhen tomorrow.")}</td><td class="num">40.000</td><td>${i18n("người", "人", "person")}</td><td class="num">2</td><td>${i18n("Didi về.", "打车回。", "Didi back.")}</td><td>Didi</td></tr>
<tr><td>18:30–20:00</td><td>${i18n("Ăn tối", "晚餐", "Dinner")}</td><td>${i18n("Hồ Tân / phố cổ", "湖滨 / 清河坊", "Hubin / old street")}</td><td>${i18n("Gợi ý: 齐心老弄堂面馆 (mì local) hoặc 新白鹿 Hồ Tân. Đêm qua đã ăn 绿茶 rồi — đổi món.", "建议齐心老弄堂面馆或湖滨新白鹿。昨晚已吃绿茶，换口味。", "Try Qixin alley noodles or Xinbailu Hubin. You had Green Tea last night — switch it up.")}</td><td class="num">180.000</td><td>${i18n("người", "人", "person")}</td><td class="num">2</td><td>${i18n("Ăn xong ngủ sớm.", "吃完早睡。", "Sleep early after dinner.")}</td><td></td></tr>
</tbody></table></div>
</details>
</article>`;

function patchDay1Hangzhou(html) {
  // Title / summary / remove Wulin optional chip emphasis for Plan 2 fixed meals
  html = html.replace(
    /Ngày 1 – Thứ 7 09\/01: Hồng Kiều → Hàng Châu \(sáng Hồ Tây, Thanh Hà Phường; chợ đêm Vũ Lâm thì tùy\)/,
    "Ngày 1 – Thứ 7 09/01: Hồng Kiều → Hàng Châu (Hồ Tây, trưa 外婆家 / Gramma House, tối 绿茶)",
  );
  html = html.replace(
    /第1天 周六1月9日：虹桥→杭州（上午西湖、清河坊；武林夜市可选）/,
    "第1天 周六1月9日：虹桥→杭州（西湖，午饭外婆家，晚饭绿茶）",
  );
  html = html.replace(
    /Day 1 – Sat 9 Jan: Hongqiao → Hangzhou \(West Lake in the morning, Qinghefang; Wulin night market optional\)/,
    "Day 1 – Sat 9 Jan: Hongqiao → Hangzhou (West Lake, lunch Grandma’s Home / Gramma House, dinner Green Tea)",
  );

  html = html.replace(
    /<span class="chip opt"><span class="i18n"><span class="vi">Tối tùy sức<\/span><span class="zh">晚上看体力<\/span><span class="en">Evening optional<\/span><\/span><\/span>/,
    `<span class="chip opt"><span class="i18n"><span class="vi">Trưa 外婆家 · tối 绿茶</span><span class="zh">午饭外婆家 · 晚饭绿茶</span><span class="en">Lunch Grandma’s · dinner Green Tea</span></span></span>`,
  );

  html = html.replace(
    /Tàu tầm 06:20–06:45 → Hồ Tân \(gửi vali, 14:00 mới nhận phòng\) → sáng lượn Hồ Tây → ăn trưa → Thanh Hà Phường\. Tối tùy sức: còn khỏe thì ra chợ đêm Vũ Lâm; mệt thì ăn 外婆家 \/ 绿茶 ở Hồ Tân \(IN77\) rồi về ngủ sớm — đêm trước gần như thức trắng rồi\./,
    "Tàu tầm 06:20–06:45 → Hồ Tân (gửi vali) → sáng đi bờ đông / Đoạn Kiều → trưa chốt 外婆家 (Gramma House, ưu tiên chi nhánh 西湖断桥 北山路10号; backup IN77 hoặc 南山路147) → chiều Thanh Hà Phường / nhận phòng → tối 绿茶餐厅 Hồ Tân IN77. Đêm trước gần như thức trắng — đừng nhồi thêm Vũ Lâm.",
  );
  html = html.replace(
    /大约06:20–06:45的高铁 → 湖滨（先存行李，14:00入住）→ 上午西湖 → 午饭 → 清河坊。晚上看体力：还有精神就去武林夜市；累了就在湖滨IN77吃外婆家或绿茶，早点回去睡——前一晚几乎没睡。/,
    "大约06:20–06:45高铁 → 湖滨存行李 → 上午东岸/断桥 → 午饭外婆家（优先西湖断桥北山路10号；备选IN77或南山路147）→ 下午清河坊/入住 → 晚饭湖滨IN77绿茶。前一晚几乎没睡，今晚不去武林。",
  );
  html = html.replace(
    /Train around 06:20–06:45 → Hubin \(leave bags, check in at 14:00\) → West Lake in the morning → lunch → Qinghefang\. Evening depends on energy: Wulin night market if you're up for it; if tired, eat at Grandma's Home \/ Green Tea in Hubin \(IN77\) and sleep early — you barely slept the night before\./,
    "Train around 06:20–06:45 → Hubin (bags) → east shore / Broken Bridge → lunch at Grandma’s Home / Gramma House (prefer Duanqiao 北山路10号; backup IN77 or 南山路147) → Qinghefang / check-in → dinner Green Tea Hubin IN77. You barely slept — skip Wulin tonight.",
  );

  // Lunch cell note inside D1 timetable
  html = html.replace(
    "Phố cổ: 新周记 鼓楼 十五奎巷3号 (Đông Pha, tôm xì dầu). Hồ Tân/IN77: 绿茶 延安路258号 hoặc 外婆家. Gần 柳浪闻莺 thì có 外婆家 南山路147. 黄油与面包 chỉ để ăn vặt thôi. Muốn ăn 叫花鸡 thì hỏi quán trước.",
    "Chốt <b>外婆家 / Gramma House</b>: ưu tiên 西湖断桥店 北山路10号 (外婆红烧肉, 龙井虾仁, 蒜蓉粉丝虾, 茶香鸡). Backup IN77 / 南山路147. Đến sớm tránh xếp hàng.",
  );
  html = html.replace(
    "清河坊：新周记鼓楼十五奎巷3号。湖滨IN77：绿茶延安路258号或外婆家。柳浪闻莺：南山路147外婆家。黄油与面包只当小吃。叫花鸡先问。",
    "午饭外婆家（优先断桥北山路10号）。备选IN77或南山路147。早点到。",
  );
  html = html.replace(
    "Old street: Xinzhouji Gulou, 3 Shiwukui Lane. Hubin IN77: Green Tea 258 Yan’an Rd or Grandma’s Home. By Liulang Wenying: Grandma’s Home 147 Nanshan Rd. Butterful is a snack only. Ask ahead for beggar’s chicken.",
    "Lunch at Grandma’s / Gramma House — prefer Duanqiao 北山路10号; backup IN77 or 南山路147. Arrive early.",
  );

  // Replace Didi-to-Wulin + dinner rows once
  const didiStart = html.indexOf("<tr><td>18:30–19:00</td><td>Didi</td><td>");
  const dinnerStart = html.indexOf("<tr><td>19:00–21:30</td><td>");
  const dinnerEnd = html.indexOf("</tr>", dinnerStart);
  if (didiStart > 0 && dinnerStart > didiStart && dinnerEnd > dinnerStart) {
    const repl = `<tr><td>18:30–19:00</td><td>Didi / đi bộ</td><td>${i18n("Hồ Tân IN77", "湖滨IN77", "Hubin IN77")}</td><td>${i18n("Từ khách sạn Định An tới 延安路258.", "从定安路到延安路258。", "From Ding'an hotel to 延安路258.")}</td><td class="num">20.000</td><td>${i18n("người", "人", "person")}</td><td class="num">2</td><td>${i18n("Gần khách sạn — khỏi chạy Vũ Lâm.", "就在湖滨，不去武林。", "Near the hotel — skip Wulin.")}</td><td></td></tr>
<tr><td>19:00–21:00</td><td>${i18n("Ăn tối", "晚餐", "Dinner")}</td><td>绿茶餐厅 IN77</td><td>${i18n("粉丝裹虾, 葱香烤肉/烤鸡合拼, 面包诱惑", "粉丝裹虾、烤肉烤鸡合拼、面包诱惑", "Vermicelli prawns, roast combo, bread temptation")}</td><td class="num">200.000</td><td>${i18n("người", "人", "person")}</td><td class="num">2</td><td>${i18n("C2 3F · tầm 70–100 tệ/người · đến sớm", "C2 3F · 约70–100元 · 早点到", "C2 3F · ~70–100 CNY · arrive early")}</td><td></td></tr>`;
    html = html.slice(0, didiStart) + repl + html.slice(dinnerEnd + 5);
  } else {
    console.warn("D1 dinner rows not found");
  }

  html = html.replace(
    /Ngày 10\/01 cứ dậy trễ — hồ đi từ sáng 09\/01 rồi\./,
    "Mai còn cả ngày Hàng Châu nữa — ngủ cho đã, Linh Ẩn không cần dậy quá sớm.",
  );
  html = html.replace(
    /10日可以晚起，西湖已经在9日上午走完。/,
    "明天还有一整天杭州——睡够，灵隐不必太早。",
  );
  html = html.replace(
    /Sleep in on 10 Jan — the lake is already done on the morning of the 9th\./,
    "Another full Hangzhou day tomorrow — sleep well; Lingyin doesn’t need a crack-of-dawn start.",
  );

  // Hotel night note Trip.com 09–10 → 09–11 for Hangzhou stay in D1 check-in row
  html = html.replace(/Trip\.com 09–10\/01/g, "Trip.com 09–11/01");

  return html;
}

function removeDihangRow(html) {
  return html.replace(
    /<tr><td>—<\/td><td>—<\/td><td><b><span class="i18n"><span class="vi">Không ở Dihang<\/span>[\s\S]*?<\/tr>\n/,
    "",
  );
}

function brandPlan2(html) {
  html = html.replaceAll(
    "Kế hoạch 1 — Hàng Châu, Ô Trấn, Thượng Hải",
    "Kế hoạch 2 — Hàng Châu 2 ngày, Ô Trấn, Thượng Hải",
  );
  html = html.replaceAll("行程一：杭州、乌镇、上海", "行程二：杭州两天、乌镇、上海");
  html = html.replaceAll(
    "Plan 1 — Hangzhou, Wuzhen, Shanghai",
    "Plan 2 — Hangzhou 2 days, Wuzhen, Shanghai",
  );
  html = html.replaceAll("08–14/01/2027", "08–15/01/2027");
  html = html.replaceAll("08–14/01/2027", "08–15/01/2027");

  // Immigration return flight
  html = html.replace(
    /VJ6011<\/b> PVG 02:20 14\/01/g,
    "VJ6011</b> PVG 02:20 15/01",
  );

  // Hero first night soft
  html = html.replace(
    /Bắt xe buýt đêm sang Hồng Kiều luôn, khỏi ở khách sạn sân bay\./,
    "Đêm đầu chưa chốt (xe đêm hoặc nghỉ tạm) — ưu tiên tới Hàng Châu sớm ngày 09/01.",
  );
  html = html.replace(
    /坐夜宵线去虹桥，不住机场酒店。/,
    "首晚未定（夜宵线或临停）——优先9日早到杭州。",
  );
  html = html.replace(
    /Night bus to Hongqiao, no airport hotel\./,
    "First night not locked (night bus or short stay) — aim to reach Hangzhou early on 9 Jan.",
  );

  // Pillars
  html = html.replace(
    /Hồ Tây một buổi sáng/,
    "Hồ Tây + Linh Ẩn hai ngày",
  );

  // Hotels immigration card Hangzhou nights
  html = html.replace(
    /09–10\/01 Hàng Châu, gần Hồ Tây/,
    "09–11/01 Hàng Châu, gần Hồ Tây (2 đêm)",
  );
  html = html.replace(/1月9–10日 杭州西湖/, "1月9–11日 杭州西湖（两晚）");
  html = html.replace(/9–10 Jan · Hangzhou, West Lake/, "9–11 Jan · Hangzhou, West Lake (2 nights)");

  html = html.replace(
    /10–11\/01 Ô Trấn Tây Sách/,
    "11–12/01 Ô Trấn Tây Sách",
  );
  html = html.replace(/1月10–11日 乌镇西栅/, "1月11–12日 乌镇西栅");
  html = html.replace(/10–11 Jan · Wuzhen Xizha/, "11–12 Jan · Wuzhen Xizha");

  html = html.replace(/11–13\/01 Thượng Hải/, "12–14/01 Thượng Hải");
  html = html.replace(/1月11–13日 上海/, "1月12–14日 上海");
  html = html.replace(/11–13 Jan · Shanghai/, "12–14 Jan · Shanghai");

  // Hotel table dates (after remove Dihang)
  html = html.replace(
    /<tr><td>09\/01\/2027<\/td><td>10\/01\/2027<\/td><td>如家精选/,
    "<tr><td>09/01/2027</td><td>11/01/2027</td><td>如家精选",
  );
  // Price note: ~2 nights — keep same unit price *2 approx 1.286.258
  html = html.replace(
    /(如家精选（杭州西湖湖滨定安路地铁站店）<br>Homeinn Selected Ding'an<\/td><td>)643\.129₫/,
    "$1≈ 1.286.000₫ / 2 đêm",
  );

  // Soften Plan 1 "đã chốt" first night if present in copy
  html = html.replace(
    /Đêm đầu kế hoạch 1 \(đã chốt\)/,
    "Đêm đầu kế hoạch 2 (chưa chốt)",
  );
  html = html.replace(/方案1首晚（已定）/, "方案2首晚（未定）");
  html = html.replace(/Plan 1 first night \(confirmed\)/, "Plan 2 first night (not locked)");

  // Disney date references that stayed in head (overview keep table)
  html = html.replace(/Disney 12\/01/g, "Disney 13/01");
  html = html.replace(/Disney on 12 Jan/g, "Disney on 13 Jan");
  html = html.replace(/1月12日的迪士尼/g, "1月13日的迪士尼");
  html = html.replace(/ngày 12\/01/g, "ngày 13/01");
  html = html.replace(/Ngày đã chốt 12\/01/g, "Ngày đã chốt 13/01");
  html = html.replace(/日期已定1月12日/g, "日期已定1月13日");
  html = html.replace(/Date locked 12 Jan/g, "Date locked 13 Jan");

  // Copy box period
  html = html.replace(/08–14\/01\/2027/g, "08–15/01/2027");
  html = html.replace(/2027年1月8–14日/g, "2027年1月8–15日");
  html = html.replace(/8–14 Jan 2027/g, "8–15 Jan 2027");

  // Themes / keep table Hangzhou note
  html = html.replace(
    /Một buổi sáng bờ đông là đủ/,
    "Hai ngày: hồ + Linh Ẩn / Long Tĩnh",
  );

  return html;
}

function replaceFoodRow(html, day, mealVi, newCellsInner) {
  const startToken = `<tr><td>${day}</td><td><span class="i18n"><span class="vi">${mealVi}</span>`;
  const start = html.indexOf(startToken);
  if (start < 0) {
    console.warn("food row missing", day, mealVi);
    return html;
  }
  const end = html.indexOf("</tr>", start);
  return html.slice(0, start) + `<tr>${newCellsInner}</tr>` + html.slice(end + 5);
}

function patchFoodTable(html) {
  html = replaceFoodRow(
    html,
    "09/01",
    "Trưa",
    `<td>09/01</td><td>${i18n("Trưa", "午", "Lunch")}</td><td>外婆家 / Gramma House</td><td>${i18n("红烧肉, 龙井虾仁, 粉丝虾, 茶香鸡", "红烧肉、龙井虾仁、粉丝虾、茶香鸡", "Braised pork, Longjing shrimp, vermicelli shrimp, tea chicken")}</td><td>180.000</td><td>2</td><td>360.000</td><td>${i18n("Ưu tiên 西湖断桥 北山路10号; backup IN77 / 南山路147", "优先断桥北山路10号", "Prefer Duanqiao 北山路10号; backup IN77 / 南山路147")}</td>`,
  );
  html = replaceFoodRow(
    html,
    "09/01",
    "Tối",
    `<td>09/01</td><td>${i18n("Tối", "晚", "Dinner")}</td><td>绿茶餐厅 IN77</td><td>${i18n("粉丝裹虾, 烤肉/烤鸡, 面包诱惑", "粉丝裹虾、烤肉烤鸡、面包诱惑", "Vermicelli prawns, roast combo, bread temptation")}</td><td>200.000</td><td>2</td><td>400.000</td><td>${i18n("延安路258号 C2 3F · đến sớm", "延安路258号C2 3F · 早点到", "延安路258 C2 3F · arrive early")}</td>`,
  );

  const insert = `<tr><td>10/01</td><td>${i18n("Sáng", "早", "Breakfast")}</td><td>${i18n("Khách sạn Hàng Châu", "杭州酒店", "Hangzhou hotel")}</td><td>${i18n("Ngủ bù + ăn nóng", "补觉后热食", "Sleep in + hot food")}</td><td>50.000</td><td>2</td><td>100.000</td><td></td></tr>
<tr><td>10/01</td><td>${i18n("Trưa", "午", "Lunch")}</td><td>新周记 / 齐心</td><td>${i18n("Đông Pha, tôm xì dầu hoặc mì local", "东坡肉、酱油虾或面", "Dongpo, soy prawns or local noodles")}</td><td>180.000</td><td>2</td><td>360.000</td><td>${i18n("十五奎巷3号 hoặc 齐心老弄堂面馆", "十五奎巷3号或齐心老弄堂", "3 Shiwukui Lane or Qixin noodles")}</td></tr>
<tr><td>10/01</td><td>${i18n("Chiều", "下午", "Afternoon")}</td><td>龙井村</td><td>${i18n("Trà Long Tĩnh", "龙井茶", "Longjing tea")}</td><td>120.000</td><td>2</td><td>240.000</td><td>${i18n("Hỏi giá trước khi mua lá", "买茶叶先问价", "Ask before buying leaves")}</td></tr>
<tr><td>10/01</td><td>${i18n("Tối", "晚", "Dinner")}</td><td>${i18n("Hồ Tân", "湖滨", "Hubin")}</td><td>${i18n("新白鹿 hoặc mì 齐心", "新白鹿或齐心面", "Xinbailu or Qixin noodles")}</td><td>180.000</td><td>2</td><td>360.000</td><td>${i18n("Đổi món sau 绿茶 tối 09/01", "换口味，昨晚已吃绿茶", "Different from Green Tea on 9 Jan")}</td></tr>
`;
  const idx = html.indexOf('<tr><td>11/01</td><td><span class="i18n"><span class="vi">Sáng</span>');
  if (idx > 0) html = html.slice(0, idx) + insert + html.slice(idx);
  else console.warn("11/01 breakfast insert point missing");

  html = html.replace(
    `<p><b><span class="i18n"><span class="vi">Trưa — Hồ Tây / Hồ Tân</span>`,
    `<p><b>${i18n("Kế hoạch 2 — đã chốt 09/01", "方案二 — 9日已定", "Plan 2 — locked for 9 Jan")}</b></p>
<ul>
<li><b>Trưa · 外婆家 / Gramma House</b> — ${i18n("ưu tiên 西湖断桥店 北山路10号 (view hồ); backup IN77 hoặc 南山路147. Gọi 外婆红烧肉, 龙井虾仁, 蒜蓉粉丝虾, 茶香鸡 / 叫花鸡 hỏi trước. Tầm 60–100 tệ.", "优先断桥北山路10号；备选IN77或南山路147。", "Prefer Duanqiao 北山路10号; backup IN77 or 南山路147.")}</li>
<li><b>Tối · 绿茶餐厅</b> 湖滨银泰IN77 C2 3F, 延安路258号 — ${i18n("粉丝裹虾, 葱香烤肉/烤鸡合拼, 面包诱惑. 70–100 tệ. Đến sớm.", "粉丝裹虾、烤肉烤鸡、面包诱惑。早点到。", "Vermicelli prawns, roast combo, bread temptation. Arrive early.")}</li>
<li><b>${i18n("Gợi ý thêm Hàng Châu", "杭州加推", "More Hangzhou picks")}</b> — 新周记鼓楼 · 齐心老弄堂面馆 · 新白鹿 · 黄油与面包 (vặt) · 初壹 CHUYI (matcha) · Molly / HeyTea.</li>
</ul>
<p><b><span class="i18n"><span class="vi">Trưa — Hồ Tây / Hồ Tân</span>`,
  );

  return html;
}

function insertHangzhouDay2(html) {
  const soft = html.indexOf('<span class="vi">D3 11/1');
  if (soft < 0) {
    const sample = [...html.matchAll(/<span class="vi">D[0-9] [^<]+/g)].slice(0, 10).map((m) => m[0]);
    console.log("day chips after shift:", sample);
    throw new Error("insert point D3 not found");
  }
  const idx = html.lastIndexOf("<article", soft);
  if (idx < 0) throw new Error("article before D3 not found");
  return html.slice(0, idx) + HANGZHOU_D2 + html.slice(idx);
}

function fixWeekdayChips(html) {
  // After shift: D3 11/1 was Mon→ now should be Tue 11? Wait:
  // Original D2 10/1 Sun → became D3 11/1 Mon ✓ (chip may still say CN from before shift of date only)
  // The shift changed 10/1→11/1 in chips "D3 11/1" - original was "D2 10/1 CN" → after day renumber "D3 10/1 CN" then date shift "D3 11/1 CN" but 11 Jan 2027 is Monday not Sunday!
  // Need to fix weekdays:
  // 11/01/2027 = Friday? Let me check: 8 Jan 2027 is Friday (user said tối thứ 6 8/1)
  // 9 Sat, 10 Sun, 11 Mon, 12 Tue, 13 Wed, 14 Thu, 15 Fri
  // So D3 11/1 should be T2 (Mon), D4 12/1 T3, D5 13/1 T4, D6 14/1 T5
  html = html.replace(/D3 11\/1 CN/g, "D3 11/1 T2");
  html = html.replace(/D3 1\/11 日/g, "D3 1/11 一");
  html = html.replace(/D3 Sun 11 Jan/g, "D3 Mon 11 Jan");
  html = html.replace(/D4 12\/1 T2/g, "D4 12/1 T3");
  html = html.replace(/D4 1\/12 一/g, "D4 1/12 二");
  html = html.replace(/D4 Mon 12 Jan/g, "D4 Tue 12 Jan");
  html = html.replace(/D5 13\/1 T3/g, "D5 13/1 T4");
  html = html.replace(/D5 1\/13 二/g, "D5 1/13 三");
  html = html.replace(/D5 Tue 13 Jan/g, "D5 Wed 13 Jan");
  html = html.replace(/D6 14\/1 T4/g, "D6 14/1 T5");
  html = html.replace(/D6 1\/14 三/g, "D6 1/14 四");
  html = html.replace(/D6 Wed 14 Jan/g, "D6 Thu 14 Jan");

  // Heading weekdays
  html = html.replace(/Ngày 3 – Chủ nhật 11\/01/g, "Ngày 3 – Thứ 2 11/01");
  html = html.replace(/第3天 周日1月11日/g, "第3天 周一1月11日");
  html = html.replace(/Day 3 – Sun 11 Jan/g, "Day 3 – Mon 11 Jan");
  html = html.replace(/Ngày 4 – Thứ 2 12\/01/g, "Ngày 4 – Thứ 3 12/01");
  html = html.replace(/第4天 周一1月12日/g, "第4天 周二1月12日");
  html = html.replace(/Day 4 – Mon 12 Jan/g, "Day 4 – Tue 12 Jan");
  html = html.replace(/Ngày 5 – Thứ 3 13\/01/g, "Ngày 5 – Thứ 4 13/01");
  html = html.replace(/第5天 周二1月13日/g, "第5天 周三1月13日");
  html = html.replace(/Day 5 – Tue 13 Jan/g, "Day 5 – Wed 13 Jan");
  html = html.replace(/Ngày 6 – Thứ 4 14\/01/g, "Ngày 6 – Thứ 5 14/01");
  html = html.replace(/第6天 周三1月14日/g, "第6天 周四1月14日");
  html = html.replace(/Day 6 – Wed 14 Jan/g, "Day 6 – Thu 14 Jan");

  // Yuyuan Wednesday closed tip was for 13/01 Wed - now 14/01 is Thursday
  html = html.replace(/Thứ 4 14\/01: vườn cổ/g, "Thứ 5 14/01: vườn cổ");
  html = html.replace(/1月14日周三/g, "1月14日周四");
  html = html.replace(/Wednesday 14 Jan/g, "Thursday 14 Jan");

  return html;
}

function patchSights(html) {
  // Add Lingyin row if sights table exists
  if (html.includes("灵隐") || html.includes("Linh Ẩn")) return html;
  const row = `<tr><td>${i18n("Linh Ẩn / Phi Lai Phong", "灵隐寺 / 飞来峰", "Lingyin / Feilai Feng")}</td><td>${i18n("Book mini-program trước; miễn phí vào khu", "小程序预约；景区免费", "Book mini-program; scenic area free")}</td><td>07:30–17:30</td><td>0</td><td>2</td><td>0</td><td>${i18n("Sáng 10/01", "1月10日上午", "Morning 10 Jan")}</td></tr>
`;
  const anchor = html.indexOf("<tr><td><span class=\"i18n\"><span class=\"vi\">Hồ Tây");
  if (anchor > 0) {
    const end = html.indexOf("</tr>", anchor) + 5;
    html = html.slice(0, end) + "\n" + row + html.slice(end);
  }
  return html;
}

// --- run ---
let html = p1;
html = removeDihangRow(html);
html = shiftAfterHangzhou(html);
html = insertHangzhouDay2(html);
html = patchDay1Hangzhou(html);
html = brandPlan2(html);
html = patchFoodTable(html);
html = fixWeekdayChips(html);
html = patchSights(html);

// Head section flight already in brand; also fix meta in immig if still 14
html = html.replace(/PVG 02:20 14\/01/g, "PVG 02:20 15/01");

fs.writeFileSync(path.join(root, "src/pages/plan-2.body.html"), html, "utf8");
console.log("wrote plan-2.body.html", html.length);

// Plan 1: remove Dihang row + soften lock language
let p1out = removeDihangRow(p1);
p1out = p1out.replace(
  /Đêm đầu kế hoạch 1 \(đã chốt\)/,
  "Đêm đầu kế hoạch 1 (chưa chốt hẳn)",
);
p1out = p1out.replace(/方案1首晚（已定）/, "方案1首晚（暂定）");
p1out = p1out.replace(/Plan 1 first night \(confirmed\)/, "Plan 1 first night (provisional)");
fs.writeFileSync(path.join(root, "src/pages/plan-1.body.html"), p1out, "utf8");
console.log("updated plan-1 (removed Dihang row)");
