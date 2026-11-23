import fs from "node:fs";

const pairs = [
  ["backup/2026-11-17-pre-remake/plan-1.body.html", "src/pages/plan-1.body.html"],
  ["backup/2026-11-17-pre-remake/plan-2.body.html", "src/pages/plan-2.body.html"],
];
const spans = (s, lang) => [...s.matchAll(new RegExp(`<span class="${lang}">([\\s\\S]*?)</span>(?=<span class="|</span>)`, "g"))].map((m) => m[1]);

for (const [a, b] of pairs) {
  const A = fs.readFileSync(a, "utf8");
  const B = fs.readFileSync(b, "utf8");
  for (const lang of ["zh", "en"]) {
    const x = spans(A, lang).join("\n");
    const y = spans(B, lang).join("\n");
    console.log(b, lang, x === y ? "unchanged" : "CHANGED");
  }
  const strip = (s) => s.replace(/<span class="vi">[\s\S]*?<\/span>(?=<span class="zh">)/g, "<vi/>");
  console.log(b, "structure", strip(A) === strip(B) ? "unchanged" : "CHANGED");
}

const src = JSON.parse(fs.readFileSync("tools/vi-strings.json", "utf8"));
const all = ["src/pages/plan-1.body.html", "src/pages/plan-2.body.html", "src/places.mjs"].map((f) => fs.readFileSync(f, "utf8")).join("\n");
let missing = 0;
for (let i = 1; i <= 4; i++) {
  for (const o of JSON.parse(fs.readFileSync(`tools/vi-out-${i}.json`, "utf8"))) {
    if (!all.includes(o.vi)) { missing++; console.log("not applied id", o.id, o.vi.slice(0, 70)); }
  }
}
console.log("missing", missing, "of", src.length);
