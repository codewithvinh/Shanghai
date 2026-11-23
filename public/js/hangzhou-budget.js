/* Budget checklist persistence */
(function () {
  try {
    const saved = JSON.parse(localStorage.getItem("hz-check") || "[]");
    document.querySelectorAll(".check input").forEach(function (box, i) {
      box.checked = !!saved[i];
      box.addEventListener("change", function () {
        localStorage.setItem(
          "hz-check",
          JSON.stringify(Array.from(document.querySelectorAll(".check input")).map(function (b) { return b.checked; }))
        );
      });
    });
  } catch (e) {}
  if (location.hash) {
    requestAnimationFrame(function () {
      const t = document.querySelector(location.hash);
      if (t) t.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }
})();
