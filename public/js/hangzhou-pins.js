/* Pins page */
(function () {
  if (!window.PINS || !window.hzPinCard) return;
  function fillGroup(elId, group) {
    const host = document.getElementById(elId);
    if (!host) return;
    host.innerHTML = Object.keys(PINS)
      .filter(function (id) { return PINS[id].group === group; })
      .map(function (id) { return hzPinCard(id, PINS[id], true); })
      .join("");
  }
  fillGroup("pin-hotels", "hotel");
  fillGroup("pin-transit", "transit");
  fillGroup("pin-sights", "sight");
})();
