(function () {
  var notes = document.getElementById("modNotes");

  function currentLang() {
    return document.documentElement.lang || "vi";
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem("planLang", lang);
    document.querySelectorAll(".lang button[data-lang]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    if (notes) notes.placeholder = notes.getAttribute("data-ph-" + lang) || "";
  }
  document.querySelectorAll(".lang button[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { apply(b.dataset.lang); });
  });
  apply(localStorage.getItem("planLang") || "vi");

  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  var toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }

  var LABELS = {
    address: { vi: "Đã sao chép địa chỉ", zh: "已复制地址", en: "Address copied" },
    summary: { vi: "Đã sao chép tóm tắt", zh: "已复制确认摘要", en: "Summary copied" },
    notes: { vi: "Muốn sửa", zh: "修改意见", en: "Changes" },
  };

  function label(key) {
    return LABELS[key][currentLang()] || LABELS[key].vi;
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) {}
    document.body.removeChild(ta);
  }

  function copyText(text, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { showToast(msg); }, function () {
        fallbackCopy(text);
        showToast(msg);
      });
    } else {
      fallbackCopy(text);
      showToast(msg);
    }
  }

  function summaryText() {
    var box = document.getElementById("copyBox");
    if (!box) return "";
    var part = box.querySelector("." + currentLang()) || box.querySelector(".vi");
    var text = part ? part.textContent.trim() : box.textContent.trim();
    var extra = notes && notes.value.trim();
    return extra ? text + "\n\n" + label("notes") + ": " + extra : text;
  }

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  /** Try native map scheme; if app does not open, fall back to https (skip if page already hid). */
  function openNativeThen(scheme, fallback) {
    var start = Date.now();
    var done = false;
    function goFallback() {
      if (done) return;
      if (document.hidden) return;
      if (Date.now() - start > 1600) return;
      done = true;
      window.location.href = fallback;
    }
    document.addEventListener("visibilitychange", function onHide() {
      if (document.hidden) {
        done = true;
        document.removeEventListener("visibilitychange", onHide);
      }
    });
    window.location.href = scheme;
    setTimeout(goFallback, 900);
  }

  document.addEventListener("click", function (e) {
    var addr = e.target.closest(".btn-copy");
    if (addr) {
      var text = addr.getAttribute("data-copy") || "";
      if (text) copyText(text, label("address"));
      return;
    }
    if (e.target.closest("#copyBtn")) {
      var summary = summaryText();
      if (summary) copyText(summary, label("summary"));
      return;
    }

    var mapBtn = e.target.closest("a.btn-map[data-map]");
    if (mapBtn) {
      var kind = mapBtn.getAttribute("data-map");
      var q = mapBtn.getAttribute("data-q") || "";
      var fallback = mapBtn.href;
      try { q = decodeURIComponent(q); } catch (_) {}

      // Amap: never use iosamap:// from Files/WebView — it often swallows the tap.
      // HTTPS + callnative (or surl) only hand off reliably when Safari opens the link.
      if (kind === "amap") {
        e.preventDefault();
        if (isIOS()) {
          // Prefer a new Safari tab from Files / in-app browsers
          var opened = window.open(fallback, "_blank");
          if (!opened) window.location.href = fallback;
        } else {
          window.location.href = fallback;
        }
        return;
      }

      if (!q) return;

      // Desktop Google: let the normal <a> work
      if (!isIOS() && !isAndroid()) return;

      e.preventDefault();
      if (kind === "google") {
        if (isIOS()) {
          openNativeThen(
            "comgooglemaps://?q=" + encodeURIComponent(q),
            fallback
          );
        } else {
          openNativeThen(
            "geo:0,0?q=" + encodeURIComponent(q),
            fallback
          );
        }
      }
    }
  });

  var reopen = [];
  window.addEventListener("beforeprint", function () {
    reopen = [];
    document.querySelectorAll("details:not([open])").forEach(function (d) {
      d.open = true;
      reopen.push(d);
    });
  });
  window.addEventListener("afterprint", function () {
    reopen.forEach(function (d) { d.open = false; });
  });
})();
