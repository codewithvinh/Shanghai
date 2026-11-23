const UA = "ShanghaiTripPlan/1.0";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function search(q) {
  await sleep(1500);
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: q,
    srnamespace: "6",
    srlimit: "4",
    format: "json",
  });
  const j = await fetch(u, { headers: { "User-Agent": UA } }).then((r) => r.json());
  console.log(q, "=>", (j.query?.search || []).map((x) => x.title).join(" | "));
}
for (const q of [
  "Wuzhen water",
  "Lingyin Temple",
  "Yuyuan Garden",
  "The Bund night",
  "Hefang Street Hangzhou",
]) {
  await search(q);
}
