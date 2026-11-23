/* Food page: zones + boards */
(function () {
  if (!window.PINS || !window.hzPinCard) return;

  function fillFoodZones() {
    const host = document.getElementById("pin-food");
    if (!host || !window.FOOD_AREAS) return;
    host.innerHTML = FOOD_AREAS.map(function (zone) {
      const ids = Object.keys(PINS).filter(function (id) {
        return PINS[id].group === "food" && PINS[id].area === zone.id;
      });
      if (!ids.length) return "";
      const cards = ids.map(function (id) { return hzPinCard(id, PINS[id], true); }).join("");
      const copyBlock = ids.map(function (id) {
        const p = PINS[id];
        return p.vi + "\n" + p.zh;
      }).join("\n\n");
      const countLbl = ids.length + " điểm";
      return (
        '<details class="food-zone"' + (zone.open ? " open" : "") + ">" +
        "<summary>" +
        '<div class="zone-title"><b>' + zone.title + "</b><span>" + zone.sub + " · " + countLbl + "</span></div>" +
        '<div class="zone-tools">' +
        '<button type="button" class="btn btn-copy" data-copy-many-text="' + encodeURIComponent(copyBlock) + '">' + hzIco("copy") + "Copy khu</button>" +
        '<span class="chev" aria-hidden="true">▾</span>' +
        "</div></summary>" +
        '<div class="zone-body"><div class="zone-grid">' + cards + "</div></div>" +
        "</details>"
      );
    }).join("");
  }
  fillFoodZones();

  const btn = document.getElementById("toggle-food-zones");
  if (btn) {
    btn.addEventListener("click", function () {
      const zones = Array.prototype.slice.call(document.querySelectorAll("#pin-food .food-zone"));
      const openAll = zones.some(function (z) { return !z.open; });
      zones.forEach(function (z) { z.open = openAll; });
      btn.textContent = openAll ? "Gập hết" : "Mở hết";
    });
  }

  const boards = document.getElementById("food-boards");
  if (boards && window.FOOD) {
    boards.innerHTML = FOOD.map(function (b) {
      const rows = b.items.map(function (r) {
        return '<article class="food-row"><div class="food-when">' + r[0] + "</div><b>" + r[1] + '</b><p class="zh" lang="zh">' + r[2] + "</p><p>" + r[3] + "</p></article>";
      }).join("");
      return '<h3 style="margin:16px 16px 8px;font-size:16px">' + b.city + '</h3><div class="food-list">' + rows + "</div>";
    }).join("");
  }
})();
