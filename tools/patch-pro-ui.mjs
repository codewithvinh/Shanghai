import fs from "fs";

const path = new URL("../public/hangzhou-trip.html", import.meta.url);
let html = fs.readFileSync(path, "utf8").replace(/\r\n/g, "\n");

function rep(oldStr, newStr, label) {
  if (!html.includes(oldStr)) {
    console.error("MISS:", label);
    const head = oldStr.slice(0, 80).replace(/\n/g, "\\n");
    console.error(" head:", head);
    process.exit(1);
  }
  html = html.replace(oldStr, newStr);
  console.log("OK:", label);
}

function repAll(oldStr, newStr, label) {
  const n = html.split(oldStr).length - 1;
  if (!n) {
    console.error("MISS:", label);
    process.exit(1);
  }
  html = html.split(oldStr).join(newStr);
  console.log("OK:", label, "x" + n);
}

// —— CSS: flight ticket + map + dock 5 ——
rep(
  `    .dock {
      position: fixed;
      left: 50%;
      bottom: 0;
      z-index: 50;
      transform: translateX(-50%);
      width: 100%;
      max-width: 760px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));`,
  `    .flight {
      margin: 10px 0 14px;
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(145deg, #1a2332 0%, #243044 55%, #1e2a3a 100%);
      color: #f4f7fb;
      box-shadow: var(--shadow);
      border: 1px solid rgba(255,255,255,.08);
    }

    .flight-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 14px 8px;
      border-bottom: 1px dashed rgba(255,255,255,.14);
    }

    .flight-airline {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .flight-airline .mark {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: #ee1c25;
      display: grid;
      place-items: center;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: -.02em;
      flex: none;
    }

    .flight-airline strong {
      display: block;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: -.01em;
    }

    .flight-airline span {
      display: block;
      font-size: 11px;
      color: rgba(244,247,251,.68);
      margin-top: 1px;
    }

    .flight-code {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: .04em;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .flight-route {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 8px;
      align-items: center;
      padding: 14px 14px 10px;
    }

    .flight-city {
      min-width: 0;
    }

    .flight-city.arr {
      text-align: right;
    }

    .flight-city .iata {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: .04em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    .flight-city .name {
      margin-top: 4px;
      font-size: 11px;
      color: rgba(244,247,251,.7);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .flight-city .time {
      margin-top: 8px;
      font-size: 20px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      letter-spacing: -.02em;
    }

    .flight-city .date {
      margin-top: 2px;
      font-size: 11px;
      color: rgba(244,247,251,.68);
    }

    .flight-mid {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: rgba(244,247,251,.75);
      min-width: 72px;
    }

    .flight-mid .line {
      width: 56px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
      position: relative;
    }

    .flight-mid svg {
      width: 18px;
      height: 18px;
      color: #f4783b;
    }

    .flight-mid small {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .02em;
      text-transform: uppercase;
      color: rgba(244,247,251,.55);
    }

    .flight-meta {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      padding: 0 14px 14px;
    }

    .flight-meta div {
      background: rgba(255,255,255,.06);
      border-radius: 10px;
      padding: 8px 10px;
    }

    .flight-meta dt {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: rgba(244,247,251,.5);
      margin: 0 0 3px;
    }

    .flight-meta dd {
      margin: 0;
      font-size: 12px;
      font-weight: 700;
    }

    .map-board {
      margin: 0 16px 20px;
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
      background: var(--paper-2);
      box-shadow: var(--shadow-sm);
    }

    .map-frame {
      position: relative;
      height: min(52vw, 280px);
      background: #e8eef2;
    }

    .map-frame iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }

    .map-places {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding: 10px 12px;
      border-top: 1px solid var(--line);
      scrollbar-width: none;
    }

    .map-places::-webkit-scrollbar { display: none; }

    .map-places button {
      flex: none;
      border: 1px solid var(--line);
      background: #fff;
      color: var(--ink-2);
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      min-height: 36px;
    }

    .map-places button.is-on {
      background: var(--peach);
      border-color: var(--orange-2);
      color: var(--orange-deep);
    }

    .map-places button svg {
      width: 14px;
      height: 14px;
    }

    .map-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding: 0 12px 12px;
    }

    .map-actions .btn {
      justify-content: center;
      text-align: center;
      text-decoration: none;
    }

    .map-note {
      margin: 0 16px 8px;
      font-size: 13px;
      color: var(--mist);
    }

    .dock {
      position: fixed;
      left: 50%;
      bottom: 0;
      z-index: 50;
      transform: translateX(-50%);
      width: 100%;
      max-width: 760px;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));`,
  "css-flight-map-dock"
);

