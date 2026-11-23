import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { composeCards } from "./compose.mjs";
import { IMG } from "./places.mjs";

const srcDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(srcDir, "..");
const publicDir = path.join(root, "public");

function i18n(vi, zh, en) {
  return `<span class="i18n"><span class="vi">${vi}</span><span class="zh">${zh}</span><span class="en">${en}</span></span>`;
}

const PAGES = [
  {
    body: "pages/plan-1.body.html",
    out: "shanghai-plan.html",
    title:
      "Kế hoạch 1 — Hàng Châu, Ô Trấn, Thượng Hải / 行程一：杭州、乌镇、上海 / Plan 1 — Hangzhou, Wuzhen, Shanghai",
    sheet: {
      title: i18n(
        "KẾ HOẠCH HÀNG CHÂU – Ô TRẤN – THƯỢNG HẢI",
        "行程：杭州 – 乌镇 – 上海",
        "HANGZHOU – WUZHEN – SHANGHAI",
      ),
      dates: i18n(
        "Thời gian: Ngày 08/01–14/01/2027",
        "时间：2027年1月8日–14日",
        "Dates: 8–14 Jan 2027",
      ),
      otherHref: "shanghai-plan-2.html",
      otherLabel: i18n("Kế hoạch 2", "行程二", "Plan 2"),
    },
    options: { places: true, heroImg: IMG.westlake },
  },
  {
    body: "pages/plan-2.body.html",
    out: "shanghai-plan-2.html",
    title:
      "Kế hoạch 2 — Hàng Châu 2 ngày, Ô Trấn, Thượng Hải / 行程二：杭州两天、乌镇、上海 / Plan 2 — Hangzhou 2 days, Wuzhen, Shanghai",
    sheet: {
      title: i18n(
        "KẾ HOẠCH HÀNG CHÂU 2 NGÀY – Ô TRẤN – THƯỢNG HẢI",
        "行程：杭州两天 – 乌镇 – 上海",
        "HANGZHOU 2 DAYS – WUZHEN – SHANGHAI",
      ),
      dates: i18n(
        "Thời gian: Ngày 08/01–15/01/2027",
        "时间：2027年1月8日–15日",
        "Dates: 8–15 Jan 2027",
      ),
      otherHref: "shanghai-plan.html",
      otherLabel: i18n("Kế hoạch 1", "行程一", "Plan 1"),
    },
    options: { places: true, heroImg: IMG.westlake },
  },
];

function read(rel) {
  return fs.readFileSync(path.join(srcDir, rel), "utf8");
}

function applyPartials(html) {
  return html.replace(/<!--INCLUDE:([a-z0-9_-]+)-->/gi, (_, name) => {
    const file = path.join(srcDir, "partials", `${name}.html`);
    if (!fs.existsSync(file)) throw new Error(`Missing partial: ${name}`);
    return fs.readFileSync(file, "utf8").trim();
  });
}

function wrap({ title, body, css, js }) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>${title}</title>
<style>
${css.trim()}
</style>
</head>
<body>
${body.trim()}
<script>
${js.trim()}
</script>
</body>
</html>
`;
}

fs.mkdirSync(publicDir, { recursive: true });
const css = read("styles.css");
const js = read("app.js");

for (const page of PAGES) {
  const body = composeCards(
    applyPartials(read(page.body)),
    page.sheet,
    page.options,
  );
  const html = wrap({
    title: page.title,
    body,
    css,
    js,
  });
  const dest = path.join(publicDir, page.out);
  fs.writeFileSync(dest, html, "utf8");
  if (html.includes("\uFFFD")) {
    throw new Error(`Replacement char in ${page.out}`);
  }
  console.log("wrote", path.relative(root, dest), html.length, "chars");
}
