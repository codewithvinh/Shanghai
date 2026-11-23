import fs from "fs";

function mdTable(headers, rows) {
  const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, "<br>");
  const line = (cells) => `| ${cells.map(esc).join(" | ")} |`;
  return [
    line(headers),
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => line(r)),
  ].join("\n");
}

function daySection(d) {
  const headers = [
    "Thời gian",
    "Hoạt động",
    "Địa điểm",
    "Nội dung",
    "Chi phí",
    "Đơn vị",
    "Số lượng",
    "Ghi chú",
    "Tham khảo",
  ];
  const rows = d.rows.map((r) => {
    const cells = [...r];
    while (cells.length < 9) cells.push("");
    return cells.slice(0, 9);
  });
  return [
    `### ${d.title}`,
    "",
    d.city ? `**Khu vực:** ${d.city}` : "",
    "",
    d.blurb || "",
    "",
    mdTable(headers, rows),
    "",
  ]
    .filter((x, i, a) => !(x === "" && a[i - 1] === ""))
    .join("\n");
}

function writePlan({ file, title, subtitle, nightsNote, hotelsNote, foodNote, extract, disneyDate, yuyuanDate, wuzhenOutDate, hangzhouNights, checklistHotels, extraNotes }) {
  const days = extract.days.filter((d) => d.title.startsWith("Ngày"));
  const hotelHeaders = ["Ngày nhận", "Ngày trả", "Khách sạn", "Giá", "Ghi chú"];
  const budgetHeaders = ["Hạng mục", "Dự kiến", "Thực tế", "Lệch", "Ghi chú"];

  const body = `# ${title}

${subtitle}

**Thời gian:** 08/01/2027 – 14/01/2027 (bay đêm 08/01, hạ cánh 01:15 ngày 09/01; về HAN 05:15 ngày 14/01)
**Địa điểm:** Thượng Hải (PVG) → Hàng Châu → Ô Trấn (Tây Sách) → Thượng Hải
**Số lượng người:** 2 người lớn — **Mr NGUYEN THANH VINH** · **Ms NGUYEN THI HA TRANG**
**Phương tiện:** Vietjet Air VJ6010/VJ6011 Deluxe · tàu cao tốc · xe khách Tây Sách→Nam Thượng Hải · metro · Didi/taxi
**Ngân sách dự kiến:** 20.000.000 VNĐ/người (đã gồm vé máy bay **dự kiến** 5.480.000)

Tỷ giá: **1 CNY ≈ 3.873 VND** (Trip.com). Giá KS tham chiếu Trip ~28/10/2026 (đã gồm thuế & phí), 1 phòng / 2 người — **dynamic**, check lại trước khi đặt.

**Giờ bay VJ6010:** **21:25 = giờ Hà Nội (UTC+7)** · **01:15 = giờ Thượng Hải (UTC+8)**. VJ6011 về: 02:20 PVG → 05:15 HAN.

${nightsNote}

> Đồng bộ với \`public/${file.includes("plus") || file.includes("plan-2") ? "shanghai-plan-2" : "shanghai-plan"}.html\` (build từ \`src/pages/\`).

---

## 1. LỊCH TRÌNH CHI TIẾT

${days.map(daySection).join("\n\n")}

---

## 2. LƯU TRÚ

${hotelsNote}

${mdTable(hotelHeaders, extract.hotels)}

**Địa chỉ:**
- Hàng Châu: 延安路126号耀江大厦A座 · metro 定安路 C · 0571-86077977 · gửi vali ~08:00, nhận 14:00
- Ô Trấn: **乌镇民宿** — nhận tại **西栅游客服务中心** · +86-573-88731088 · Didi: \`乌镇西栅游客服务中心\`
- Thượng Hải: 江西中路135弄11号 · +86-21-63239966 · trả phòng 12:00

${hangzhouNights}

---

## 3. ĂN UỐNG (tóm tắt)

${foodNote}

Chi tiết từng bữa nằm trong bảng ngày ở mục 1 (đã khớp HTML). Cung Yến **không** vào ngân sách cốt lõi.

**Chốt Hàng Châu (Plan HTML):**
- Trưa 09/01: **外婆家** ưu tiên 西湖断桥 北山路10号 (backup IN77 / 南山路147)
- Tối 09/01: **绿茶** 湖滨IN77 C2 3F 延安路258号 *(Plan 2 chốt; Plan 1: Vũ Lâm optional hoặc 绿茶/外婆家 nếu mệt)*
- Plan 2 ngày 10/01: **không** làng trà Long Tĩnh; trưa 新周记; chiều **杭州博物馆**; tối 齐心 / 新白鹿

---

## 4. NGÂN SÁCH / NGƯỜI

${mdTable(budgetHeaders, extract.budget)}

**Trần 2 người:** 40.000.000₫ (vé khứ hồi 10.960.000 đã nằm trong đó).

---

## 5. CHECKLIST

- [ ] Vé máy bay VJ6010/VJ6011 (đã có giá, chưa xuất)
- [ ] Tàu 12306/Trip: Hồng Kiều → Hàng Châu Đông **06:20–06:45** ngày 09/01 (**không** 05:52)
- [ ] Tàu Hàng Châu Đông → Đồng Hương ngày đi Ô Trấn (${wuzhenOutDate === "11/01" ? "11/01" : "10/01"})
- [ ] Xe khách cổng Tây Sách → Nam Thượng Hải chuyến **12:50** ngày ${wuzhenOutDate} (桐乡出行 / 巴巴快巴)
- [ ] ${checklistHotels}
- [ ] Visa L dịch vụ 2.300.000₫/người · 2 eSIM Klook 7 ngày · Alipay gắn thẻ
- [ ] Disney ${disneyDate} · Dự Viên đêm ${yuyuanDate}

---

## 6. GHI CHÚ

- Đêm đầu: **không Dihang** — Late Night Bus 守航夜宵线 T2 → Hồng Kiều → tàu Hàng Châu Đông.
- Ngủ **trong** Tây Sách = miễn vé 150 CNY; Didi tới trung tâm khách, **không** cổng Nam.
- Disney ${disneyDate}/2027 giờ chưa công bố; tham chiếu 499 CNY ngày thường 2026.
- Trip.com (17/11/2026): Homeinn Định An có thể **chưa mở book** xa — giữ quote 643.129₫/đêm làm ước tính.
${extraNotes}
`;

  fs.writeFileSync(file, body.replace(/\n{3,}/g, "\n\n"));
  console.log("wrote", file, "days", days.length);
}