rep(
  `    .dock a svg,
    .dock button svg {
      width: 22px;
      height: 22px;
    }`,
  `    .dock a svg,
    .dock button svg {
      width: 20px;
      height: 20px;
    }

    .dock span {
      font-size: 9px;
      letter-spacing: -.01em;
    }`,
  "dock-icon-size"
);

// —— Icons: itinerary + utensils alias consistency ——
rep(
  `    <symbol id="i-drink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l1 6H7L8 2z"/><path d="M7 8l1.2 12.2A2 2 0 0 0 10.2 22h3.6a2 2 0 0 0 2-1.8L17 8"/><path d="M12 12v4"/></symbol>
  </svg>`,
  `    <symbol id="i-drink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l1 6H7L8 2z"/><path d="M7 8l1.2 12.2A2 2 0 0 0 10.2 22h3.6a2 2 0 0 0 2-1.8L17 8"/><path d="M12 12v4"/></symbol>
    <symbol id="i-itin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></symbol>
    <symbol id="i-cost" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15.5 9.5c0-1.4-1.6-2.5-3.5-2.5S8.5 8.1 8.5 9.5 10.1 12 12 12s3.5 1.1 3.5 2.5S13.9 17 12 17s-3.5-1.1-3.5-2.5"/></symbol>
  </svg>`,
  "icons-itin-cost"
);

// —— Mast / hero / stats: professional tone ——
rep(
  `      <p class="lede" style="padding:4px 0 12px;color:var(--ink-2);font-size:14px"><i>Đi một vòng từ hồ thơ mộng đến phố cổ lên đèn, rồi kết thúc bằng một ngày quẩy hết mình ở Disney!</i><br><br>Một chuyến đi 8 ngày 7 đêm: vừa ngắm cảnh, ăn ngon, săn ảnh, vừa có một ngày dành trọn cho Disney. Lịch trình có tính toán để vui hết cỡ nhưng vẫn chừa sức… và chừa tiền mua trà!</p>
    </header>
    <div class="pwa-banner" id="pwa-banner" role="region" aria-label="Cài app">
      <div class="pwa-ico" aria-hidden="true"><svg class="ico"><use href="#i-download"></use></svg></div>
      <p id="pwa-banner-text">Cài sổ tay lên màn hình chính để mở như app và dùng offline khi không có mạng.</p>
      <button type="button" class="btn" id="pwa-install">Cài app</button>
      <button type="button" class="btn btn-ghost" id="pwa-dismiss" aria-label="Đóng">✕</button>
    </div>
    <p class="pwa-status" id="pwa-status" hidden></p>`,
  `      <p class="lede" style="padding:4px 0 12px;color:var(--ink-2);font-size:14px">Hành trình 8 ngày 7 đêm: Hàng Châu (Hồ Tây) → Ô Trấn Tây Sách → Thượng Hải (Bến · Disney). Lịch trình cân bằng tham quan, ẩm thực và nhịp nghỉ — phù hợp cặp đôi, không kèm trẻ em.</p>
    </header>
    <div class="pwa-banner" id="pwa-banner" role="region" aria-label="Cài app" hidden>
      <div class="pwa-ico" aria-hidden="true"><svg class="ico"><use href="#i-download"></use></svg></div>
      <p id="pwa-banner-text">Thêm vào màn hình chính để mở nhanh trên điện thoại.</p>
      <button type="button" class="btn" id="pwa-install">Cài</button>
      <button type="button" class="btn btn-ghost" id="pwa-dismiss" aria-label="Đóng">✕</button>
    </div>
    <p class="pwa-status" id="pwa-status" hidden></p>`,
  "mast-lede-pwa"
);

