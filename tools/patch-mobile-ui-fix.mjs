import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/hangzhou-trip.html");
let html = fs.readFileSync(file, "utf8");

const oldChips = `    <div class="stick">
      <nav class="chips" aria-label="Ngày">
        <a href="#pins">Địa chỉ</a>
        <a href="#d0">Đêm 07</a>
        <a href="#d1">08 HC</a>
        <a href="#d2">09 HC</a>
        <a href="#d3">10 Ô Trấn</a>
        <a href="#d4">11 SH</a>
        <a href="#d5">12 Disney</a>
        <a href="#d6">13 Về</a>
        <a href="#food">Ăn</a>
        <a href="#tips">Tips</a>
      </nav>
    </div>`;

const newChips = `    <div class="stick">
      <nav class="chips" aria-label="Ngày">
        <a href="#pins"><svg class="ico"><use href="#i-pin"></use></svg> Địa chỉ</a>
        <a href="#d0"><svg class="ico"><use href="#i-moon"></use></svg> Đêm 07</a>
        <a href="#d1"><svg class="ico"><use href="#i-cal"></use></svg> 08 HC</a>
        <a href="#d2"><svg class="ico"><use href="#i-cal"></use></svg> 09 HC</a>
        <a href="#d3"><svg class="ico"><use href="#i-cam"></use></svg> 10 Ô Trấn</a>
        <a href="#d4"><svg class="ico"><use href="#i-cam"></use></svg> 11 SH</a>
        <a href="#d5"><svg class="ico"><use href="#i-star"></use></svg> 12 Disney</a>
        <a href="#d6"><svg class="ico"><use href="#i-plane"></use></svg> 13 Về</a>
        <a href="#food"><svg class="ico"><use href="#i-food"></use></svg> Ăn</a>
        <a href="#tips"><svg class="ico"><use href="#i-tips"></use></svg> Tips</a>
      </nav>
    </div>`;

if (html.includes(oldChips)) {
  html = html.replace(oldChips, newChips);
  console.log("chips: updated");
} else if (html.includes("#i-moon")) {
  console.log("chips: already have icons");
} else {
  console.log("chips: OLD not found");
}

const heroRe =
  /\n    <figure class="hero">[\s\S]*?<\/figure>\n\n    <div class="stats">[\s\S]*?<\/div>\n\n    <div class="route">[\s\S]*?<\/div>\n    <p class="note">Sổ tay iPhone[\s\S]*?<\/p>\n/;
const m = html.match(heroRe);
if (!m) {
  console.log("hero: block not found");
} else {
  let block = m[0];
  block = block
    .replace('<div class="stat"><b>Bay</b>', '<div class="stat"><b><svg class="ico"><use href="#i-plane"></use></svg> Bay</b>')
    .replace('<div class="stat"><b>Đêm đầu</b>', '<div class="stat"><b><svg class="ico"><use href="#i-moon"></use></svg> Đêm đầu</b>')
    .replace('<div class="stat"><b>Lưu trú</b>', '<div class="stat"><b><svg class="ico"><use href="#i-hotel"></use></svg> Lưu trú</b>')
    .replace('<div class="stat"><b>Ngân sách</b>', '<div class="stat"><b><svg class="ico"><use href="#i-wallet"></use></svg> Ngân sách</b>');
  html = html.replace(m[0], "\n");
  const marker = '    </div>\n\n    <section class="itin" id="days">';
  if (html.includes(marker)) {
    html = html.replace(marker, `    </div>\n${block}\n    <section class="itin" id="days">`);
    console.log("hero: moved before days", html.indexOf('class="hero"') < html.indexOf('id="days"'));
  } else {
    console.log("hero: insert marker missing");
  }
}

