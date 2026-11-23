import fs from "node:fs";

const files = ["src/pages/plan-1.body.html", "src/pages/plan-2.body.html"];
const re = /<span class="vi">([\s\S]*?)<\/span>(?=<span class="zh">)/g;

const seen = new Map();
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  for (const m of s.matchAll(re)) {
    const text = m[1];
    if (!seen.has(text)) seen.set(text, new Set());
    seen.get(text).add(f.includes("plan-1") ? "p1" : "p2");
  }
}

const places = fs.readFileSync("src/places.mjs", "utf8");
for (const m of places.matchAll(/i18n\(\s*\n?\s*"([^"]*)"/g)) {
  if (!seen.has(m[1])) seen.set(m[1], new Set());
  seen.get(m[1]).add("places");
}

const out = [...seen].map(([vi, where], i) => ({ id: i, where: [...where].join(","), vi }));
fs.writeFileSync("tools/vi-strings.json", JSON.stringify(out, null, 1), "utf8");
const only = (tag) => out.filter((o) => o.where === tag).length;
console.log("unique", out.length, "p1-only", only("p1"), "p2-only", only("p2"), "shared", out.filter((o) => o.where.includes("p1") && o.where.includes("p2")).length, "places", only("places"));
console.log("chars", out.reduce((a, o) => a + o.vi.length, 0));