rep(
  `      <figcaption>
        <strong>Sổ tay bỏ túi — bấm copy là đưa tài xế</strong>
        <span>Địa chỉ tiếng Trung · Amap · Google Maps · ảnh minh họa</span>
      </figcaption>
    </figure>

    <div class="stats">
      <div class="stat"><b><svg class="ico"><use href="#i-plane"></use></svg> Bay</b><span>VJ6010 Deluxe tối 07/01 Hà Nội đến sân bay Phố Đông nhà ga 2 sáng 08/01 + VJ6011 Deluxe 02:20 14/01 — 10.560k / 2 người, chưa xuất</span></div>
      <div class="stat"><b><svg class="ico"><use href="#i-moon"></use></svg> Đêm đầu</b><span>Không thuê khách sạn gần sân bay để tiết kiệm chi phí. Đi xe buýt đêm 守航夜宵线 đến Hồng Kiều, sau đó bắt tàu đi Hàng Châu.</span></div>
      <div class="stat"><b><svg class="ico"><use href="#i-hotel"></use></svg> Lưu trú</b><span>Homeinn Định An 2 đêm (08–10/01) · Tây Sách 1 đêm · khu vực Bến Thượng Hải 2 đêm — chưa đặt</span></div>
      <div class="stat"><b><svg class="ico"><use href="#i-wallet"></use></svg> Ngân sách</b><span>Trần 20 triệu/người · dự kiến chi ~18,7 triệu · còn dư khoảng 1,29 triệu để tha hồ chọn trà</span></div>
    </div>

    <div class="route">
      <b>Hà Nội</b><i>–</i><b>Phố Đông</b><i>–</i><b>Hàng Châu</b><i>–</i><b>Ô Trấn</b><i>–</i><b>Thượng Hải</b><i>–</i><b>Hà
        Nội</b>
    </div>
    <p class="note">Sổ tay iPhone (sao chép địa chỉ và Amap): copy cả thư mục <b>public</b> (file này và folder <b>img</b>) vào Files, rồi mở HTML
      bằng
      Safari. Giữ phím địa chỉ tiếng Trung cũng sao chép được nếu nút Copy không ăn trên file://.</p>`,
  `      <figcaption>
        <strong>Hàng Châu · Ô Trấn · Thượng Hải</strong>
        <span>07–14/01/2027 · 2 khách · VietJet Deluxe</span>
      </figcaption>
    </figure>

    <div class="stats">
      <div class="stat"><b><svg class="ico"><use href="#i-plane"></use></svg> Bay</b><span>VJ6010 HAN→PVG 07/01 21:25 · VJ6011 PVG→HAN 14/01 02:20 · Deluxe · 10.560.000đ / 2 khách</span></div>
      <div class="stat"><b><svg class="ico"><use href="#i-moon"></use></svg> Đêm đầu</b><span>Không lưu trú gần sân bay. Xe buýt đêm 守航夜宵线 Phố Đông → Hồng Kiều, tàu cao tốc sáng tới Hàng Châu.</span></div>
      <div class="stat"><b><svg class="ico"><use href="#i-hotel"></use></svg> Lưu trú</b><span>Homeinn Định An 2 đêm (08–10/01) · Tây Sách 1 đêm · khu Bến Thượng Hải 2 đêm</span></div>
      <div class="stat"><b><svg class="ico"><use href="#i-wallet"></use></svg> Ngân sách</b><span>Trần 20 triệu/người · dự kiến ~18,7 triệu · dự phòng ~1,29 triệu</span></div>
    </div>

    <div class="route">
      <b>Hà Nội</b><i>–</i><b>Phố Đông</b><i>–</i><b>Hàng Châu</b><i>–</i><b>Ô Trấn</b><i>–</i><b>Thượng Hải</b><i>–</i><b>Hà Nội</b>
    </div>`,
  "hero-stats-route"
);

