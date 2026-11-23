import { amapActions, mapView } from './trip-map.js';

const workspace = document.querySelector('#workspace');
const placeCategories = { sight: 'Tham quan', food: 'Ăn uống', hotel: 'Lưu trú', transit: 'Di chuyển' };
const tabs = {
  'lich-trinh': 'Lịch trình từng ngày',
  'ban-do': 'Bản đồ chuyến đi',
  'dia-diem': 'Địa điểm đã lưu',
  'an-uong': 'Ăn gì, ở đâu',
  'chi-phi': 'Ngân sách dự kiến',
  'chuan-bi': 'Chuẩn bị trước chuyến đi',
};
const dayLabels = ['07/01', '08/01', '09/01', '10/01', '11/01', '12/01', '13–14/01'];
const dayThemes = ['Bay đêm', 'Hồ Tây', 'Lụa và trà', 'Tây Sách', 'Bến Thượng Hải', 'Disneyland', 'Dự Viên'];
const estimate = 18706000;
const money = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
let data;
let dayIndex = 0;
let disposeMap;

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function saveStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* The current session remains usable when storage is disabled. */ }
}

function element(tag, content, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content) node.append(content);
  return node;
}

function externalLink(label, url) {
  const link = element('a', label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function naturalText(text) {
  if (/https?:\/\//.test(text)) return text;
  return text
    .replace(/\bcheck (lại|kỹ)/gi, (word, qualifier) => (/^C/.test(word) ? 'Kiểm tra ' : 'kiểm tra ') + qualifier)
    .replace(/\b(backup|budget|optional|weekday|voucher|skip|order|book|quote|metro)\b/gi, (word) => {
      const vietnamese = {
        backup: 'dự phòng', budget: 'ngân sách', optional: 'tùy chọn', weekday: 'ngày thường',
        voucher: 'mã ưu đãi', skip: 'bỏ qua', order: 'gọi món', book: 'đặt chỗ', quote: 'báo giá', metro: 'tàu điện ngầm',
      }[word.toLowerCase()];
      return /^[A-Z]/.test(word) ? vietnamese[0].toUpperCase() + vietnamese.slice(1) : vietnamese;
    })
    .replaceAll('đặting khách sạn', 'xác nhận đặt phòng')
    .replace(/\bKS\b/g, 'khách sạn');
}

function inline(node, content, normalize = naturalText) {
  const tokens = /(\*\*([^*]+)\*\*|\x60([^\x60]+)\x60|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g;
  let cursor = 0;
  for (const match of content.matchAll(tokens)) {
    node.append(normalize(content.slice(cursor, match.index)));
    const [, token, bold, code, italic, label, url] = match;
    node.append(bold ? element('strong', normalize(bold)) : code ? element('code', code) :
      italic ? element('em', normalize(italic)) : externalLink(label, url));
    cursor = match.index + token.length;
  }
  node.append(normalize(content.slice(cursor)));
  return node;
}

function splitIdeas(text, splitSentences) {
  // Only split between complete thoughts. Keep URLs, inline markup, and quotations intact.
  const protectedText = [];
  const plain = text.replace(/\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/\S+|\x60[^\x60]+\x60|\*\*[^*]+\*\*|\*[^*]+\*|“[^”]+”/g, (span) => {
    protectedText.push(span);
    return '\u0001' + (protectedText.length - 1) + '\u0002';
  });
  const delimiter = splitSentences
    ? /[·\s]*•\s*|(?<=[.!?])\s+(?=\p{Lu})|;\s+/u
    : /[·\s]*•\s*/;
  return plain.split(delimiter).map((part) => part.replace(/\u0001(\d+)\u0002/g, (_, index) => protectedText[index])
    .trim().replace(/\s+·$/, '')).filter(Boolean);
}

function bulletList(items) {
  const list = element('ul', null, 'idea-list');
  for (const idea of items) list.append(inline(element('li'), idea));
  return list;
}

function cells(line) {
  return line.trim().slice(1, -1).split('|').map((cell) => cell.trim());
}

function table(lines) {
  const wrapper = element('div', null, 'table-wrap');
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Bảng thông tin');
  const grid = element('table');
  const head = grid.createTHead().insertRow();
  for (const value of cells(lines[0])) {
    const header = inline(element('th'), value);
    header.scope = 'col';
    head.append(header);
  }
  const body = grid.createTBody();
  for (const line of lines.slice(2)) {
    const row = body.insertRow();
    for (const value of cells(line)) {
      const cell = row.insertCell();
      const ideas = splitIdeas(value, value.length > 140);
      if (ideas.length > 1) cell.append(bulletList(ideas));
      else inline(cell, ideas[0] || '');
    }
  }
  wrapper.append(grid);
  return wrapper;
}

function markdown(content) {
  const root = element('div', null, 'rich');
  const lines = content.split('\n').map((line) => line.trim());
  for (let index = 0; index < lines.length;) {
    const line = lines[index++];
    if (!line || line === '---') continue;
    if (line.startsWith('|') && lines[index]?.startsWith('|')) {
      const rows = [line];
      while (lines[index]?.startsWith('|')) rows.push(lines[index++]);
      root.append(table(rows));
      continue;
    }
    const marker = /^([-*]|\d+\.)\s+/.exec(line);
    if (marker) {
      const pattern = /^\d/.test(marker[0]) ? /^\d+\.\s+/ : /^[-*]\s+/;
      const list = element(/^\d/.test(marker[0]) ? 'ol' : 'ul');
      list.append(inline(element('li'), line.replace(pattern, '')));
      while (pattern.test(lines[index] || '')) list.append(inline(element('li'), lines[index++].replace(pattern, '')));
      root.append(list);
      continue;
    }
    const tag = line.startsWith('#') ? 'h3' : line.startsWith('> ') ? 'blockquote' : 'p';
    const content = line.replace(/^(#+|>)\s+/, '');
    const ideas = tag === 'p' ? splitIdeas(content, content.length > 145) : [content];
    if (ideas.length > 1) root.append(bulletList(ideas));
    else root.append(inline(element(tag), ideas[0] || '', tag === 'blockquote' ? (value) => value : naturalText));
  }
  return root;
}

function disclosure(title, body) {
  const details = element('details');
  details.append(element('summary', title), markdown(body));
  return details;
}

function schedule(plan) {
  const strip = element('div', null, 'days');
  const panel = element('article', null, 'panel');
  const buttons = plan.days.map((day, index) => {
    const button = element('button');
    button.append(element('small', dayLabels[index]), element('span', dayThemes[index]));
    button.addEventListener('click', () => showDay(index));
    strip.append(button);
    return button;
  });
  function showDay(index) {
    dayIndex = index;
    const { title, body } = plan.days[index];
    buttons.forEach((button, position) => button.setAttribute('aria-pressed', String(position === index)));
    const lines = body.split('\n');
    const headerIndex = lines.findIndex((line) => /^\| Thời gian \|/.test(line));
    const photo = element('img');
    photo.src = '../' + data.photos.days[index];
    photo.alt = '';
    const banner = element('header', null, 'day-banner');
    const caption = element('div');
    caption.append(element('p', dayLabels[index]), element('h3', dayThemes[index]));
    banner.append(photo, caption);
    panel.replaceChildren(banner);
    if (headerIndex < 0) {
      panel.append(markdown(body));
      return;
    }
    const context = disclosure('Tóm tắt trong ngày', lines.slice(0, headerIndex).join('\n'));
    context.querySelector('.rich').prepend(element('p', title));
    panel.append(context);
    const timeline = element('ol', null, 'timeline');
    let cursor = headerIndex + 2;
    while (lines[cursor]?.startsWith('|')) {
      const [time, activity, place, description, price, unit, quantity, note, reference] = cells(lines[cursor++]);
      const item = element('li');
      const info = element('details', null, 'event');
      const lead = /^\*\*([^*]+)\*\*\s*[—–-]\s*(.+)$/.exec(activity);
      const label = lead?.[1] || activity;
      const summary = inline(element('summary'), label);
      const detail = element('div', null, 'event-body');
      if (place) detail.append(inline(element('p', null, 'event-place'), place));
      const ideas = [lead?.[2], description, note].filter(Boolean).flatMap((line) => splitIdeas(line, true));
      if (ideas.length > 1) detail.append(bulletList(ideas));
      else if (ideas.length) detail.append(inline(element('p'), ideas[0]));
      if (price && price !== '0' && /^[\d.]+$/.test(price)) detail.append(element('p', 'Dự kiến ' + price + ' ₫' + (unit ? ' / ' + unit : '') + (quantity && Number(quantity) > 1 ? ' × ' + quantity : ''), 'event-price'));
      if (reference) detail.append(inline(element('p', null, 'event-reference'), 'Tham khảo · ' + reference));
      if (detail.childNodes.length) info.append(summary, detail);
      item.append(inline(element('time'), time), info);
      if (!detail.childNodes.length) item.lastChild.replaceWith(inline(element('p', null, 'event-plain'), label));
      timeline.append(item);
    }
    panel.append(timeline);
    const extra = lines.slice(cursor).join('\n').trim();
    if (extra) panel.append(markdown(extra));
  }
  showDay(dayIndex);
  const route = element('div', null, 'route');
  for (const [city, photo, index] of [['Hàng Châu', 'sight-westlake', 1], ['Ô Trấn', 'sight-wuzhen', 3], ['Thượng Hải', 'sight-bund', 4]]) {
    const button = element('button', null, 'route-card');
    const image = element('img');
    image.src = '../img/' + photo + '.jpg';
    image.alt = '';
    button.append(image, element('span', city));
    button.addEventListener('click', () => {
      showDay(index);
      strip.scrollIntoView({ block: 'start', behavior: 'instant' });
      buttons[index].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
      buttons[index].focus({ preventScroll: true });
    });
    route.append(button);
  }
  workspace.append(route, strip, panel);
}

function searchable(value) {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replaceAll('đ', 'd');
}

function places(plan) {
  const label = element('label', 'Tìm tên hoặc địa chỉ', 'search');
  const input = element('input');
  input.type = 'search';
  input.placeholder = 'Ví dụ Hồ Tây hoặc 西湖';
  label.append(input);
  const cards = element('div', null, 'cards');
  const empty = element('p', 'Không tìm thấy địa điểm phù hợp.');
  const categories = placeCategories;
  const filters = element('div', null, 'filters');
  filters.setAttribute('aria-label', 'Loại địa điểm');
  const filterButtons = new Map();
  let group = '';
  const entries = data.pins.map((pin) => {
    const card = element('article', null, 'pin');
    if (pin.img) {
      const image = element('img');
      image.src = '../' + pin.img;
      image.alt = '';
      image.loading = 'lazy';
      card.append(image);
      if (pin.photoCaption) card.append(element('p', pin.photoCaption, 'photo-caption'));
    }
    const info = element('div', null, 'pin-info');
    const address = element('div', null, 'pin-address');
    const chinese = element('p', pin.zh || pin.name);
    chinese.lang = 'zh-CN';
    const actions = element('div', null, 'pin-actions');
    const copy = element('button', null, 'address-copy');
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Sao chép địa chỉ');
    copy.title = 'Sao chép địa chỉ';
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(icon.namespaceURI, 'path');
    const copyIcon = 'M9 9h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V9Zm6-4V3H5a2 2 0 0 0-2 2v10h2';
    path.setAttribute('d', copyIcon);
    icon.append(path);
    copy.append(icon);
    const feedback = element('span', null, 'copy-feedback');
    feedback.setAttribute('role', 'status');
    let resetFeedback;
    copy.addEventListener('click', async () => {
      clearTimeout(resetFeedback);
      try {
        await navigator.clipboard.writeText(chinese.textContent);
        path.setAttribute('d', 'm5 12 4 4L19 6');
        feedback.textContent = 'Đã sao chép';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(chinese);
        selection.removeAllRanges();
        selection.addRange(range);
        feedback.textContent = 'Đã chọn địa chỉ';
      }
      resetFeedback = setTimeout(() => {
        feedback.textContent = '';
        path.setAttribute('d', copyIcon);
      }, 2200);
    });
    address.append(chinese, copy, feedback);
    actions.append(...amapActions(pin));
    info.append(element('p', categories[pin.group] || 'Địa điểm', 'pin-meta'), element('h3', pin.vi), address, actions);
    card.append(info);
    cards.append(card);
    return { card, group: pin.group, search: searchable([pin.vi, pin.name, pin.zh, categories[pin.group]].join(' ')) };
  });
  const count = element('p', null, 'result-count');
  count.setAttribute('role', 'status');
  function filter() {
    const query = searchable(input.value.trim());
    for (const entry of entries) entry.card.hidden = Boolean(group && group !== entry.group) || !entry.search.includes(query);
    const visible = entries.filter(({ card }) => !card.hidden).length;
    count.textContent = visible + ' địa điểm';
    empty.hidden = visible > 0;
    for (const [key, button] of filterButtons) button.setAttribute('aria-pressed', String(key === group));
  }
  for (const [key, name] of Object.entries({ '': 'Tất cả', ...categories })) {
    const button = element('button', name);
    button.addEventListener('click', () => { group = key; filter(); });
    filterButtons.set(key, button);
    filters.append(button);
  }
  input.addEventListener('input', filter);
  filter();
  workspace.append(disclosure('Lưu trú trong chuyến đi', plan.stay), label, filters, count, cards, empty);
}

function preparation(plan) {
  const key = 'giang-nam:checklist:0';
  const saved = new Set(readStorage(key, []));
  const panel = element('div', null, 'panel checklist-panel');
  const status = element('p');
  status.setAttribute('role', 'status');
  const progress = element('progress');
  progress.max = plan.checklist.length;
  progress.setAttribute('aria-label', 'Tiến độ chuẩn bị');
  const list = element('div', null, 'checklist');
  const update = () => {
    progress.value = plan.checklist.filter((item) => saved.has(item)).length;
    status.textContent = progress.value + '/' + plan.checklist.length + ' việc đã hoàn thành';
  };
  for (const item of plan.checklist) {
    const label = element('label');
    const box = element('input');
    box.type = 'checkbox';
    box.checked = saved.has(item);
    box.addEventListener('change', () => {
      if (box.checked) saved.add(item);
      else saved.delete(item);
      saveStorage(key, [...saved]);
      update();
    });
    label.append(box, inline(element('span'), item));
    list.append(label);
  }
  update();
  panel.append(element('h3', 'Việc cần làm'), status, progress, list);
  const guide = element('aside', null, 'guide');
  const review = disclosure('Điểm cần chốt trước chuyến đi', data.review);
  guide.append(element('h3', 'Cẩm nang chuyến đi'), review, ...data.tips.map(({ title, body }) => disclosure(title.replace(/^\d+\.\s+/, ''), body)));
  const layout = element('div', null, 'prep-grid');
  layout.append(panel, guide);
  workspace.append(layout);
}

function budget(plan) {
  const cap = 20000000;
  const summary = element('div', null, 'panel budget-summary');
  const figures = element('dl', null, 'budget-figures');
  for (const [label, amount] of [['Dự kiến mỗi người', estimate], ['Trần mỗi người', cap], ['Còn trong ngân sách', cap - estimate]]) {
    const figure = element('div');
    figure.append(element('dt', label), element('dd', money(amount)));
    figures.append(figure);
  }
  const meter = element('progress');
  meter.max = cap;
  meter.value = estimate;
  meter.setAttribute('aria-label', 'Chi phí dự kiến so với trần ngân sách');
  summary.append(figures, meter);
  workspace.append(summary, disclosure('Bảng chi phí và ghi chú', plan.budget));
}

function render() {
  if (!data) return;
  const hash = location.hash.slice(1);
  const tab = Object.hasOwn(tabs, hash) ? hash : 'lich-trinh';
  document.body.dataset.tab = tab;
  const { plan } = data;
  for (const link of document.querySelectorAll('.nav a')) {
    if (link.hash === '#' + tab) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  disposeMap?.();
  disposeMap = undefined;
  workspace.replaceChildren(element('h2', tabs[tab]));
  if (tab === 'lich-trinh') schedule(plan);
  if (tab === 'ban-do') disposeMap = mapView(workspace, data.pins, { element, searchable, categories: placeCategories });
  if (tab === 'dia-diem') places(plan);
  if (tab === 'an-uong') {
    const guides = element('div', null, 'food-grid');
    for (const { title, body } of data.food) {
      const topic = disclosure(title.replace(/^[A-Z]\.\s+/, ''), body);
      const photo = data.photos.food[title[0]];
      if (photo) {
        const image = element('img', null, 'food-photo');
        image.src = '../' + photo.path;
        image.alt = '';
        image.loading = 'lazy';
        const summary = topic.querySelector('summary');
        summary.prepend(image);
        summary.append(element('span', photo.caption, 'food-caption'));
      }
      guides.append(topic);
    }
    workspace.append(disclosure('Bữa ăn theo lịch trình', plan.food), guides);
  }
  if (tab === 'chi-phi') budget(plan);
  if (tab === 'chuan-bi') preparation(plan);
}

function scrollToWorkspace() {
  workspace.scrollIntoView({ block: 'start', behavior: 'instant' });
}

window.addEventListener('hashchange', () => {
  render();
  if (data) scrollToWorkspace();
});

const install = document.querySelector('#install');
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  install.hidden = false;
  install.onclick = () => {
    install.hidden = true;
    event.prompt();
  };
});
window.addEventListener('appinstalled', () => { install.hidden = true; });

if ('serviceWorker' in navigator && window.isSecureContext) {
  let currentWorker = navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const previousWorker = currentWorker;
    currentWorker = navigator.serviceWorker.controller;
    if (previousWorker?.scriptURL === currentWorker?.scriptURL && currentWorker) location.reload();
  });
  navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((registration) => {
    const worker = registration.installing || registration.waiting || registration.active;
    const status = document.querySelector('#offline');
    const update = () => {
      if (worker.state === 'activated') status.textContent = 'Dùng được ngoại tuyến';
      if (worker.state === 'redundant') status.textContent = 'Chưa lưu ngoại tuyến';
    };
    worker.addEventListener('statechange', update);
    update();
  }).catch(() => { document.querySelector('#offline').textContent = 'Chưa lưu ngoại tuyến'; });
}

try {
  const response = await fetch('./data.json');
  if (!response.ok) throw new Error('Không tải được dữ liệu');
  data = await response.json();
  render();
  if (location.hash.length > 1) scrollToWorkspace();
} catch {
  const retry = element('button', 'Tải lại');
  retry.addEventListener('click', () => location.reload());
  workspace.replaceChildren(element('p', 'Chưa tải được sổ tay. Kiểm tra kết nối rồi thử lại.'), retry);
}
