/* Days page: hydrate inline pins */
(function () {
  if (!window.PINS || !window.hzPinCard) return;
  document.querySelectorAll("[data-pin]").forEach(function (el) {
    const id = el.getAttribute("data-pin");
    const p = PINS[id];
    if (!p) return;
    el.innerHTML = hzPinCard(id, p, false);
  });
})();