// —— Flight ticket outbound ——
rep(
  `          <div class="beat"><time>21:25</time>
            <div>
              <h4>VJ6010 Deluxe</h4>
              <p>Hà Nội đến sân bay Phố Đông, nhà ga 2. Làm thủ tục Nội Bài trước 19:25. Giá theo phương án dự kiến 10.560k / 2 người — chưa xuất thì vẫn
                nhảy.
                Giờ 21:25 đến 01:15 kiểm lại lúc đặt.</p>
            </div>
          </div>`,
  `          <div class="beat"><time>21:25</time>
            <div>
              <h4>Chuyến bay đi · VietJet Air</h4>
              <article class="flight" aria-label="Vé máy bay VJ6010">
                <div class="flight-top">
                  <div class="flight-airline">
                    <div class="mark">VJ</div>
                    <div>
                      <strong>VietJet Air</strong>
                      <span>Deluxe · 2 khách</span>
                    </div>
                  </div>
                  <div class="flight-code">VJ 6010</div>
                </div>
                <div class="flight-route">
                  <div class="flight-city">
                    <div class="iata">HAN</div>
                    <div class="name">Nội Bài, Hà Nội</div>
                    <div class="time">21:25</div>
                    <div class="date">07/01/2027 · Thứ Năm</div>
                  </div>
                  <div class="flight-mid">
                    <small>Bay đêm</small>
                    <div class="line"></div>
                    <svg class="ico" aria-hidden="true"><use href="#i-plane"></use></svg>
                  </div>
                  <div class="flight-city arr">
                    <div class="iata">PVG</div>
                    <div class="name">Phố Đông T2</div>
                    <div class="time">01:15</div>
                    <div class="date">08/01/2027 · +1 ngày</div>
                  </div>
                </div>
                <dl class="flight-meta">
                  <div><dt>Hạng</dt><dd>Deluxe</dd></div>
                  <div><dt>Nhà ga đến</dt><dd>PVG T2</dd></div>
                  <div><dt>Check-in</dt><dd>Trước 19:25</dd></div>
                </dl>
              </article>
              <p>Giá tham khảo cả khứ hồi Deluxe: <b>10.560.000đ / 2 khách</b>. Kiểm tra giờ bay lần cuối khi xuất vé.</p>
            </div>
          </div>`,
  "flight-out"
);

// —— Flight ticket return ——
rep(
  `          <div class="beat"><time>20:00–02:20</time>
            <div>
              <h4>Lấy hành lý, di chuyển đến sân bay Phố Đông và làm thủ tục chuyến VJ6011</h4>
              <p>Vali to: rời khách sạn muộn nhất 21:30. Tàu điện ngầm 2 ~1 giờ, 7 tệ. Tới 21:15–22:00 là dư. CHAGEE tại nhà ga 2 uống ly cuối.
                Bay
                02:20 đến Hà Nội 05:15.</p>
              <div class="inline-pin" data-pin="pvg"></div>
            </div>
          </div>`,
  `          <div class="beat"><time>20:00–02:20</time>
            <div>
              <h4>Ra sân bay Phố Đông · chuyến về</h4>
              <p>Vali lớn: rời khách sạn muộn nhất 21:30. Tàu điện ngầm tuyến 2 khoảng 1 giờ, ~7 tệ. Có mặt nhà ga 2 trước 22:00.</p>
              <article class="flight" aria-label="Vé máy bay VJ6011">
                <div class="flight-top">
                  <div class="flight-airline">
                    <div class="mark">VJ</div>
                    <div>
                      <strong>VietJet Air</strong>
                      <span>Deluxe · 2 khách</span>
                    </div>
                  </div>
                  <div class="flight-code">VJ 6011</div>
                </div>
                <div class="flight-route">
                  <div class="flight-city">
                    <div class="iata">PVG</div>
                    <div class="name">Phố Đông T2</div>
                    <div class="time">02:20</div>
                    <div class="date">14/01/2027 · Thứ Năm</div>
                  </div>
                  <div class="flight-mid">
                    <small>Bay đêm</small>
                    <div class="line"></div>
                    <svg class="ico" aria-hidden="true"><use href="#i-plane"></use></svg>
                  </div>
                  <div class="flight-city arr">
                    <div class="iata">HAN</div>
                    <div class="name">Nội Bài, Hà Nội</div>
                    <div class="time">05:15</div>
                    <div class="date">14/01/2027 · cùng ngày</div>
                  </div>
                </div>
                <dl class="flight-meta">
                  <div><dt>Hạng</dt><dd>Deluxe</dd></div>
                  <div><dt>Nhà ga đi</dt><dd>PVG T2</dd></div>
                  <div><dt>Check-in</dt><dd>Trước 00:20</dd></div>
                </dl>
              </article>
              <div class="inline-pin" data-pin="pvg"></div>
            </div>
          </div>`,
  "flight-return"
);

