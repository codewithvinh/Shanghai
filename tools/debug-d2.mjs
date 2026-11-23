import fs from "node:fs";
let html = fs.readFileSync("src/pages/plan-1.body.html", "utf8");
const idx = html.indexOf("D2 10/1");
console.log(JSON.stringify(html.slice(idx - 120, idx + 20)));
const a = html.lastIndexOf("<article", idx);
console.log(JSON.stringify(html.slice(a, a + 100)));
const needle = '<article class="day-card">\n<div class="day-head">\n  <span class="chip day"><span class="i18n"><span class="vi">D2 10/1';
console.log("needle", html.indexOf(needle));
console.log("loose", html.indexOf('<span class="vi">D2 10/1'));
