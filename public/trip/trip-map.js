export function hasCoordinates({ lat, lng }) {
  return Boolean(lat && lng) && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
    && Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180;
}

/** Build links that open AMap Global (Play: com.autonavi.minimap / iOS: AMap Global). */
export function amapLinks(pin, userAgent = '') {
  const located = hasCoordinates(pin);
  const name = pin.name || pin.vi || '';
  // Prefer HTTPS URI + callnative — reliable from Safari/PWA. Avoid iosamap:// as primary
  // (standalone WebView often swallows custom schemes).
  const url = new URL(located ? 'https://uri.amap.com/marker' : 'https://uri.amap.com/search');
  const params = located
    ? { position: String(pin.lng) + ',' + String(pin.lat), coordinate: 'gaode', name }
    : { keyword: name, view: 'map' };
  url.search = new URLSearchParams({ ...params, src: 'giang-nam', callnative: '1' });
  let app = url.href;
  if (located && /Android/i.test(userAgent)) {
    const query = new URLSearchParams({
      sourceApplication: 'Giang Nam',
      poiname: name,
      lat: String(pin.lat),
      lon: String(pin.lng),
      dev: '0',
    });
    app = 'intent://viewMap?' + query +
      '#Intent;scheme=androidamap;package=com.autonavi.minimap;S.browser_fallback_url=' +
      encodeURIComponent(url.href) + ';end';
  }
  const apple = new URL(located ? 'https://maps.apple.com/place' : 'https://maps.apple.com/search');
  apple.search = new URLSearchParams(located
    ? { coordinate: mapCoordinates(pin).map((value) => value.toFixed(6)).join(','), name }
    : { query: [...new Set([name, pin.zh].filter(Boolean))].join(' ') });
  return { app, apple: apple.href };
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

export function amapActions(pin) {
  const { app, apple } = amapLinks(pin, navigator.userAgent);
  const primary = document.createElement('a');
  primary.className = 'amap-action';
  primary.textContent = 'Amap Global';
  primary.setAttribute('aria-label', 'Mở Amap Global');
  primary.href = app;
  primary.rel = 'noopener noreferrer';
  primary.addEventListener('click', (event) => {
    if (!isStandalone()) return;
    event.preventDefault();
    const opened = window.open(app, '_blank');
    if (!opened) window.location.href = app;
  });
  const appleLink = document.createElement('a');
  appleLink.textContent = 'Apple Maps';
  appleLink.setAttribute('aria-label', 'Mở Apple Maps');
  appleLink.href = apple;
  return [primary, appleLink];
}

// Keep the original GCJ-02 coordinates for Amap. Convert them for WGS84 providers.
export function mapCoordinates(pin) {
  const lat = Number(pin.lat);
  const lng = Number(pin.lng);
  if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) return [lat, lng];
  const { PI, sin, cos, sqrt, abs } = Math;
  const axis = 6378245;
  const eccentricity = 0.006693421622965943;
  function offset(latitude, longitude) {
    const x = longitude - 105;
    const y = latitude - 35;
    const common = (20 * sin(6 * x * PI) + 20 * sin(2 * x * PI)) * 2 / 3;
    const latOffset = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * sqrt(abs(x)) + common
      + (20 * sin(y * PI) + 40 * sin(y * PI / 3) + 160 * sin(y * PI / 12) + 320 * sin(y * PI / 30)) * 2 / 3;
    const lngOffset = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * sqrt(abs(x)) + common
      + (20 * sin(x * PI) + 40 * sin(x * PI / 3) + 150 * sin(x * PI / 12) + 300 * sin(x * PI / 30)) * 2 / 3;
    const radians = latitude * PI / 180;
    const magic = 1 - eccentricity * sin(radians) ** 2;
    return [
      latOffset * 180 / ((axis * (1 - eccentricity) / magic ** 1.5) * PI),
      lngOffset * 180 / ((axis / sqrt(magic) * cos(radians)) * PI),
    ];
  }
  const [initialLat, initialLng] = offset(lat, lng);
  const [deltaLat, deltaLng] = offset(lat - initialLat, lng - initialLng);
  return [lat - deltaLat, lng - deltaLng];
}