// Soften remaining status phrases
html = html.replace(/\s*[—–-]?\s*chưa đặt\.?/g, (m) => (m.trim().endsWith(".") ? "." : ""));
html = html.replace(/,\s*chưa xuất[^.<]*/g, "");
html = html.replace(/\s*—\s*chưa xuất[^.<]*/g, "");
html = html.replace(/chưa xuất thì giá vẫn có thể thay đổi\.?/g, "giá tham khảo.");
html = html.replace(/chưa xuất thì vẫn\s+nhảy\.\s*/g, "");
html = html.replace(/10\.560k \/ 2 người, chưa xuất/g, "10.560.000đ / 2 khách");
html = html.replace(/Vé 10\.560k\/2 người — chưa xuất\. khách sạn chưa đặt\./g, "");
console.log("OK: soften-status-phrases");

{
  const re = /<p class="note">Tổng di chuyển nội địa[\s\S]*?<\/p>/;
  if (re.test(html)) {
    html = html.replace(re, `<p class="note">Tổng di chuyển nội địa ~586 tệ / 2 người (chưa gồm vé bay). Vé VietJet Deluxe khứ hồi: <b>10.560.000đ / 2 khách</b> (giá tham khảo).</p>`);
    console.log("OK: move-note");
  } else console.log("SKIP: move-note");
}
rep(
  `            <td>Ngày 12/01 đã chốt hướng. Show xong tàu điện ngầm, chuyến cuối 22:30.</td>`,
  `            <td>12/01: sau show, tàu điện ngầm về — chuyến cuối khoảng 22:30.</td>`,
  "disney-chot"
);

{
  const oldNote = html.match(/<p class="note">Tỷ giá tham khảo[\s\S]*?<\/p>/);
  if (oldNote) {
    html = html.replace(oldNote[0], `<p class="note">Tỷ giá tham khảo: 1 CNY ≈ 3.873đ. Homeinn Định An 2 đêm 08–10/01, ~643k/đêm (giá Trip.com tham khảo).</p>`);
    console.log("OK: budget-note");
  } else console.log("SKIP: budget-note");
}
html = html.replace(
  /Checklist trước chuyến đi — thiếu món nào là dễ toang món đó/,
  "Checklist trước chuyến đi"
);
console.log("OK: checklist-title");

// —— Remove confirm + foot; insert map; update dock ——
{
  const re = /    <h2 id="confirm">[\s\S]*?<\/nav>/;
  const next = `    <h2 id="map"><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-map"></use></svg></span> Bản đồ hành trình</h2>
    <p class="map-note">Chọn điểm đến để xem vị trí. Dùng Amap khi đang ở Trung Quốc để chỉ đường chính xác.</p>
    <div class="map-board">
      <div class="map-frame">
        <iframe id="map-iframe" title="Bản đồ hành trình" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.openstreetmap.org/export/embed.html?bbox=120.145,30.230,120.185,30.260&amp;layer=mapnik&amp;marker=30.244835,120.165478"></iframe>
      </div>
      <div class="map-places" id="map-places" role="tablist" aria-label="Điểm trên bản đồ"></div>
      <div class="map-actions">
        <a class="btn" id="map-amap" href="https://uri.amap.com/marker?position=120.165478,30.244835&amp;name=Homeinn%20Hangzhou&amp;coordinate=gaode&amp;callnative=1" target="_blank" rel="noopener"><svg class="ico"><use href="#i-nav"></use></svg> Mở Amap</a>
        <a class="btn btn-ghost" id="map-gmaps" href="https://www.google.com/maps?q=30.244835,120.165478" target="_blank" rel="noopener"><svg class="ico"><use href="#i-map"></use></svg> Google Maps</a>
      </div>
    </div>
  </div>
  <nav class="dock" aria-label="Điều hướng nhanh">
    <a href="#days"><svg class="ico"><use href="#i-itin"></use></svg><span>Lịch trình</span></a>
    <a href="#food"><svg class="ico"><use href="#i-food"></use></svg><span>Ăn uống</span></a>
    <a href="#budget"><svg class="ico"><use href="#i-cost"></use></svg><span>Chi phí</span></a>
    <a href="#pins"><svg class="ico"><use href="#i-pin"></use></svg><span>Địa điểm</span></a>
    <a href="#map"><svg class="ico"><use href="#i-map"></use></svg><span>Bản đồ</span></a>
  </nav>`;
  if (!re.test(html)) {
    console.error("MISS: confirm-map-dock");
    process.exit(1);
  }
  html = html.replace(re, next);
  console.log("OK: confirm-map-dock");
}

