import fs from "node:fs";
const spans = (s, lang) => [...s.matchAll(new RegExp(`<span class="${lang}">([\\s\\S]*?)</span>(?=<span class="|</span>)`, "g"))].map((m) => m[1].replace(/<span class="vi">[\s\S]*?<\/span>(?=\s*<span class="zh">)/g, "<vi/>"));
const A = fs.readFileSync("backup/2026-11-17-pre-remake/plan-1.body.html", "utf8");
const B = fs.readFileSync("src/pages/plan-1.body.html", "utf8");
for (const lang of ["zh", "en"]) {
  const x = spans(A, lang), y = spans(B, lang);
  console.log(lang, x.length, y.length);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] !== y[i]) {
      let k = 0; while (x[i][k] === y[i][k]) k++;
      console.log("A:", x[i].slice(k - 80, k + 200)); console.log("B:", y[i].slice(k - 80, k + 200));
    }
  }
}
