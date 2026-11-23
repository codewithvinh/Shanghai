import fs from "node:fs";

const UA = "Mozilla/5.0";
async function pull(url, dest) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  console.log(dest, r.status, r.headers.get("content-type"));
  if (!r.ok) return;
  const b = Buffer.from(await r.arrayBuffer());
  console.log(" bytes", b.length, b.slice(0, 3).toString("hex"));
  if (b[0] === 0xff && b[1] === 0xd8) fs.writeFileSync("public/img/" + dest, b);
}

await pull(
  "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=1200&q=80&auto=format",
  "food-yuxingji.jpg",
);
await pull(
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&q=80&auto=format",
  "food-greentea.jpg",
);
fs.copyFileSync("public/img/food-xinzhouji.jpg", "public/img/food-waipojia.jpg");
console.log("waipo copied from dongpo");
if (!fs.existsSync("public/img/sight-lingyin.jpg")) {
  fs.copyFileSync("public/img/sight-westlake.jpg", "public/img/sight-lingyin.jpg");
}
