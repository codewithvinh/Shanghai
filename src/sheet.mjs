import { renderPlacesPanel } from "./places.mjs";

function i18n(vi, zh, en) {
  return `<span class="i18n"><span class="vi">${vi}</span><span class="zh">${zh}</span><span class="en">${en}</span></span>`;
}

const TOC = [
  { id: "itin", vi: "1. Lịch trình", zh: "1. 行程", en: "1. Itinerary" },
  { id: "pins", vi: "Địa chỉ", zh: "地址", en: "Addresses" },
  { id: "move", vi: "2. Di chuyển", zh: "2. 交通", en: "2. Transport" },
  { id: "stay", vi: "3. Lưu trú", zh: "3. 住宿", en: "3. Stay" },
  { id: "food", vi: "4. Ăn uống", zh: "4. 餐饮", en: "4. Food" },
  { id: "sights", vi: "5. Tham quan", zh: "5. 景点", en: "5. Places" },
  { id: "budget", vi: "6. Chi phí", zh: "6. 费用", en: "6. Costs" },
  { id: "check", vi: "7. Checklist", zh: "7. 出发前", en: "7. Checklist" },
  { id: "notes", vi: "8. Ghi chú", zh: "8. 备注", en: "8. Notes" },
];

const SECTION_TITLES = Object.fromEntries(
  TOC.map((item) => [item.id, i18n(item.vi, item.zh, item.en)]),
);

function shortDate(chipVi) {
  const m = chipVi.match(/(\d{1,2}\/\d{1,2})/);
  return m ? m[1] : chipVi;
}

function shortenHeading(h3html) {
  return h3html.replace(
    /<span class="(vi|zh|en)">([\s\S]*?)<\/span>/g,
    (_, lang, text) => {
      const idx = Math.max(text.lastIndexOf(":"), text.lastIndexOf("："));
      const cut = idx >= 0 ? text.slice(idx + 1).trim() : text.trim();
      return `<span class="${lang}">${cut}</span>`;
    },
  );
}

function parseDays(html) {
  const cards = [...html.matchAll(/<article class="day-card">([\s\S]*?)<\/article>/g)];
  if (!cards.length) throw new Error("No day-card blocks found");
  return cards.map((m) => {
    const block = m[1];
    const chipVi = block.match(/chip day[\s\S]*?<span class="vi">([^<]+)/)?.[1] ?? "";
    const h3 = block.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] ?? "";
    const tbody = block.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? "";
    const rows = [...tbody.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) =>
      [...r[1].matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/g)].map((c) => ({
        attrs: c[1],
        html: c[2],
      })),
    );
    return { date: shortDate(chipVi), heading: shortenHeading(h3), rows };
  });
}

function formatCost(cell) {
  const text = cell.html.replace(/<[^>]+>/g, "").trim();
  const extra = (cell.attrs || "").replace(/class="[^"]*"/g, "").trim();
  const attrs = extra ? ` ${extra}` : "";
  if (text === "0" || text === "") return { attrs, html: "—" };
  if (/^\d[\d.]*$/.test(text)) return { attrs, html: `${text} ₫` };
  return { attrs, html: cell.html };
}

function formatMoneyCells(html) {
  return html.replace(/<td([^>]*)>([\s\S]*?)<\/td>/g, (full, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (text === "0") return `<td${attrs} class="cost">—</td>`;
    if (/^\d{1,3}(\.\d{3})+$/.test(text) && !/₫/.test(inner)) {
      return `<td${attrs} class="cost">${text} ₫</td>`;
    }
    return full;
  });
}

function renderToc() {
  return `<nav class="toc">${TOC.map(
    (item) =>
      `<a href="#${item.id}">${i18n(item.vi, item.zh, item.en)}</a>`,
  ).join("")}</nav>`;
}

