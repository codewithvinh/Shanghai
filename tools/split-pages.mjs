/**
 * Split hangzhou-trip.html into multi-page app (dock = real page navigations).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(__dirname, "../public");
const src = fs.readFileSync(path.join(pub, "hangzhou-trip.html"), "utf8").replace(/\r\n/g, "\n");
const lines = src.split("\n");

function slice(a, b) {
  return lines.slice(a - 1, b).join("\n");
}

const css = slice(21, 1688); // inside <style> without tags — lines 21-1688 are CSS rules; style is 20-1689
// Actually line 20 is `  <style>` and 1689 is `  </style>`. Content 21-1688.
const cssBody = slice(21, 1688);
const sprite = slice(1694, 1715);

const mast = slice(1718, 1743);
const pwa = slice(1744, 1750);

const chips = `    <div class="stick">
      <nav class="chips" aria-label="Ngày">
        <a href="#d0"><svg class="ico"><use href="#i-moon"></use></svg> Đêm 07</a>
        <a href="#d1"><svg class="ico"><use href="#i-cal"></use></svg> 08 HC</a>
        <a href="#d2"><svg class="ico"><use href="#i-cal"></use></svg> 09 HC</a>
        <a href="#d3"><svg class="ico"><use href="#i-cam"></use></svg> 10 Ô Trấn</a>
        <a href="#d4"><svg class="ico"><use href="#i-cam"></use></svg> 11 SH</a>
        <a href="#d5"><svg class="ico"><use href="#i-star"></use></svg> 12 Disney</a>
        <a href="#d6"><svg class="ico"><use href="#i-plane"></use></svg> 13 Về</a>
        <a href="hangzhou-pins.html"><svg class="ico"><use href="#i-pin"></use></svg> Địa điểm</a>
        <a href="hangzhou-food.html"><svg class="ico"><use href="#i-food"></use></svg> Ăn</a>
        <a href="hangzhou-budget.html#tips"><svg class="ico"><use href="#i-tips"></use></svg> Tips</a>
      </nav>
    </div>`;

const daysMain =
  slice(1766, 1783) + "\n\n" +
  slice(1785, 2231) + "\n\n" +
  slice(2234, 2312);

const pinsMain =
  `    <div class="vault-head" id="pins">
      <div>
        <h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-pin"></use></svg></span> Địa chỉ tiếng Trung</h2>
      </div>
      <button type="button" class="btn btn-ghost" data-copy-many="homeinn_hz,wuzhen_visitor,homeinn_sh">Copy 3 khách sạn</button>
    </div>
    <div id="pin-hotels" class="pin-grid"></div>
    <h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-train"></use></svg></span> Ga · bến · sân bay</h2>
    <div id="pin-transit" class="pin-grid"></div>
    <h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-cam"></use></svg></span> Check-in</h2>
    <div id="pin-sights" class="pin-grid"></div>`;

const foodMain =
  `    <div class="vault-head" id="food-pins">
      <div>
        <h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-food"></use></svg></span> Quán ăn · đồ uống theo khu</h2>
      </div>
      <button type="button" class="btn btn-ghost" id="toggle-food-zones">Mở hết / gập</button>
    </div>
    <p class="note" style="margin-top:0">Gom theo địa chỉ gần nhau. Bấm dòng khu để mở/gập; Copy khu = copy hết địa chỉ tiếng Trung trong khu.</p>
    <div id="pin-food" class="food-vault"></div>

` + slice(2336, 2409);

const budgetMain = slice(2411, 2567);
const mapMain = slice(2569, 2581);

function dock(active) {
  const items = [
    ["hangzhou-days.html", "i-itin", "Lịch trình"],
    ["hangzhou-food.html", "i-food", "Ăn uống"],
    ["hangzhou-budget.html", "i-cost", "Chi phí"],
    ["hangzhou-pins.html", "i-pin", "Địa điểm"],
    ["hangzhou-map.html", "i-map", "Bản đồ"],
  ];
  return `  <nav class="dock" aria-label="Điều hướng nhanh">
${items
  .map(([href, icon, label]) => {
    const on = href === active ? ' class="is-on" aria-current="page"' : "";
    return `    <a href="${href}"${on}><svg class="ico"><use href="#${icon}"></use></svg><span>${label}</span></a>`;
  })
  .join("\n")}
  </nav>`;
}

const titles = {
  days: "Lịch trình — Hàng Châu · Ô Trấn · Thượng Hải",
  food: "Ăn uống — Hàng Châu · Ô Trấn · Thượng Hải",
  budget: "Chi phí — Hàng Châu · Ô Trấn · Thượng Hải",
  pins: "Địa điểm — Hàng Châu · Ô Trấn · Thượng Hải",
  map: "Bản đồ — Hàng Châu · Ô Trấn · Thượng Hải",
};

function page({ key, file, body, extraHead = "", scripts = "", showChips = false, compactMast = false }) {
  const mastBlock = compactMast
    ? `    <header class="mast mast-compact">
      <div class="mast-top">
        <div class="app-mark" aria-hidden="true"><svg class="ico"><use href="#i-mark"></use></svg></div>
        <div class="titles">
          <small>Kế hoạch 1 · Vinh &amp; Hà Trang</small>
          <h1><b>HZ–WZ–SH</b> <i>07–14/01</i></h1>
        </div>
        <span class="mast-badge">2 người</span>
      </div>
    </header>`
    : mast;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="HZ–WZ–SH">
  <meta name="application-name" content="HZ–WZ–SH">
  <meta name="theme-color" content="#f4783b">
  <meta name="format-detection" content="telephone=yes">
  <meta name="description" content="Sổ tay Hàng Châu · Ô Trấn · Thượng Hải — địa chỉ, lịch, quán ăn.">
  <link rel="manifest" href="./manifest.webmanifest">
  <link rel="apple-touch-icon" href="./icons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="./icons/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="./icons/icon-512.png">
  <link rel="stylesheet" href="./hangzhou-trip.css">
  <title>${titles[key]}</title>
  ${extraHead}
</head>
<body data-page="${key}">
${sprite}

  <div class="page">
${mastBlock}
${pwa}
${showChips ? chips + "\n" : ""}
${body}
  </div>
${dock(file)}
  <div class="toast" id="toast" role="status"></div>

  <script src="./js/hangzhou-data.js"></script>
  <script src="./js/hangzhou-shared.js"></script>
${scripts}
</body>
</html>
`;
}

// —— CSS extras for multi-page ——
const cssExtra = `

/* —— Multi-page shell —— */
.mast-compact {
  padding-bottom: 8px;
}
.mast-compact .trip-meta,
.mast-compact .lede,
.mast-compact .rule {
  display: none;
}
body[data-page]:not([data-page="days"]) .stick {
  display: none;
}
h2, .vault-head, .itin, .day, .map-board {
  scroll-margin-top: calc(var(--stick-h, 16px) + 8px);
}
`;

fs.writeFileSync(path.join(pub, "hangzhou-trip.css"), cssBody + cssExtra);
console.log("wrote hangzhou-trip.css");

// —— Extract JS data + shared from original script ——
const scriptStart = src.indexOf("  <script>\n    const PINS");
const scriptEnd = src.lastIndexOf("  </script>");
if (scriptStart < 0 || scriptEnd < 0) throw new Error("script block not found");
const rawScript = src.slice(scriptStart + "  <script>\n".length, scriptEnd);

// Split: everything until FOOD boards render is core; we'll rewrite shared cleanly
const dataMatch = rawScript.match(/const PINS = \{[\s\S]*?\n    \};\n\n    const FOOD_AREAS = \[[\s\S]*?\n    \];/);
if (!dataMatch) throw new Error("PINS/FOOD_AREAS not found");

// FOOD array
const foodArrMatch = rawScript.match(/    const FOOD = \[[\s\S]*?\n    \];/);
if (!foodArrMatch) throw new Error("FOOD not found");

const jsDir = path.join(pub, "js");
fs.mkdirSync(jsDir, { recursive: true });

const dataJs = `/* Trip data — shared across pages */
${dataMatch[0].replace(/^    /gm, "")}