// —— JS: remove copy-summary; update syncDock; add map places; quiet PWA status ——
{
  const re = /\n    var copySummary = document\.getElementById\("copy-summary"\);[\s\S]*?\n    \}\);\n\n    \(function setStickH\(\)/;
  if (re.test(html)) {
    html = html.replace(re, "\n    (function setStickH()");
    console.log("OK: remove-copy-summary");
  } else console.log("SKIP: remove-copy-summary");
}

rep(
  `      const order = ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "pins", "food", "tips"];`,
  `      const order = ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "pins", "food", "budget", "map", "tips"];`,
  "syncChip-order"
);

{
  const re = /function syncDock\(\) \{[\s\S]*?\n    \}/;
  const next = `function syncDock() {
      const map = { d0: "#days", d1: "#days", d2: "#days", d3: "#days", d4: "#days", d5: "#days", d6: "#days", days: "#days", food: "#food", "food-pins": "#food", budget: "#budget", check: "#budget", pins: "#pins", map: "#map", tips: "#days" };
      const stick = document.querySelector(".stick");
      const line = (stick ? stick.offsetHeight : 57) + 16;
      let key = "d0";
      ["d0", "d1", "d2", "d3", "d4", "d5", "d6", "food", "budget", "pins", "map"].forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - line <= 8) key = id;
      });
      const href = map[key] || "#days";
      document.querySelectorAll(".dock a[href^=\\"#\\"]").forEach(function (a) {
        a.classList.toggle("is-on", a.getAttribute("href") === href);
      });
    }`;
  if (re.test(html)) {
    html = html.replace(re, next);
    console.log("OK: syncDock");
  } else {
    console.error("MISS: syncDock");
    process.exit(1);
  }
}

// coords for map places missing lat/lng
html = html.replace(
  `hz_east: { group: "transit", k: "Ga tàu 08/01", vi: "Hàng Châu Đông", name: "杭州东站", zh: "杭州东站", img: "img/sight-westlake.jpg" }`,
  `hz_east: { group: "transit", k: "Ga tàu 08/01", vi: "Hàng Châu Đông", name: "杭州东站", zh: "杭州东站", img: "img/sight-westlake.jpg", lat: "30.291167", lng: "120.212494" }`
);
console.log("OK: hz_east-coords");

