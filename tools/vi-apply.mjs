import fs from "node:fs";
import { check } from "./vi-check.mjs";

const src = JSON.parse(fs.readFileSync("tools/vi-strings.json", "utf8"));
const byId = new Map(src.map((o) => [o.id, o.vi]));

const rewrites = new Map();
for (let i = 1; i <= 4; i++) {
  for (const o of JSON.parse(fs.readFileSync(`tools/vi-out-${i}.json`, "utf8"))) {
    const orig = byId.get(o.id);
    if (orig !== o.vi) rewrites.set(orig, o.vi);
  }
}

const labels = {
  "Bốn trục chính": "Bốn thứ phải có",
  "Trải nghiệm giữ lại": "Mấy thứ không được bỏ",
  "Năm điểm cần nhìn lại": "Năm điều nhìn lại lần cuối",
  "Xem giờ và chi phí": "Xem giờ giấc & chi phí",
  "Vì sao giữ": "Vì sao đáng giữ",
  "Muốn sửa gì thì viết vào đây": "Muốn đổi gì thì ghi vào đây nha",
  "Sao chép tóm tắt": "Copy tóm tắt",
  "Sao chép địa chỉ": "Copy địa chỉ",
  "Địa chỉ & bản đồ": "Địa chỉ & bản đồ — bấm là đi",
};
for (const [from, to] of Object.entries(labels)) {
  if (!src.some((o) => o.vi === from)) throw new Error(`label not found: ${from}`);
  rewrites.set(from, to);
}

let bad = 0;
for (const [orig, next] of rewrites) {
  const p = check(orig, next);
  if (p.length) { bad++; console.log("REJECT", orig.slice(0, 60), p); }
}
if (bad) process.exit(1);

const counts = {};
for (const f of ["src/pages/plan-1.body.html", "src/pages/plan-2.body.html"]) {
  let s = fs.readFileSync(f, "utf8");
  let n = 0;
  for (const [orig, next] of rewrites) {
    const from = `<span class="vi">${orig}</span><span class="zh">`;
    const to = `<span class="vi">${next}</span><span class="zh">`;
    const parts = s.split(from);
    n += parts.length - 1;
    s = parts.join(to);
  }
  fs.writeFileSync(f, s, "utf8");
  counts[f] = n;
}

let p = fs.readFileSync("src/places.mjs", "utf8");
let pn = 0;
for (const [orig, next] of rewrites) {
  const parts = p.split(`"${orig}"`);
  pn += parts.length - 1;
  p = parts.join(`"${next}"`);
}
fs.writeFileSync("src/places.mjs", p, "utf8");
counts["src/places.mjs"] = pn;

console.log("rewrites", rewrites.size, counts);
