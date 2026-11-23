/* Map page — Amap JS API embed + place chips + deep links */
(function () {
  if (!window.PINS || !window.hzIco) return;

  if (PINS.pvg && !PINS.pvg.lat) {
    PINS.pvg.lat = "31.144343";
    PINS.pvg.lng = "121.808273";
  }

  const STORAGE_KEY = "hz-amap-key";
  const STORAGE_SEC = "hz-amap-sec";

  const places = [
    { id: "homeinn_hz", label: "KS Hàng Châu", icon: "hotel" },
    { id: "wuzhen_visitor", label: "Ô Trấn", icon: "pin" },
    { id: "homeinn_sh", label: "KS Thượng Hải", icon: "hotel" },
    { id: "pvg", label: "Phố Đông", icon: "plane" },
    { id: "hz_east", label: "HC Đông", icon: "train" },
    { id: "disney", label: "Disney", icon: "star" }
  ].filter(function (p) { return PINS[p.id] && PINS[p.id].lat && PINS[p.id].lng; });

  const chips = document.getElementById("map-places");
  const titleEl = document.getElementById("map-title");
  const kEl = document.getElementById("map-k");
  const zhEl = document.getElementById("map-zh");
  const coordsEl = document.getElementById("map-coords");
  const amapBtn = document.getElementById("map-amap");
  const appleBtn = document.getElementById("map-apple");
  const gmapsBtn = document.getElementById("map-gmaps");
  const copyBtn = document.getElementById("map-copy");
  const listHost = document.getElementById("map-list");
  const mapEl = document.getElementById("amap-container");
  const setupEl = document.getElementById("amap-setup");
  const statusEl = document.getElementById("amap-status");
  const keyInput = document.getElementById("amap-key-input");
  const secInput = document.getElementById("amap-sec-input");
  const saveBtn = document.getElementById("amap-save");
  const clearBtn = document.getElementById("amap-clear");

  if (!chips || !places.length) return;

  let map = null;
  let markers = {};
  let infoWindow = null;
  let currentId = places[0].id;
  let AMapRef = null;

  function getCreds() {
    const cfg = window.HZ_AMAP || {};
    return {
      key: (localStorage.getItem(STORAGE_KEY) || cfg.key || "").trim(),
      securityJsCode: (localStorage.getItem(STORAGE_SEC) || cfg.securityJsCode || "").trim()
    };
  }

  function amapUrl(pin) {
    if (pin.amap) return pin.amap;
    const name = encodeURIComponent(pin.vi || pin.name || "");
    return "https://uri.amap.com/marker?position=" + pin.lng + "," + pin.lat + "&name=" + name + "&coordinate=gaode&callnative=1&src=mypage";
  }
  function appleUrl(pin) {
    return "https://maps.apple.com/?ll=" + pin.lat + "," + pin.lng + "&q=" + encodeURIComponent(pin.zh || pin.vi || "");
  }
  function googleUrl(pin) {
    return "https://www.google.com/maps/search/?api=1&query=" + pin.lat + "," + pin.lng;
  }

  function setStatus(msg, isErr) {
    if (!statusEl) return;
    statusEl.hidden = !msg;
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("is-err", !!isErr);
  }

  function syncDetail(p) {
    const pin = PINS[p.id];
    currentId = p.id;
    if (kEl) kEl.textContent = pin.k || "";
    if (titleEl) titleEl.textContent = pin.vi || pin.name || p.label;
    if (zhEl) {
      zhEl.textContent = pin.zh || pin.name || "";
      zhEl.lang = "zh";
    }
    if (coordsEl) coordsEl.textContent = pin.lat + ", " + pin.lng;

    if (amapBtn) {
      amapBtn.href = amapUrl(pin);
      amapBtn.removeAttribute("target");
    }
    if (appleBtn) {
      appleBtn.href = appleUrl(pin);
      appleBtn.removeAttribute("target");
    }
    if (gmapsBtn) {
      gmapsBtn.href = googleUrl(pin);
      gmapsBtn.target = "_blank";
      gmapsBtn.rel = "noopener";
    }
    if (copyBtn) {
      copyBtn.setAttribute("data-copy", pin.zh || pin.name || pin.vi || "");
      copyBtn.setAttribute("data-label", "Copy địa chỉ");
    }

    chips.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-id") === p.id);
    });
    if (listHost) {
      listHost.querySelectorAll("article").forEach(function (a) {
        a.classList.toggle("is-on", a.getAttribute("data-id") === p.id);
      });
    }
  }

  function focusPlace(p, openInfo) {
    syncDetail(p);
    const pin = PINS[p.id];
    if (!map || !AMapRef) return;
    const pos = [Number(pin.lng), Number(pin.lat)];
    map.setZoomAndCenter(15, pos);
    const mk = markers[p.id];
    if (mk && openInfo !== false) {
      if (!infoWindow) infoWindow = new AMapRef.InfoWindow({ offset: new AMapRef.Pixel(0, -36) });
      infoWindow.setContent(
        '<div class="amap-iw">' +
        "<b>" + (pin.vi || pin.name) + "</b>" +
        (pin.zh ? '<p lang="zh">' + pin.zh + "</p>" : "") +
        "</div>"
      );
      infoWindow.open(map, pos);
    }
  }

  function buildChipsAndList() {
    chips.innerHTML = "";
    places.forEach(function (p, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-id", p.id);
      btn.innerHTML = hzIco(p.icon) + p.label;
      if (i === 0) btn.classList.add("is-on");
      btn.addEventListener("click", function () { focusPlace(p, true); });
      chips.appendChild(btn);
    });

    if (listHost) {
      listHost.innerHTML = places.map(function (p) {
        const pin = PINS[p.id];
        return (
          '<article data-id="' + p.id + '">' +
          '<p class="k">' + (pin.k || p.label) + "</p>" +
          "<h3>" + (pin.vi || pin.name) + "</h3>" +
          (pin.zh ? '<p class="zh" lang="zh">' + pin.zh + "</p>" : "") +
          '<div class="actions">' +
          '<button type="button" class="btn btn-copy" data-copy="' + String(pin.zh || "").replace(/"/g, "&quot;") + '" data-label="Copy địa chỉ">' + hzIco("copy") + "Copy địa chỉ</button>" +
          '<a class="btn btn-amap" href="' + amapUrl(pin) + '" rel="noopener">' + hzIco("nav") + "Amap</a>" +
          '<a class="btn btn-gmap" href="' + appleUrl(pin) + '" rel="noopener">' + hzIco("map") + "Apple</a>" +
          "</div></article>"
        );
      }).join("");

      listHost.addEventListener("click", function (e) {
        const art = e.target.closest("article[data-id]");
        if (!art || e.target.closest("a, button")) return;
        const p = places.find(function (x) { return x.id === art.getAttribute("data-id"); });
        if (p) {
          focusPlace(p, true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }
  }

  function showSetup(show) {
    if (setupEl) setupEl.hidden = !show;
    if (mapEl) mapEl.classList.toggle("is-ready", !show && !!map);
  }

  function initAmap(AMap) {
    AMapRef = AMap;
    if (!mapEl) return;
    mapEl.innerHTML = "";
    const first = PINS[places[0].id];
    map = new AMap.Map(mapEl, {
      viewMode: "2D",
      zoom: 12,
      center: [Number(first.lng), Number(first.lat)],
      resizeEnable: true
    });

    markers = {};
    places.forEach(function (p) {
      const pin = PINS[p.id];
      const mk = new AMap.Marker({
        position: [Number(pin.lng), Number(pin.lat)],
        title: pin.vi || pin.name,
        label: {
          content: '<span class="amap-lbl">' + p.label + "</span>",
          direction: "top",
          offset: new AMap.Pixel(0, -4)
        }
      });
      mk.on("click", function () { focusPlace(p, true); });
      markers[p.id] = mk;
    });
    map.add(Object.keys(markers).map(function (id) { return markers[id]; }));

    // Hành trình nội địa (theo docs: Polyline)
    const routeIds = ["pvg", "homeinn_hz", "wuzhen_visitor", "homeinn_sh", "disney", "pvg"];
    const path = routeIds
      .filter(function (id) { return PINS[id] && PINS[id].lat && PINS[id].lng; })
      .map(function (id) { return [Number(PINS[id].lng), Number(PINS[id].lat)]; });
    if (path.length >= 2) {
      map.add(new AMap.Polyline({
        path: path,
        strokeColor: "#f4783b",
        strokeWeight: 5,
        strokeOpacity: 0.85,
        strokeStyle: "solid",
        lineJoin: "round",
        lineCap: "round"
      }));
    }

    map.setFitView(Object.keys(markers).map(function (id) { return markers[id]; }), false, [48, 48, 48, 48]);

    showSetup(false);
    setStatus("");
    focusPlace(places.find(function (p) { return p.id === currentId; }) || places[0], false);
  }

  /** Theo Quick Start JS API 2.0: AMapLoader + securityJsCode + webapi.amap.com */
  function loadAmapScript(creds) {
    return new Promise(function (resolve, reject) {
      if (!creds.key) {
        reject(new Error("Chưa có Amap Key"));
        return;
      }

      window._AMapSecurityConfig = {
        securityJsCode: creds.securityJsCode || ""
      };

      function runLoader() {
        if (!window.AMapLoader || !window.AMapLoader.load) {
          reject(new Error("AMapLoader không có sẵn"));
          return;
        }
        window.AMapLoader.load({
          key: creds.key,
          version: "2.0"
        })
          .then(function (AMap) { resolve(AMap); })
          .catch(function (e) {
            reject(new Error((e && (e.message || e.info || String(e))) || "Lỗi AMapLoader — kiểm tra Key/安全密钥/whitelist"));
          });
      }

      if (window.AMapLoader) {
        runLoader();
        return;
      }

      const s = document.createElement("script");
      s.src = "https://webapi.amap.com/loader.js";
      s.async = true;
      s.onload = runLoader;
      s.onerror = function () {
        reject(new Error("Không tải được webapi.amap.com/loader.js — kiểm tra mạng"));
      };
      document.head.appendChild(s);
    });
  }

  function bootMap() {
    const creds = getCreds();
    if (keyInput) keyInput.value = creds.key;
    if (secInput) secInput.value = creds.securityJsCode;

    if (!creds.key) {
      showSetup(true);
      setStatus("Cần Amap Web Key để hiện bản đồ tương tác.", true);
      return;
    }

    setStatus("Đang tải bản đồ Amap…");
    loadAmapScript(creds)
      .then(initAmap)
      .catch(function (err) {
        showSetup(true);
        setStatus((err && err.message) || "Lỗi tải Amap", true);
      });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      const key = (keyInput && keyInput.value || "").trim();
      const sec = (secInput && secInput.value || "").trim();
      if (!key) {
        setStatus("Nhập Key trước.", true);
        return;
      }
      localStorage.setItem(STORAGE_KEY, key);
      if (sec) localStorage.setItem(STORAGE_SEC, sec);
      else localStorage.removeItem(STORAGE_SEC);
      // reload map cleanly
      window.AMap = undefined;
      map = null;
      if (mapEl) mapEl.innerHTML = "";
      bootMap();
      if (window.hzToast) hzToast("Đã lưu Amap Key");
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_SEC);
      window.AMap = undefined;
      map = null;
      if (mapEl) mapEl.innerHTML = "";
      if (keyInput) keyInput.value = "";
      if (secInput) secInput.value = "";
      showSetup(true);
      setStatus("Đã xóa key trên máy này.", false);
    });
  }

  const reconfig = document.getElementById("amap-reconfig");
  if (reconfig) {
    reconfig.addEventListener("click", function () {
      showSetup(true);
      const creds = getCreds();
      if (keyInput) keyInput.value = creds.key;
      if (secInput) secInput.value = creds.securityJsCode;
      setupEl && setupEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  buildChipsAndList();
  syncDetail(places[0]);
  bootMap();
})();
