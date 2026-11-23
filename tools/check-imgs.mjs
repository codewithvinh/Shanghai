import { IMG } from "../src/places.mjs";

const UA = "ShanghaiTripPlan/1.0 (link-check)";
for (const [k, url] of Object.entries(IMG)) {
  try {
    const g = await fetch(url, {
      headers: { "User-Agent": UA, Range: "bytes=0-128" },
      redirect: "follow",
    });
    const buf = Buffer.from(await g.arrayBuffer());
    const magic = buf.slice(0, 3).toString("hex");
    const ok = g.ok && (magic === "ffd8ff" || magic === "89504e");
    console.log(ok ? "OK " : "BAD", k, g.status, magic, url.slice(0, 90));
  } catch (e) {
    console.log("ERR", k, e.message);
  }
}