if (!html.includes("function syncDock")) {
  const needle = `document.querySelector(".dock").addEventListener("click", function (e) {
      const a = e.target.closest("a[href^=\\"#\\"]");
      if (!a) return;
      e.preventDefault();
      gotoHash(a.getAttribute("href"), true);
    });`;
  const insert = `document.querySelector(".dock").addEventListener("click", function (e) {
      const a = e.target.closest("a[href^=\\"#\\"]");
      if (!a) return;
      e.preventDefault();
      gotoHash(a.getAttribute("href"), true);
    });
    function syncDock() {
      const map = { pins: "#pins", d0: "#days", d1: "#days", d2: "#days", d3: "#days", d4: "#days", d5: "#days", d6: "#days", days: "#days", food: "#food", "food-pins": "#food", tips: "#tips", budget: "#tips", check: "#tips" };
      const stick = document.querySelector(".stick");
      const line = (stick ? stick.offsetHeight : 57) + 16;
      let key = "d0";
      ["pins", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "food", "tips"].forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - line <= 8) key = id;
      });
      const href = map[key] || "#days";
      document.querySelectorAll(".dock a[href^=\\"#\\"]").forEach(function (a) {
        a.classList.toggle("is-on", a.getAttribute("href") === href);
      });
    }`;
  if (html.includes(needle)) {
    html = html.replace(needle, insert);
    console.log("syncDock: inserted");
  } else {
    console.log("syncDock: needle missing");
    // debug nearby
    const i = html.indexOf('document.querySelector(".dock")');
    console.log("dock idx", i, JSON.stringify(html.slice(i, i + 220)));
  }
}

if (!html.includes("syncDock();")) {
  html = html.replace(
    "syncChip._t = setTimeout(syncChip, 50);",
    "syncChip._t = setTimeout(function () { syncChip(); syncDock(); }, 50);"
  );
  html = html.replace(
    "syncChip();\n    if (location.hash)",
    "syncChip();\n    syncDock();\n    if (location.hash)"
  );
  console.log("scroll: hooked syncDock");
}

const oldCopy = `        const defaultLbl = one.closest(".inline-pin") ? "Copy" : "Copy địa chỉ";
        copyText(text).then(function () {
          one.classList.add("ok");
          one.textContent = "Đã copy";
          toast("Đã copy: " + text);
          setTimeout(function () { one.classList.remove("ok"); one.textContent = defaultLbl; }, 1600);
        })`;
const newCopy = `        const defaultLbl = one.getAttribute("data-label") || (one.closest(".inline-pin") ? "Copy" : "Copy địa chỉ");
        copyText(text).then(function () {
          one.classList.add("ok");
          one.innerHTML = ico("copy") + "Đã copy";
          toast("Đã copy: " + text);
          setTimeout(function () { one.classList.remove("ok"); one.innerHTML = ico("copy") + defaultLbl; }, 1600);
        })`;
if (html.includes(oldCopy)) {
  html = html.replace(oldCopy, newCopy);
  console.log("copy handler: updated");
} else if (html.includes('one.innerHTML = ico("copy")')) {
  console.log("copy handler: already updated");
} else {
  console.log("copy handler: old not found");
}

const oldMany = `          manyText.classList.add("ok");
          manyText.textContent = "Đã copy";
          toast("Đã copy địa chỉ trong khu");
          setTimeout(function () { manyText.classList.remove("ok"); manyText.textContent = "Copy khu"; }, 1600);`;
const newMany = `          manyText.classList.add("ok");
          manyText.innerHTML = ico("copy") + "Đã copy";
          toast("Đã copy địa chỉ trong khu");
          setTimeout(function () { manyText.classList.remove("ok"); manyText.innerHTML = ico("copy") + "Copy khu"; }, 1600);`;
if (html.includes(oldMany)) {
  html = html.replace(oldMany, newMany);
  console.log("copy many: updated");
} else if (html.includes('manyText.innerHTML = ico("copy")')) {
  console.log("copy many: already updated");
} else {
  console.log("copy many: old not found");
}

fs.writeFileSync(file, html);
console.log("done", html.length);