const p1 = JSON.parse(fs.readFileSync("tools/_md-extract-p1.json", "utf8"));
const p2 = JSON.parse(fs.readFileSync("tools/_md-extract-p2.json", "utf8"));

writePlan({
  file: "plans/hangzhou-first.md",
  title: "KẾ HOẠCH 1 — HÀNG CHÂU → Ô TRẤN → THƯỢNG HẢI",
  subtitle:
    "**Plan 1 / HTML:** `shanghai-plan.html` — Hàng Châu 1 đêm (09–10/01) → Ô Trấn (10–11) → Thượng Hải (11–13) → về 14/01.",
  nightsNote:
    "**Đêm đầu đã chốt:** Ra cửa ~03:00 (giờ TQ) → Late Night Bus → Hồng Kiều → tàu G Hàng Châu Đông khung **06:20–06:45**. **Không ở Dihang.** Disney **12/01**.",
  hotelsNote: "3 khách sạn (không Dihang). Giá live tham chiếu Trip.",
  foodNote: "**≈ 2.440.000₫/người** (đã gồm bánh Ô Trấn 50k). Tối 13/01 ăn ở Dự Viên.",
  extract: p1,
  disneyDate: "12/01",
  yuyuanDate: "13/01",
  wuzhenOutDate: "11/01",
  hangzhouNights: "**Hàng Châu:** 1 đêm (09–10/01) = **643.129₫**.",
  checklistHotels:
    "Đặt 3 KS Trip.com: Homeinn Hàng Châu 09–10 · Wuzhen Guest House 10–11 · Bund 11–13",
  extraNotes:
    "- Ngân sách KS/người **2.557.000₫** (= 5.114.039₫ / 2: HC 643.129 + Guest House 1.861.007 + Bund 2.611.260).\n- Tổng ≈ **18.344.000₫/người**.",
});

writePlan({
  file: "plans/hangzhou-plus.md",
  title: "KẾ HOẠCH 2 — HÀNG CHÂU THÊM 1 NGÀY (+ BẢO TÀNG)",
  subtitle:
    "**Plan 2 / HTML:** `shanghai-plan-2.html` — cùng lộ Hàng Châu trước như Plan 1, **thêm 1 ngày Hàng Châu** (09–11/01 = 2 đêm). Ngày 10/01: **dạo thành phố + Bảo tàng Hàng Châu**, **không** làng trà Long Tĩnh. Ô Trấn 11–12 · Thượng Hải 12–14 · Disney **13/01**.",
  nightsNote:
    "**Đêm đầu đã chốt:** giống Plan 1 — Late Night Bus → Hồng Kiều → tàu Hàng Châu ~06:20. **Không Dihang.** Khác Plan 1: Hàng Châu **2 đêm**, Disney lệch sang **13/01**, Dự Viên tối **14/01** trước giờ bay.",
  hotelsNote:
    "3 khách sạn. Hàng Châu = **643.129₫ × 2 đêm = 1.286.258₫** (ước tính; Trip 17/11/2026 chưa mở book xa).",
  foodNote:
    "**≈ 2.320.000₫/người** (đã gồm bánh Ô Trấn 50k; **đã bỏ** trà Long Tĩnh chiều 10/01). Tối 14/01 ăn ở Dự Viên.",
  extract: p2,
  disneyDate: "13/01",
  yuyuanDate: "14/01",
  wuzhenOutDate: "12/01",
  hangzhouNights:
    "**Hàng Châu:** 2 đêm (09–11/01) = **1.286.258₫**. **Ô Trấn:** 11–12/01. **Bund:** 12–14/01.",
  checklistHotels:
    "Đặt 3 KS Trip.com: Homeinn Hàng Châu **2 đêm** 09–11 · Wuzhen Guest House 11–12 · Bund 12–14",
  extraNotes:
    "- Ngân sách KS/người **2.879.000₫** (= 5.758.525₫ / 2).\n- Tổng ≈ **18.546.000₫/người** (còn dư ~1,45 triệu dưới trần 20 triệu).\n- **Không còn bản “Ô Trấn trước”** trong HTML — file cũ `wuzhen-first.md` đã thay bằng plan này.",
});

// remove obsolete wuzhen-first
if (fs.existsSync("plans/wuzhen-first.md")) {
  fs.unlinkSync("plans/wuzhen-first.md");
  console.log("removed plans/wuzhen-first.md");
}