export function mapView(workspace, pins, { element, searchable, categories }) {
  const layout = element('div', null, 'map-layout');
  const canvas = element('div', null, 'trip-map');
  canvas.setAttribute('aria-label', 'Bản đồ các địa điểm có tọa độ');
  const mapPanel = element('div', null, 'map-panel');
  const notice = element('p', null, 'map-notice');
  notice.setAttribute('role', 'status');
  const sidebar = element('div', null, 'map-sidebar');
  const search = element('label', 'Tìm địa điểm', 'search');
  const input = element('input');
  input.type = 'search';
  input.placeholder = 'Tên tiếng Việt hoặc tiếng Trung';
  search.append(input);
  const filter = element('label', 'Loại địa điểm', 'map-filter');
  const select = element('select');
  for (const [key, name] of Object.entries({ '': 'Tất cả', ...categories })) {
    const option = element('option', name);
    option.value = key;
    select.append(option);
  }
  filter.append(select);
  const list = element('ul', null, 'map-results');
  const count = element('p', null, 'result-count');
  count.setAttribute('role', 'status');
  const selected = element('div', 'Chọn một ghim hoặc địa điểm để mở trong Amap Global.', 'map-selection');
  const fit = element('button', 'Xem toàn bộ ghim');
  const controls = element('div', null, 'map-controls');
  controls.append(notice, fit);
  mapPanel.append(canvas, controls, selected);
  sidebar.append(search, filter, count, list);
  layout.append(mapPanel, sidebar);
  workspace.append(layout);

  const L = window.L;
  const map = L?.map(canvas, { scrollWheelZoom: false, maxZoom: 19 });
  const layer = map && L.layerGroup().addTo(map);
  if (map) {
    map.attributionControl.setPrefix(false);
    let tileFailed = false;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).on('tileerror', () => {
      tileFailed = true;
      notice.textContent = 'Bản đồ nền tải chưa đầy đủ. Bạn vẫn có thể chọn ghim.';
    }).on('loading', () => { tileFailed = false; }).on('load', () => {
      if (!tileFailed) notice.textContent = 'Chọn ghim để xem địa chỉ.';
    }).addTo(map);
  } else {
    canvas.hidden = true;
    notice.textContent = 'Bản đồ đang không khả dụng. Bạn vẫn có thể mở địa điểm trong Amap.';
  }

  const entries = pins.map((pin) => {
    const button = element('button', pin.vi || pin.name);
    const item = element('li');
    const category = categories[pin.group] || 'Địa điểm';
    const located = hasCoordinates(pin);
    const searchText = searchable([pin.vi, pin.name, pin.zh, category].join(' '));
    button.append(element('small', category + (located ? '' : ' · Tìm trên Amap')));
    item.append(button);
    list.append(item);
    const position = located ? mapCoordinates(pin) : null;
    const marker = map && position && L.marker(position, {
      title: pin.vi,
      alt: pin.vi,
      icon: L.divIcon({ className: 'trip-marker', iconSize: [24, 24], iconAnchor: [12, 12] }),
    });
    function choose(fromList) {
      for (const entry of entries) entry.button.setAttribute('aria-pressed', String(entry.button === button));
      const address = element('p', pin.zh || pin.name);
      address.lang = 'zh-CN';
      const actions = element('div', null, 'pin-actions');
      actions.append(...amapActions(pin));
      selected.replaceChildren(element('h3', pin.vi || pin.name), address, actions);
      if (fromList) {
        if (marker) map.setView(position, 15);
        selected.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      } else {
        const popup = element('div', element('strong', pin.vi || pin.name));
        const popupActions = element('div', null, 'pin-actions');
        popupActions.append(...amapActions(pin));
        popup.append(popupActions);
        L.popup().setLatLng(position).setContent(popup).openOn(map);
      }
    }
    marker?.on('click', () => choose(false));
    button.addEventListener('click', () => choose(true));
    return { button, item, pin, marker, position, searchText };
  });

  let visible = entries;
  function fitVisible() {
    const positions = visible.map(({ position }) => position).filter(Boolean);
    fit.disabled = !map || !positions.length;
    if (positions.length) map?.fitBounds(positions, { padding: [38, 38], maxZoom: 15 });
  }
  function refresh() {
    const query = searchable(input.value.trim());
    visible = entries.filter(({ pin, searchText }) => (!select.value || pin.group === select.value) && searchText.includes(query));
    const matching = new Set(visible);
    map?.closePopup();
    layer?.clearLayers();
    for (const entry of entries) {
      entry.item.hidden = !matching.has(entry);
      if (!entry.item.hidden && entry.marker) layer.addLayer(entry.marker);
    }
    const located = visible.filter(({ position }) => position).length;
    count.textContent = visible.length + ' địa điểm · ' + located + ' ghim trên bản đồ';
    fitVisible();
  }
  input.addEventListener('input', refresh);
  select.addEventListener('change', refresh);
  fit.addEventListener('click', fitVisible);
  if (map) map.setView([30.8, 121], 8);
  refresh();
  return () => map?.remove();
}
