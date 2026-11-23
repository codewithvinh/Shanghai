/* Shared helpers + dock + copy + PWA */
(function () {
  "use strict";

  function ico(name) {
    return '<svg class="ico" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  }
  window.hzIco = ico;

  function amapHref(p) {
    if (p.amap) return p.amap;
    if (p.lat && p.lng) {
      return "https://uri.amap.com/marker?position=" + p.lng + "," + p.lat + "&name=" + encodeURIComponent(p.vi || p.name || "") + "&coordinate=gaode&callnative=1";
    }
    return "https://www.amap.com/search?query=" + encodeURIComponent(p.zh || p.name || p.vi || "");
  }
  function gmapHref(p) {
    if (p.lat && p.lng) return "https://www.google.com/maps?q=" + p.lat + "," + p.lng;
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.zh || p.name || p.vi || "");
  }
  window.hzAmapHref = amapHref;
  window.hzGmapHref = gmapHref;

  function pinCard(id, p, withId) {
    const dishes = (p.dishes || []).map(function (d) {
      return '<span class="chip opt">' + d + "</span>";
    }).join(" ");
    const copyLbl = withId ? "Copy địa chỉ" : "Copy";
    const kind = p.kind === "drink"
      ? '<span class="kind drink">' + ico("drink") + " Đồ uống</span>"
      : (p.group === "food" ? '<span class="kind">' + ico("food") + " Ăn</span>" : "");
    const tel = p.tel
      ? '<a class="tel" href="tel:' + String(p.tel).replace(/[^0-9+]/g, "") + '">' + ico("phone") + " " + p.tel + "</a>"
      : "";
    const img = p.img
      ? '<img src="' + p.img + '" alt="' + (p.vi || "") + '" loading="lazy">'
      : "";
    return (
      '<article class="pin"' + (withId ? ' id="pin-' + id + '"' : "") + ">" +
      img +
      '<div class="meta">' + kind +
      (p.k ? '<div class="k">' + p.k + "</div>" : "") +
      "<h3>" + (p.vi || p.name || "") + "</h3>" +
      (p.zh ? '<p class="zh" lang="zh">' + p.zh + "</p>" : "") +
      tel +
      (dishes ? '<div style="margin-top:6px">' + dishes + "</div>" : "") +
      '<div class="actions">' +
      '<button type="button" class="btn btn-copy" data-copy="' + String(p.zh || p.name || p.vi || "").replace(/"/g, "&quot;") + '" data-label="' + copyLbl + '">' + ico("copy") + copyLbl + "</button>" +
      '<a class="btn btn-amap" href="' + amapHref(p) + '" target="_blank" rel="noopener">' + ico("map") + "Amap</a>" +
      '<a class="btn btn-gmap" href="' + gmapHref(p) + '" target="_blank" rel="noopener">' + ico("nav") + "Maps</a>" +
      "</div></div></article>"
    );
  }
  window.hzPinCard = pinCard;

  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._id);
    toast._id = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  window.hzToast = toast;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:0;top:0;opacity:0.01;width:1px;height:1px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, text.length);
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        ok ? resolve() : reject();
      } catch (e) {
        document.body.removeChild(ta);
        reject(e);
      }
    });
  }
  window.hzCopyText = copyText;

  document.addEventListener("click", function (e) {
    if (e.target.closest(".food-zone summary button, .food-zone summary a")) {
      e.preventDefault();
      e.stopPropagation();
    }

    const one = e.target.closest("[data-copy]");
    const manyText = e.target.closest("[data-copy-many-text]");
    const many = e.target.closest("[data-copy-many]");
    if (one) {
      const text = one.getAttribute("data-copy");
      const defaultLbl = one.getAttribute("data-label") || (one.closest(".inline-pin") ? "Copy" : "Copy địa chỉ");
      copyText(text).then(function () {
        one.classList.add("ok");
        one.innerHTML = ico("copy") + "Đã copy";
        toast("Đã copy: " + text);
        setTimeout(function () { one.classList.remove("ok"); one.innerHTML = ico("copy") + defaultLbl; }, 1600);
      }).catch(function () {
        const zh = one.closest(".pin") && one.closest(".pin").querySelector(".zh");
        if (zh) {
          const range = document.createRange();
          range.selectNodeContents(zh);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        toast("Địa chỉ đã chọn — giữ tay → Copy");
      });
    }
    if (manyText) {
      const block = decodeURIComponent(manyText.getAttribute("data-copy-many-text") || "");
      copyText(block).then(function () {
        manyText.classList.add("ok");
        manyText.innerHTML = ico("copy") + "Đã copy";
        toast("Đã copy địa chỉ trong khu");
        setTimeout(function () { manyText.classList.remove("ok"); manyText.innerHTML = ico("copy") + "Copy khu"; }, 1600);
      }).catch(function () { toast("Giữ tay chọn chữ rồi copy"); });
    }
    if (many) {
      const ids = many.getAttribute("data-copy-many").split(",");
      const block = ids.map(function (id) {
        const p = PINS[id];
        return p.vi + "\n" + p.zh;
      }).join("\n\n");
      copyText(block).then(function () { toast("Đã copy 3 khách sạn"); }).catch(function () { toast("Giữ tay chọn chữ rồi copy"); });
    }
  });

  // Dock: mark active by pathname (also works if HTML set aria-current)
  (function markDock() {
    const file = (location.pathname.split("/").pop() || "hangzhou-days.html").toLowerCase();
    document.querySelectorAll(".dock a[href]").forEach(function (a) {
      const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      const on = href === file || (file === "" && href.indexOf("days") >= 0);
      a.classList.toggle("is-on", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  })();

  // Days: chips hash scroll only
  (function chipsNav() {
    const chips = document.querySelector(".chips");
    if (!chips) return;

    function setStickH() {
      const s = document.querySelector(".stick");
      if (s) document.documentElement.style.setProperty("--stick-h", s.offsetHeight + "px");
    }
    setStickH();
    window.addEventListener("resize", setStickH);

    function syncChip() {
      const stick = document.querySelector(".stick");
      const line = (stick ? stick.offsetHeight : 57) + 16;
      const order = ["d0", "d1", "d2", "d3", "d4", "d5", "d6"];
      let href = "#d0";
      order.forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - line <= 8) href = "#" + id;
      });
      let current = null;
      chips.querySelectorAll('a[href^="#"]').forEach(function (a) {
        const on = a.getAttribute("href") === href;
        a.classList.toggle("is-on", on);
        if (on) current = a;
      });
      if (current && syncChip._href !== href) {
        syncChip._href = href;
        const left = current.offsetLeft - (chips.clientWidth - current.offsetWidth) / 2;
        chips.scrollLeft = Math.max(0, left);
      }
    }

    chips.addEventListener("click", function (e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      a.blur();
      const hash = a.getAttribute("href");
      const t = document.querySelector(hash);
      if (!t) return;
      history.pushState(null, "", hash);
      t.scrollIntoView({ behavior: "smooth", block: "start" });
      requestAnimationFrame(syncChip);
    });

    window.addEventListener("scroll", function () {
      clearTimeout(syncChip._t);
      syncChip._t = setTimeout(syncChip, 50);
    }, { passive: true });
    syncChip();
    if (location.hash) {
      requestAnimationFrame(function () {
        const t = document.querySelector(location.hash);
        if (t) t.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
  })();

  // PWA silent
  (function () {
    const banner = document.getElementById("pwa-banner");
    const installBtn = document.getElementById("pwa-install");
    const dismissBtn = document.getElementById("pwa-dismiss");
    const bannerText = document.getElementById("pwa-banner-text");
    let deferredPrompt = null;
    const dismissed = localStorage.getItem("hz-pwa-dismiss") === "1";

    function isStandalone() {
      return window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true;
    }
    function showBanner(iosHint) {
      if (!banner || dismissed || isStandalone()) return;
      banner.hidden = false;
      if (iosHint) {
        bannerText.textContent = "iPhone: Share → Thêm vào Màn hình chính.";
        installBtn.hidden = true;
      }
      banner.classList.add("show");
    }
    if (!isStandalone() && /iphone|ipad|ipod/i.test(navigator.userAgent)) showBanner(true);
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      showBanner(false);
    });
    if (installBtn) {
      installBtn.addEventListener("click", function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
          banner.classList.remove("show");
          banner.hidden = true;
        });
      });
    }
    if (dismissBtn) {
      dismissBtn.addEventListener("click", function () {
        localStorage.setItem("hz-pwa-dismiss", "1");
        banner.classList.remove("show");
        banner.hidden = true;
      });
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js", { scope: "./" }).then(function (reg) { reg.update(); }).catch(function () {});
    }
  })();
})();