rep(
  `    /* —— PWA: service worker + install prompt —— */
    (function () {
      const status = document.getElementById("pwa-status");
      const banner = document.getElementById("pwa-banner");
      const installBtn = document.getElementById("pwa-install");
      const dismissBtn = document.getElementById("pwa-dismiss");
      const bannerText = document.getElementById("pwa-banner-text");
      let deferredPrompt = null;
      const dismissed = localStorage.getItem("hz-pwa-dismiss") === "1";

      function setStatus(msg) {
        if (!status) return;
        status.hidden = !msg;
        status.textContent = msg || "";
      }

      function isStandalone() {
        return window.matchMedia("(display-mode: standalone)").matches
          || window.navigator.standalone === true;
      }

      function isiOS() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent);
      }

      function showBanner(iosHint) {
        if (!banner || dismissed || isStandalone()) return;
        if (iosHint) {
          bannerText.textContent = "iPhone: bấm Share (□↑) → Thêm vào Màn hình chính. Mở lại từ icon để dùng như app.";
          installBtn.hidden = true;
        }
        banner.classList.add("show");
      }

      if (isStandalone()) {
        setStatus("Đang mở dạng app · offline sẵn nếu đã mở một lần khi có mạng.");
      } else if (isiOS()) {
        showBanner(true);
      }

      window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();
        deferredPrompt = e;
        showBanner(false);
      });

      if (installBtn) {
        installBtn.addEventListener("click", function () {
          if (!deferredPrompt) {
            setStatus("Trình duyệt chưa hiện nút cài — dùng menu ⋮ → Cài đặt ứng dụng / Add to Home screen.");
            return;
          }
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function (choice) {
            deferredPrompt = null;
            banner.classList.remove("show");
            if (choice.outcome === "accepted") setStatus("Đã cài. Mở từ icon trên màn hình chính.");
          });
        });
      }
      if (dismissBtn) {
        dismissBtn.addEventListener("click", function () {
          localStorage.setItem("hz-pwa-dismiss", "1");
          banner.classList.remove("show");
        });
      }

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js", { scope: "./" }).then(function (reg) {
          if (!isStandalone()) setStatus("PWA sẵn sàng · đã cache offline (service worker).");
          reg.update();
        }).catch(function (err) {
          setStatus("Không đăng ký được offline: " + (err && err.message ? err.message : err));
        });
      }
    })();`,
  `    /* —— Bản đồ: OSM embed + deep-link Amap —— */
    (function () {
      const places = [
        { id: "homeinn_hz", label: "KS Hàng Châu", icon: "hotel" },
        { id: "wuzhen_visitor", label: "Ô Trấn", icon: "pin" },
        { id: "homeinn_sh", label: "KS Thượng Hải", icon: "hotel" },
        { id: "pvg", label: "Phố Đông", icon: "plane" },
        { id: "hz_east", label: "HC Đông", icon: "train" },
        { id: "disney", label: "Disney", icon: "star" }
      ].filter(function (p) { return PINS[p.id] && PINS[p.id].lat && PINS[p.id].lng; });

      const host = document.getElementById("map-places");
      const iframe = document.getElementById("map-iframe");
      const amap = document.getElementById("map-amap");
      const gmaps = document.getElementById("map-gmaps");
      if (!host || !iframe || !places.length) return;

      function setPlace(p) {
        const pin = PINS[p.id];
        const lat = Number(pin.lat);
        const lng = Number(pin.lng);
        const d = 0.04;
        const bbox = [lng - d, lat - d * 0.7, lng + d, lat + d * 0.7].join(",");
        iframe.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + encodeURIComponent(bbox) + "&layer=mapnik&marker=" + encodeURIComponent(lat + "," + lng);
        const name = encodeURIComponent(pin.vi || pin.name || p.label);
        amap.href = "https://uri.amap.com/marker?position=" + lng + "," + lat + "&name=" + name + "&coordinate=gaode&callnative=1";
        gmaps.href = "https://www.google.com/maps?q=" + lat + "," + lng;
        host.querySelectorAll("button").forEach(function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-id") === p.id);
        });
      }

      places.forEach(function (p, i) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-id", p.id);
        btn.innerHTML = ico(p.icon) + p.label;
        if (i === 0) btn.classList.add("is-on");
        btn.addEventListener("click", function () { setPlace(p); });
        host.appendChild(btn);
      });
      setPlace(places[0]);
    })();

    /* —— PWA: silent service worker (no status chatter) —— */
    (function () {
      const banner = document.getElementById("pwa-banner");
      const installBtn = document.getElementById("pwa-install");
      const dismissBtn = document.getElementById("pwa-dismiss");
      const bannerText = document.getElementById("pwa-banner-text");
      let deferredPrompt = null;
      const dismissed = localStorage.getItem("hz-pwa-dismiss") === "1";

      function isStandalone() {
        return window.matchMedia("(display-mode: standalone)").matches
          || window.navigator.standalone === true;
      }

      function showBanner(iosHint) {
        if (!banner || dismissed || isStandalone()) return;
        banner.hidden = false;
        if (iosHint) {
          bannerText.textContent = "iPhone: Share → Thêm vào Màn hình chính.";
          installBtn.hidden = true;
        }
        banner.classList.add("show");
      }

      if (!isStandalone() && /iphone|ipad|ipod/i.test(navigator.userAgent)) showBanner(true);

      window.addEventListener("beforeinstallprompt", function (e) {
        e.preventDefault();
        deferredPrompt = e;
        showBanner(false);
      });

      if (installBtn) {
        installBtn.addEventListener("click", function () {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(function () {
            deferredPrompt = null;
            banner.classList.remove("show");
            banner.hidden = true;
          });
        });
      }
      if (dismissBtn) {
        dismissBtn.addEventListener("click", function () {
          localStorage.setItem("hz-pwa-dismiss", "1");
          banner.classList.remove("show");
          banner.hidden = true;
        });
      }

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js", { scope: "./" }).then(function (reg) { reg.update(); }).catch(function () {});
      }
    })();`,
  "map-js-pwa-quiet"
);

fs.writeFileSync(path, html);
console.log("DONE", html.length);
