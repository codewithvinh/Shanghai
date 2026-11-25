export function hasCoordinates({ lat, lng }) {
  return Boolean(lat && lng) && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
    && Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180;
}

/** Build links that open AMap Global (Play: com.autonavi.minimap / iOS: AMap Global). */
export function amapLinks(pin, userAgent = '', touchPoints = 0) {
  const located = hasCoordinates(pin);
  const name = pin.name || pin.vi || '';
  const ios = /iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && touchPoints > 1);
  const url = new URL(located ? 'https://uri.amap.com/marker' : 'https://uri.amap.com/search');
  const params = located
    ? { position: String(pin.lng) + ',' + String(pin.lat), coordinate: 'gaode', name }
    : { keyword: name, view: 'map' };
  url.search = new URLSearchParams({ ...params, src: 'giang-nam', callnative: '1' });
  let app = url.href;
  if (ios) {
    const destination = located
      ? { poiname: name, lat: String(pin.lat), lon: String(pin.lng), dev: '0' }
      : { name };
    const query = new URLSearchParams({ sourceApplication: 'Giang Nam', ...destination });
    app = 'iosamap://' + (located ? 'viewMap' : 'poi') + '?' + query;
  } else if (located && /Android/i.test(userAgent)) {
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
  const { app, apple } = amapLinks(pin, navigator.userAgent, navigator.maxTouchPoints);
  const primary = document.createElement('a');
  primary.className = 'amap-action';
  primary.textContent = 'Amap Global';
  primary.setAttribute('aria-label', 'Mở Amap Global');
  primary.href = app;
  primary.rel = 'noopener noreferrer';
  primary.addEventListener('click', (event) => {
    // Let the user's tap follow the iOS scheme directly, including from the Home Screen.
    if (app.startsWith('iosamap:') || !isStandalone()) return;
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

function amapPoint(pin) {
  return [pin.lng, pin.lat, pin.name || pin.vi].join(',');
}

function nativeRouteLink(pins, mode, userAgent, touchPoints) {
  const types = { car: '0', bus: '1', walk: '2' };
  const ios = /iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && touchPoints > 1);
  const android = /Android/i.test(userAgent);
  if ((!ios && !android) || !types[mode]) return null;
  const from = pins[0];
  const to = pins.at(-1);
  const via = pins.slice(1, -1);
  const params = new URLSearchParams({
    sourceApplication: 'Giang Nam', dev: '0', t: types[mode],
    slat: from.lat, slon: from.lng, sname: from.name || from.vi,
    dlat: to.lat, dlon: to.lng, dname: to.name || to.vi,
  });
  if (via.length) {
    params.set('vian', String(via.length));
    params.set('vialats', via.map((pin) => pin.lat).join('|'));
    params.set('vialons', via.map((pin) => pin.lng).join('|'));
    params.set('vianames', via.map((pin) => pin.name || pin.vi).join('|'));
  }
  if (ios) return 'iosamap://path?' + params;
  return 'intent://route/plan/?' + params + '#Intent;scheme=amapuri;package=com.autonavi.minimap;end';
}

export function amapRouteLink(from, to, mode, userAgent = '', touchPoints = 0) {
  if (!mode || !hasCoordinates(from) || !hasCoordinates(to)) return null;
  const native = nativeRouteLink([from, to], mode, userAgent, touchPoints);
  if (native) return native;
  const url = new URL('https://uri.amap.com/navigation');
  url.search = new URLSearchParams({
    from: amapPoint(from), to: amapPoint(to), mode, coordinate: 'gaode', src: 'giang-nam', callnative: '1',
  });
  return url.href;
}

export function amapDayLink(pins, userAgent = '', touchPoints = 0) {
  const first = pins[0];
  const last = pins.at(-1);
  if (pins.length < 3 || first === last || !pins.every(hasCoordinates)) return null;
  const native = nativeRouteLink(pins, 'car', userAgent, touchPoints);
  if (native) return native;
  const url = new URL('https://www.amap.com/ssr/embed/dir');
  url.search = new URLSearchParams({
    from: amapPoint(first), to: amapPoint(last), via: pins.slice(1, -1).map(amapPoint).join(';'),
    type: 'car', platform: 'pc', src: 'giang-nam',
  });
  return url.href;
}

export function mapView(workspace, pins, { element, searchable, categories, routes }) {
  const dayFilter = element('label', 'Lộ trình theo ngày', 'map-filter map-day-filter');
  const daySelect = element('select');
  for (const date of ['', ...Object.keys(routes || {})]) {
    const option = element('option', date ? date.replace('-', '/') : 'Tất cả địa điểm');
    option.value = date;
    daySelect.append(option);
  }
  const address = new URL(location.href);
  const initialDay = address.searchParams.get('day');
  if (initialDay && Object.hasOwn(routes || {}, initialDay)) daySelect.value = initialDay;
  dayFilter.append(daySelect);
  workspace.append(dayFilter);
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
  const selected = element('div', null, 'map-selection');
  selected.hidden = true;
  const fit = element('button', 'Xem toàn bộ ghim');
  const controls = element('div', null, 'map-controls');
  controls.append(notice, fit);
  mapPanel.append(canvas, controls, selected);
  const directory = element('div', null, 'map-directory');
  directory.append(search, filter, count, list);
  const stops = element('ol', null, 'map-stops');
  const routeHeader = element('div', null, 'map-route-header');
  const itinerary = element('section', null, 'map-itinerary');
  itinerary.append(routeHeader, stops);
  sidebar.append(directory, itinerary);
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
      if (!tileFailed) notice.textContent = daySelect.value
        ? 'Nét đứt nối các ghim theo thứ tự.'
        : 'Chọn ghim để xem địa chỉ.';
    }).addTo(map);
  } else {
    canvas.hidden = true;
    notice.textContent = 'Bản đồ đang không khả dụng. Bạn vẫn có thể mở địa điểm trong Amap.';
  }

  const entries = pins.map((pin) => {
    const rawName = pin.vi || pin.name;
    const displayName = rawName.charAt(0).toLocaleUpperCase('vi') + rawName.slice(1);
    const button = element('button', displayName);
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
      selected.replaceChildren(element('h3', displayName), address, actions);
      selected.hidden = false;
      if (fromList) {
        if (marker) map.setView(position, 15);
        selected.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      } else {
        const popup = element('div', element('strong', displayName));
        const popupActions = element('div', null, 'pin-actions');
        popupActions.append(...amapActions(pin));
        popup.append(popupActions);
        L.popup().setLatLng(position).setContent(popup).openOn(map);
      }
    }
    marker?.on('click', () => choose(false));
    button.addEventListener('click', () => choose(true));
    return { button, item, pin, marker, position, searchText, choose, displayName };
  });

  let visible = entries;
  const entriesById = new Map(entries.map((entry) => [entry.pin.id, entry]));
  function fitVisible() {
    const positions = visible.map(({ position }) => position).filter(Boolean);
    fit.disabled = !map || !positions.length;
    if (positions.length) map?.fitBounds(positions, { padding: [38, 38], maxZoom: 15 });
  }
  function refresh() {
    const route = routes?.[daySelect.value];
    if (map) notice.textContent = route ? 'Nét đứt nối các ghim theo thứ tự.' : 'Chọn ghim để xem địa chỉ.';
    directory.hidden = Boolean(route);
    itinerary.hidden = !route;
    selected.hidden = true;
    map?.closePopup();
    layer?.clearLayers();
    if (route) {
      const ordered = route.map(([id, time, mode]) => ({ entry: entriesById.get(id), time, mode }));
      visible = ordered.map(({ entry }) => entry);
      const { userAgent, maxTouchPoints } = navigator;
      const overview = amapDayLink(visible.map(({ pin }) => pin), userAgent, maxTouchPoints);
      const heading = element('h3', 'Điểm dừng');
      const count = element('span', ordered.length + ' điểm', 'map-route-count');
      const headingRow = element('div', heading, 'map-route-heading');
      headingRow.append(count);
      routeHeader.replaceChildren(headingRow);
      if (overview) {
        const link = element('a', 'Amap · Toàn tuyến (ô tô)', 'map-route-action map-overview-link');
        link.href = overview;
        routeHeader.append(link);
      }
      stops.replaceChildren();
      const numbers = new Map();
      for (const [index, { entry, time, mode }] of ordered.entries()) {
        const item = element('li');
        const title = element('strong', entry.displayName);
        const copy = element('span', title, 'map-stop-copy');
        copy.prepend(element('small', time));
        const step = element('button', copy, 'map-stop-button');
        step.type = 'button';
        step.prepend(element('span', String(index + 1), 'map-stop-number'));
        step.addEventListener('click', () => entry.button.click());
        const { app } = amapLinks(entry.pin, userAgent, maxTouchPoints);
        const from = ordered[index - 1]?.entry.pin;
        const direction = from && amapRouteLink(from, entry.pin, mode, userAgent, maxTouchPoints);
        const link = element('a', 'Mở địa điểm', 'map-route-action');
        link.href = app;
        const actions = element('div', null, 'map-stop-actions');
        if (from) {
          const labels = { bus: 'Công cộng', walk: 'Đi bộ', car: 'Ô tô' };
          const label = index + ' → ' + (index + 1);
          if (direction) {
            const action = element('a', 'Amap · ' + label + ' · ' + labels[mode], 'map-route-action map-leg-action');
            action.href = direction;
            action.setAttribute('aria-label', 'Amap: ' + (from.vi || from.name) + ' đến ' + (entry.pin.vi || entry.pin.name) + ' · ' + labels[mode]);
            actions.append(action);
          } else {
            actions.append(element('small', label + ' · Mở điểm đến để tra đường'));
          }
        }
        actions.append(link);
        item.append(step, actions);
        stops.append(item);
        if (entry.position) numbers.set(entry, [...(numbers.get(entry) || []), index + 1]);
      }
      if (map) {
        const positions = visible.map((entry) => entry.position).filter(Boolean);
        if (positions.length > 1) L.polyline(positions, { dashArray: '5 8', weight: 3, interactive: false }).addTo(layer);
        for (const [entry, steps] of numbers) {
          const label = steps.join('·');
          const marker = L.marker(entry.position, {
            title: entry.pin.vi, alt: entry.pin.vi,
            icon: L.divIcon({ className: 'map-route-marker', html: label, iconSize: [34, 28], iconAnchor: [17, 14] }),
          });
          marker.on('click', () => entry.choose(false)).addTo(layer);
        }
      }
      canvas.setAttribute('aria-label', 'Lộ trình ngày ' + daySelect.value.replace('-', '/') + ' với các điểm dừng đánh số');
      fit.textContent = 'Xem cả ngày';
      fitVisible();
      return;
    }
    canvas.setAttribute('aria-label', 'Bản đồ các địa điểm có tọa độ');
    fit.textContent = 'Xem toàn bộ ghim';
    const query = searchable(input.value.trim());
    visible = entries.filter(({ pin, searchText }) => (!select.value || pin.group === select.value) && searchText.includes(query));
    const matching = new Set(visible);
    for (const entry of entries) {
      entry.item.hidden = !matching.has(entry);
      if (!entry.item.hidden && entry.marker) layer.addLayer(entry.marker);
    }
    const located = visible.filter(({ position }) => position).length;
    count.textContent = visible.length + ' địa điểm · ' + located + ' ghim trên bản đồ';
    fitVisible();
  }
  daySelect.addEventListener('change', () => {
    const url = new URL(location.href);
    if (daySelect.value) url.searchParams.set('day', daySelect.value);
    else url.searchParams.delete('day');
    history.replaceState(history.state, '', url);
    refresh();
  });
  input.addEventListener('input', refresh);
  select.addEventListener('change', refresh);
  fit.addEventListener('click', fitVisible);
  if (map) map.setView([30.8, 121], 8);
  refresh();
  return () => map?.remove();
}
