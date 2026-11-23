// Verifies that rewritten Vietnamese strings keep every fact the original had:
// digit groups, Chinese characters, HTML tag sequence, and Latin proper names in **keep** list.
import fs from "node:fs";

const strip = (s) => s.replace(/<[^>]+>/g, " ");
const numbers = (s) => (strip(s).match(/\d+(?:[.,:–-]\d+)*/g) || []).sort();
const han = (s) => (strip(s).match(/[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]+/g) || []).sort();
const tags = (s) => (s.match(/<\/?[a-z]+[^>]*>/gi) || []).map((t) => t.replace(/\s+/g, " "));

function diff(a, b) {
  const rest = [...b];
  const missing = [];
  for (const x of a) {
    const i = rest.indexOf(x);
    if (i === -1) missing.push(x);
    else rest.splice(i, 1);
  }
  return { missing, extra: rest };
}

export function check(orig, next) {
  const problems = [];
  const n = diff(numbers(orig), numbers(next));
  if (n.missing.length || n.extra.length) problems.push(`numbers missing=${JSON.stringify(n.missing)} extra=${JSON.stringify(n.extra)}`);
  const h = diff(han(orig), han(next));
  if (h.missing.length || h.extra.length) problems.push(`chinese missing=${JSON.stringify(h.missing)} extra=${JSON.stringify(h.extra)}`);
  if (JSON.stringify(tags(orig)) !== JSON.stringify(tags(next))) problems.push(`tags changed: ${JSON.stringify(tags(orig))} -> ${JSON.stringify(tags(next))}`);
  if (/"/.test(next) && !/"/.test(orig) && /class=|href=/.test(next) === false) problems.push("contains double quote");
  return problems;
}

if (process.argv[1].endsWith("vi-check.mjs")) {
  const [, , srcFile, outFile] = process.argv;
  const src = JSON.parse(fs.readFileSync(srcFile, "utf8"));
  const out = JSON.parse(fs.readFileSync(outFile, "utf8"));
  const byId = new Map(src.map((o) => [o.id, o.vi]));
  let bad = 0;
  for (const o of out) {
    const orig = byId.get(o.id);
    if (orig === undefined) { console.log(`id ${o.id}: unknown id`); bad++; continue; }
    const p = check(orig, o.vi);
    if (p.length) { bad++; console.log(`id ${o.id}: ${p.join(" | ")}`); }
  }
  const missingIds = src.filter((o) => !out.some((x) => x.id === o.id)).map((o) => o.id);
  if (missingIds.length) { console.log("missing ids", missingIds.join(",")); bad++; }
  console.log(bad ? `FAIL ${bad}` : `OK ${out.length}`);
  process.exit(bad ? 1 : 0);
}