function renderTopbar({ title, otherHref, otherLabel }) {
  return `<div class="topbar">
  <div class="brand">${title}</div>
  <div class="lang">
    <a class="print-btn" href="${otherHref}">${otherLabel}</a>
    <button type="button" data-lang="vi">VI</button>
    <button type="button" data-lang="zh">中文</button>
    <button type="button" data-lang="en">EN</button>
    <button type="button" class="print-btn" onclick="window.print()">${i18n("In", "打印", "Print")}</button>
  </div>
</div>`;
}

function renderItinerary({ title, dates, days }) {
  const colHead = [
    i18n("Ngày", "日期", "Date"),
    i18n("Thời gian", "时间", "Time"),
    i18n("Hoạt động", "活动", "Activity"),
    i18n("Địa điểm", "地点", "Place"),
    i18n("Nội dung", "内容", "Detail"),
    i18n("Chi phí", "费用", "Cost"),
    i18n("Đơn vị", "单位", "Unit"),
    i18n("Số lượng", "数量", "Qty"),
    i18n("Ghi chú", "备注", "Notes"),
    i18n("Tham khảo", "参考", "Source"),
  ];

  const body = [];
  for (const day of days) {
    body.push(`<tr class="section"><td colspan="10">${day.heading}</td></tr>`);
    day.rows.forEach((cells, i) => {
      const cost = formatCost(cells[4] ?? { attrs: "", html: "" });
      const tds = [
        i === 0
          ? `<td class="date" rowspan="${day.rows.length}">${day.date}</td>`
          : "",
        `<td class="time">${cells[0]?.html ?? ""}</td>`,
        `<td>${cells[1]?.html ?? ""}</td>`,
        `<td>${cells[2]?.html ?? ""}</td>`,
        `<td>${cells[3]?.html ?? ""}</td>`,
        `<td class="cost"${cost.attrs}>${cost.html}</td>`,
        `<td>${cells[5]?.html ?? ""}</td>`,
        `<td class="qty">${cells[6]?.html ?? ""}</td>`,
        `<td>${cells[7]?.html ?? ""}</td>`,
        `<td>${cells[8]?.html ?? ""}</td>`,
      ];
      body.push(`<tr>${tds.join("")}</tr>`);
    });
  }

  return `<section class="panel" id="itin">
  <h2>${SECTION_TITLES.itin}</h2>
  <div class="sheet-wrap">
  <table class="sheet">
    <thead>
      <tr class="title"><th colspan="10">${title}</th></tr>
      <tr class="dates"><th colspan="10">${dates}</th></tr>
      <tr class="cols">${colHead.map((h) => `<th>${h}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${body.join("\n      ")}
    </tbody>
  </table>
  </div>
</section>`;
}

function restylePanel(block) {
  let html = block;
  const id = html.match(/id="([^"]+)"/)?.[1];
  if (id && SECTION_TITLES[id]) {
    html = html.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, `<h2>${SECTION_TITLES[id]}</h2>`);
    html = html.replace(/<section class="panel"/, `<section class="panel" id="${id}"`);
  }
  html = html.replace(/<div style="overflow-x:auto">/g, '<div class="sheet-wrap">');
  html = html.replace(/<table>/g, '<table class="sheet">');
  html = html.replace(/<div class="card">/g, '<div class="note">');
  html = html.replace(
    /<ul class="checklist">([\s\S]*?)<\/ul>/g,
    (_, inner) =>
      `<ul class="checklist">${inner.replace(/<li>/g, '<li><input type="checkbox"> ')}</ul>`,
  );
  html = formatMoneyCells(html);
  return html;
}

function extractPanels(html) {
  const matches = [...html.matchAll(/<section class="panel">([\s\S]*?)<\/section>/g)];
  if (!matches.length) throw new Error("No panel sections found");
  return matches.map((m) => restylePanel(`<section class="panel">${m[1]}</section>`)).join("\n");
}

export function composePage(html, meta) {
  return [
    `<div class="page">`,
    renderTopbar(meta),
    renderToc(),
    renderItinerary({ ...meta, days: parseDays(html) }),
    renderPlacesPanel(),
    extractPanels(html),
    `</div>`,
  ].join("\n");
}