${foodArrMatch[0].replace(/^    /gm, "")}
`;
fs.writeFileSync(path.join(jsDir, "hangzhou-data.js"), dataJs);
console.log("wrote js/hangzhou-data.js");

const sharedJs = `/* Shared helpers + dock + copy + PWA */
(function () {
  "use strict";

  function ico(name) {
    return '<svg class="ico" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  }
  window.hzIco = ico;

  function amapHref(p) {
    if (p.amap) return p.amap;
    if (p.lat && p.lng) {
      return "https://uri.amap.com/marker?position=" + p.lng + "," + p.lat + "&name=" + encodeURIComponent(p.vi || p.name || "") + "&coordinate=gaode&callnative=1";
    }
    return "https://www.amap.com/search?query=" + encodeURIComponent(p.zh || p.name || p.vi || "");
  }
  function gmapHref(p) {
    if (p.lat && p.lng) return "https://www.google.com/maps?q=" + p.lat + "," + p.lng;
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.zh || p.name || p.vi || "");
  }
  window.hzAmapHref = amapHref;
  window.hzGmapHref = gmapHref;

  function pinCard(id, p, full) {
    const tel = p.tel
      ? '<p class="pin-tel"><svg class="ico"><use href="#i-phone"></use></svg> <a href="tel:' + p.tel + '">' + p.tel + "</a></p>"
      : "";
    const img = p.img
      ? '<img class="pin-cover" src="' + p.img + '" alt="" loading="lazy">'
      : "";
    const label = full ? "Copy địa chỉ" : "Copy";
    return (
      '<article class="pin" data-id="' + id + '">' +
      img +
      '<div class="pin-body">' +
      (p.k ? '<p class="pin-k">' + p.k + "</p>" : "") +
      "<h3>" + (p.vi || p.name) + "</h3>" +
      (p.zh ? '<p class="zh" lang="zh">' + p.zh + "</p>" : "") +
      tel +
      '<div class="actions">' +
      '<button type="button" class="btn" data-copy="' + (p.zh || p.name || p.vi || "").replace(/"/g, "&quot;") + '" data-label="' + label + '">' + ico("copy") + label + "</button>" +
      '<a class="btn btn-ghost amap" href="' + amapHref(p) + '" target="_blank" rel="noopener">' + ico("map") + "Amap</a>" +
      '<a class="btn btn-ghost maps" href="' + gmapHref(p) + '" target="_blank" rel="noopener">' + ico("nav") + "Maps</a>" +
      "</div></div></article>"
    );
  }
  window.hzPinCard = pinCard;

  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._id);
    toast._id = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  window.hzToast = toast;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:0;top:0;opacity:0.01;width:1px;height:1px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, text.length);
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (e) {
        document.body.removeChild(ta);
        reject(e);
      }
    });
  }
  window.hzCopyText = copyText;

  document.addEventListener("click", function (e) {
    if (e.target.closest(".food-zone summary button, .food-zone summary a")) {
      e.preventDefault();
      e.stopPropagation();
    }

    const one = e.target.closest("[data-copy]");
    const manyText = e.target.closest("[data-copy-many-text]");
    const many = e.target.closest("[data-copy-many]");
    if (one) {
      const text = one.getAttribute("data-copy");
      const defaultLbl = one.getAttribute("data-label") || (one.closest(".inline-pin") ? "Copy" : "Copy địa chỉ");
      copyText(text).then(function () {
        one.classList.add("ok");
        one.innerHTML = ico("copy") + "Đã copy";
        toast("Đã copy: " + text);
        setTimeout(function () { one.classList.remove("ok"); one.innerHTML = ico("copy") + defaultLbl; }, 1600);
      }).catch(function () {
        const zh = one.closest(".pin") && one.closest(".pin").querySelector(".zh");
        if (zh) {
          const range = document.createRange();
          range.selectNodeContents(zh);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        toast("Địa chỉ đã chọn — giữ tay → Copy");
      });
    }
    if (manyText) {
      const block = decodeURIComponent(manyText.getAttribute("data-copy-many-text") || "");
      copyText(block).then(function () {
        manyText.classList.add("ok");
        manyText.innerHTML = ico("copy") + "Đã copy";
        toast("Đã copy địa chỉ trong khu");
        setTimeout(function () { manyText.classList.remove("ok"); manyText.innerHTML = ico("copy") + "Copy khu"; }, 1600);
      }).catch(function () { toast("Giữ tay chọn chữ rồi copy"); });
    }
    if (many) {
      const ids = many.getAttribute("data-copy-many").split(",");
      const block = ids.map(function (id) {
        const p = PINS[id];
        return p.vi + "\\n" + p.zh;
      }).join("\\n\\n");
      copyText(block).then(function () { toast("Đã copy 3 khách sạn"); }).catch(function () { toast("Giữ tay chọn chữ rồi copy"); });
    }
  });

  // Dock: mark active by pathname (also works if HTML set aria-current)
  (function markDock() {
    const file = (location.pathname.split("/").pop() || "hangzhou-days.html").toLowerCase();
    document.querySelectorAll(".dock a[href]").forEach(function (a) {
      const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      const on = href === file || (file === "" && href.indexOf("days") >= 0);
      a.classList.toggle("is-on", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  })();

  // Days: chips hash scroll only
  (function chipsNav() {
    const chips = document.querySelector(".chips");
    if (!chips) return;

    function setStickH() {
      const s = document.querySelector(".stick");
      if (s) document.documentElement.style.setProperty("--stick-h", s.offsetHeight + "px");
    }
    setStickH();
    window.addEventListener("resize", setStickH);

    function syncChip() {
      const stick = document.querySelector(".stick");
      const line = (stick ? stick.offsetHeight : 57) + 16;
      const order = ["d0", "d1", "d2", "d3", "d4", "d5", "d6"];
      let href = "#d0";
      order.forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - line <= 8) href = "#" + id;
      });
      let current = null;
      chips.querySelectorAll('a[href^="#"]').forEach(function (a) {
        const on = a.getAttribute("href") === href;
        a.classList.toggle("is-on", on);
        if (on) current = a;
      });
      if (current && syncChip._href !== href) {
        syncChip._href = href;
        const left = current.offsetLeft - (chips.clientWidth - current.offsetWidth) / 2;
        chips.scrollLeft = Math.max(0, left);
      }
    }

    chips.addEventListener("click", function (e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      a.blur();
      const hash = a.getAttribute("href");
      const t = document.querySelector(hash);
      if (!t) return;
      history.pushState(null, "", hash);
      t.scrollIntoView({ behavior: "smooth", block: "start" });
      requestAnimationFrame(syncChip);
    });

    window.addEventListener("scroll", function () {
      clearTimeout(syncChip._t);
      syncChip._t = setTimeout(syncChip, 50);
    }, { passive: true });
    syncChip();
    if (location.hash) {
      requestAnimationFrame(function () {
        const t = document.querySelector(location.hash);
        if (t) t.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
  })();

  // PWA silent
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
  })();
})();
`;
fs.writeFileSync(path.join(jsDir, "hangzhou-shared.js"), sharedJs);
console.log("wrote js/hangzhou-shared.js");

const daysJs = `/* Days page: hydrate inline pins */
(function () {
  if (!window.PINS || !window.hzPinCard) return;
  document.querySelectorAll("[data-pin]").forEach(function (el) {
    const id = el.getAttribute("data-pin");
    const p = PINS[id];
    if (!p) return;
    el.innerHTML = hzPinCard(id, p, false);
  });
})();
`;
fs.writeFileSync(path.join(jsDir, "hangzhou-days.js"), daysJs);

const pinsJs = `/* Pins page */
(function () {
  if (!window.PINS || !window.hzPinCard) return;
  function fillGroup(elId, group) {
    const host = document.getElementById(elId);
    if (!host) return;
    host.innerHTML = Object.keys(PINS)
      .filter(function (id) { return PINS[id].group === group; })
      .map(function (id) { return hzPinCard(id, PINS[id], true); })
      .join("");
  }
  fillGroup("pin-hotels", "hotel");
  fillGroup("pin-transit", "transit");
  fillGroup("pin-sights", "sight");
})();
`;
fs.writeFileSync(path.join(jsDir, "hangzhou-pins.js"), pinsJs);

const foodJs = `/* Food page: zones + boards */
(function () {
  if (!window.PINS || !window.hzPinCard) return;

  function fillFoodZones() {
    const host = document.getElementById("pin-food");
    if (!host || !window.FOOD_AREAS) return;
    host.innerHTML = FOOD_AREAS.map(function (zone) {
      const ids = zone.ids.filter(function (id) { return PINS[id]; });
      if (!ids.length) return "";
      const cards = ids.map(function (id) { return hzPinCard(id, PINS[id], true); }).join("");
      const copyBlock = ids.map(function (id) {
        const p = PINS[id];
        return p.vi + "\\n" + p.zh;
      }).join("\\n\\n");
      const countLbl = ids.length + " điểm";
      return (
        '<details class="food-zone" open>' +
        "<summary>" +
        '<div class="zone-title"><b>' + zone.title + "</b><span>" + zone.sub + " · " + countLbl + "</span></div>" +
        '<div class="zone-tools">' +
        '<button type="button" class="btn btn-copy" data-copy-many-text="' + encodeURIComponent(copyBlock) + '">' + hzIco("copy") + "Copy khu</button>" +
        '<span class="chev" aria-hidden="true">▾</span>' +
        "</div></summary>" +
        '<div class="zone-body"><div class="zone-grid">' + cards + "</div></div>" +
        "</details>"
      );
    }).join("");
  }
  fillFoodZones();

  const btn = document.getElementById("toggle-food-zones");
  if (btn) {
    btn.addEventListener("click", function () {
      const zones = Array.prototype.slice.call(document.querySelectorAll("#pin-food .food-zone"));
      const openAll = zones.some(function (z) { return !z.open; });
      zones.forEach(function (z) { z.open = openAll; });
      btn.textContent = openAll ? "Gập hết" : "Mở hết";
    });
  }

  const boards = document.getElementById("food-boards");
  if (boards && window.FOOD) {
    boards.innerHTML = FOOD.map(function (b) {
      const rows = b.items.map(function (r) {
        return '<article class="food-row"><div class="food-when">' + r[0] + "</div><b>" + r[1] + '</b><p class="zh" lang="zh">' + r[2] + "</p><p>" + r[3] + "</p></article>";
      }).join("");
      return '<h3 style="margin:16px 16px 8px;font-size:16px">' + b.city + '</h3><div class="food-list">' + rows + "</div>";
    }).join("");
  }
})();
`;
fs.writeFileSync(path.join(jsDir, "hangzhou-food.js"), foodJs);

const budgetJs = `/* Budget checklist persistence */
(function () {
  try {
    const saved = JSON.parse(localStorage.getItem("hz-check") || "[]");
    document.querySelectorAll(".check input").forEach(function (box, i) {
      box.checked = !!saved[i];
      box.addEventListener("change", function () {
        localStorage.setItem(
          "hz-check",
          JSON.stringify(Array.from(document.querySelectorAll(".check input")).map(function (b) { return b.checked; }))
        );
      });
    });
  } catch (e) {}
  if (location.hash) {
    requestAnimationFrame(function () {
      const t = document.querySelector(location.hash);
      if (t) t.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }
})();
`;
fs.writeFileSync(path.join(jsDir, "hangzhou-budget.js"), budgetJs);

const mapJs = `/* Map page */
(function () {
  if (!window.PINS || !window.hzIco) return;
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
    btn.innerHTML = hzIco(p.icon) + p.label;
    if (i === 0) btn.classList.add("is-on");
    btn.addEventListener("click", function () { setPlace(p); });
    host.appendChild(btn);
  });
  setPlace(places[0]);
})();
`;
fs.writeFileSync(path.join(jsDir, "hangzhou-map.js"), mapJs);

function writePage(cfg) {
  const html = page(cfg);
  fs.writeFileSync(path.join(pub, cfg.file), html);
  console.log("wrote", cfg.file, html.length);
}

writePage({
  key: "days",
  file: "hangzhou-days.html",
  body: daysMain,
  showChips: true,
  scripts: '  <script src="./js/hangzhou-days.js"></script>\n',
});
writePage({
  key: "food",
  file: "hangzhou-food.html",
  body: foodMain,
  compactMast: true,
  scripts: '  <script src="./js/hangzhou-food.js"></script>\n',
});
writePage({
  key: "budget",
  file: "hangzhou-budget.html",
  body: budgetMain,
  compactMast: true,
  scripts: '  <script src="./js/hangzhou-budget.js"></script>\n',
});
writePage({
  key: "pins",
  file: "hangzhou-pins.html",
  body: pinsMain,
  compactMast: true,
  scripts: '  <script src="./js/hangzhou-pins.js"></script>\n',
});
writePage({
  key: "map",
  file: "hangzhou-map.html",
  body: mapMain,
  compactMast: true,
  scripts: '  <script src="./js/hangzhou-map.js"></script>\n',
});

// Redirect old entry
fs.writeFileSync(
  path.join(pub, "hangzhou-trip.html"),
  `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=hangzhou-days.html">
  <link rel="manifest" href="./manifest.webmanifest">
  <title>HZ–WZ–SH</title>
  <script>location.replace("hangzhou-days.html"+location.hash);</script>
</head>
<body>
  <p><a href="hangzhou-days.html">Mở lịch trình</a></p>
</body>
</html>
`
);
console.log("wrote hangzhou-trip.html redirect");

console.log("DONE");
