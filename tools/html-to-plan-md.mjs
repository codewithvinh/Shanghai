/**
 * Extract Vietnamese itinerary tables from plan-*.body.html into markdown stubs
 * for spot-checking. Full MD files are maintained separately; this dumps day tables.
 */
import fs from "fs";

function viOnly(html) {
  return html
    .replace(/<span class="zh">[\s\S]*?<\/span>/g, "")
    .replace(/<span class="en">[\s\S]*?<\/span>/g, "")
    .replace(/<span class="i18n">/g, "")
    .replace(/<\/span>/g, "")
    .replace(/<ul class="tips">/g, "")
    .replace(/<\/ul>/g, "")
    .replace(/<li>/g, "• ")
    .replace(/<\/li>/g, "<br>")
    .replace(/<br\s*\/?>/gi, " · ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extract(planId) {
  const html = fs.readFileSync(`src/pages/plan-${planId}.body.html`, "utf8");
  const days = [];
  const dayBlocks = [
    ...html.matchAll(
      /<h3><span class="i18n"><span class="vi">(Ngày[^<]+)<\/span>[\s\S]*?(?:<p class="city-line"><span class="i18n"><span class="vi">([^<]*)<\/span>[\s\S]*?)?<p><span class="i18n"><span class="vi">([\s\S]*?)<\/span><span class="zh">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/g,
    ),
  ];
  for (const m of dayBlocks) {
    const title = m[1];
    const city = m[2] || "";
    const blurb = viOnly(m[3]);
    const rows = [...m[4].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => {
      const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) =>
        viOnly(c[1]),
      );
      return cells;
    });
    days.push({ title, city, blurb, rows });
  }

  // hotels
  const stay = html.match(/id="stay"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/);
  const hotels = stay
    ? [...stay[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) =>
        [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => viOnly(c[1])),
      )
    : [];

  // budget
  const bud = html.match(/id="budget"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/);
  const budget = bud
    ? [...bud[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) =>
        [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => viOnly(c[1])),
      )
    : [];

  return { days, hotels, budget };
}

for (const id of ["1", "2"]) {
  const data = extract(id);
  fs.writeFileSync(`tools/_md-extract-p${id}.json`, JSON.stringify(data, null, 2));
  console.log(`plan ${id}: ${data.days.length} days, ${data.hotels.length} hotels, ${data.budget.length} budget rows`);
}
