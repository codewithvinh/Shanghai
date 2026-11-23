import { renderPlacesPanel } from "./places.mjs";

function i18n(vi, zh, en) {
  return `<span class="i18n"><span class="vi">${vi}</span><span class="zh">${zh}</span><span class="en">${en}</span></span>`;
}

function addPlanSwitch(html, { otherHref, otherLabel }) {
  return html.replace(
    '<div class="lang">',
    `<div class="lang">\n    <a class="print-btn plan-switch" href="${otherHref}">${otherLabel}</a>`,
  );
}

function addPinsToc(html) {
  const link = `\n  <a href="#pins">${i18n("Địa chỉ", "地址", "Addresses")}</a>`;
  return html.replace(/(<a href="#itin">[\s\S]*?<\/a>)/, `$1${link}`);
}

function insertPlaces(html) {
  const anchor = '<section class="panel"><h2 id="move">';
  if (!html.includes(anchor)) throw new Error("Move panel not found for address cards");
  return html.replace(anchor, `${renderPlacesPanel()}\n${anchor}`);
}

function wrapItinerary(html) {
  return html
    .replace(/<h2 id="itin">/, '<section class="days" aria-labelledby="itin"><h2 id="itin">')
    .replace(/(<\/article>)(<section class="panel"><h2 id="move">|\n?<section class="panel panel--cards")/, "$1</section>$2");
}

function tidy(html) {
  return html
    .replace(/<div style="overflow-x:auto">/g, '<div class="table-wrap">')
    .replace(/<div class="card">/g, '<div class="note">')
    .replace(
      /<ul class="checklist">([\s\S]*?)<\/ul>/g,
      (_, inner) => `<ul class="checklist">${inner.replace(/<li>/g, "<li><label><input type=\"checkbox\"> <span>").replace(/<\/li>/g, "</span></label></li>")}</ul>`,
    );
}

export function composeCards(body, meta, { places = false, heroImg } = {}) {
  let html = addPlanSwitch(body, meta);
  if (places) {
    html = addPinsToc(html);
    html = insertPlaces(html);
  }
  html = wrapItinerary(html);
  html = tidy(html);
  if (heroImg) {
    html = html.replace(
      '<section class="hero" id="overview">',
      `<section class="hero" id="overview" style="--hero-img:url('${heroImg}')">`,
    );
  }
  return html;
}
