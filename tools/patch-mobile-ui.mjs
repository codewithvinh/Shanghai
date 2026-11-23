/**
 * One-shot patch: mobile-first PWA UI for hangzhou-trip.html
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/hangzhou-trip.html");
let html = fs.readFileSync(file, "utf8");

const NEW_CSS = `  <style>
    :root {
      --ink: #1a1714;
      --ink-2: #4a433c;
      --paper: #fffaf7;
      --paper-2: #ffffff;
      --peach: #fff1e8;
      --line: #f0d5c6;
      --dot: #efc8b5;
      --orange: #f4783b;
      --orange-deep: #e05f22;
      --orange-2: #ffd8c4;
      --gold: #f4783b;
      --gold-2: #ffe8db;
      --lacquer: #f4783b;
      --canal: #2f6b63;
      --google: #3b6cb5;
      --mist: #8a817c;
      --ok: #2f6b63;
      --warn: #9a5b12;
      --must: #f4783b;
      --shadow: 0 8px 24px rgba(80, 40, 10, .08);
      --shadow-sm: 0 2px 10px rgba(80, 40, 10, .06);
      --radius: 16px;
      --radius-sm: 12px;
      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bot: env(safe-area-inset-bottom, 0px);
      --bar: 64px;
      --stick-h: 56px;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      overflow-x: clip;
    }

    html {
      scroll-behavior: smooth;
    }

    .vault-head,
    .day,
    h2,
    .itin {
      scroll-margin-top: calc(var(--stick-h, 64px) + 8px);
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif;
      background:
        radial-gradient(120% 60% at 100% -10%, #ffe8db 0%, transparent 55%),
        radial-gradient(90% 40% at 0% 0%, #fff3ec 0%, transparent 45%),
        var(--paper);
      color: var(--ink);
      font-size: 15px;
      line-height: 1.45;
      padding-bottom: calc(var(--bar) + var(--safe-bot) + 16px);
      min-height: 100dvh;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    a {
      color: inherit;
    }

    button,
    a.btn {
      font: inherit;
    }

    h1,
    h2,
    h3 {
      font-weight: 700;
      letter-spacing: -0.03em;
      margin: 0;
    }

    h1 {
      font-size: clamp(1.65rem, 6vw, 2.05rem);
      line-height: 1.08;
      font-weight: 800;
    }

    h2 {
      font-size: 1.15rem;
      margin: 28px 16px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    h2 .sec-ico {
      width: 28px;
      height: 28px;
      border-radius: 9px;
      background: var(--peach);
      color: var(--orange);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }

    h2 .sec-ico svg {
      width: 16px;
      height: 16px;
    }

    p {
      margin: 0;
    }

    .ico {
      width: 1.1em;
      height: 1.1em;
      display: inline-block;
      vertical-align: -0.15em;
      flex: none;
    }

    .btn .ico {
      width: 15px;
      height: 15px;
      margin-right: 5px;
    }

    .zh {
      font-family: "Songti SC", "STSong", "Noto Serif SC", "PMingLiU", serif;
      font-size: 1.08rem;
      letter-spacing: 0.03em;
      line-height: 1.4;
      user-select: all;
      -webkit-user-select: all;
      -webkit-touch-callout: default;
      color: var(--ink);
      word-break: keep-all;
      overflow-wrap: anywhere;
    }

    .page {
      position: relative;
      z-index: 1;
      max-width: 760px;
      margin: 0 auto;
      overflow-x: clip;
    }

    .stick {
      position: sticky;
      top: 0;
      z-index: 40;
      background: rgba(255, 250, 247, .92);
      backdrop-filter: blur(16px) saturate(1.2);
      -webkit-backdrop-filter: blur(16px) saturate(1.2);
      border-bottom: 1px solid var(--line);
      padding-top: 2px;
    }

    .mast {
      background: transparent;
      color: var(--ink);
      padding: calc(10px + var(--safe-top)) 16px 2px;
    }

    .mast-top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .app-mark {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(145deg, #ff9a5c, var(--orange-deep));
      color: #fff;
      display: grid;
      place-items: center;
      box-shadow: 0 6px 16px rgba(244, 120, 59, .35);
      flex: none;
    }

    .app-mark svg {
      width: 24px;
      height: 24px;
    }

    .mast-top .titles {
      min-width: 0;
      flex: 1;
    }

    .mast small {
      display: block;
      color: var(--orange);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 2px;
      font-weight: 700;
    }

    .mast h1 b {
      font-weight: 800;
    }

    .mast h1 i {
      font-weight: 500;
      font-style: normal;
      color: var(--ink-2);
      font-size: .72em;
    }

    .mast-badge {
      font-size: 11px;
      font-weight: 700;
      color: var(--canal);
      background: #e7f3f1;
      border-radius: 999px;
      padding: 6px 10px;
      white-space: nowrap;
    }

    .rule {
      height: 3px;
      background: linear-gradient(90deg, var(--orange), #ffd0b8 70%, transparent);
      width: 100%;
      margin: 10px 0 12px;
      border-radius: 2px;
    }

    .trip-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 14px;
      padding-bottom: 4px;
      font-size: 14px;
    }

    .trip-meta dt {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .04em;
      color: var(--mist);
      text-transform: uppercase;
    }

    .trip-meta dd {
      margin: 2px 0 0;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--line);
      color: var(--ink-2);
      font-weight: 600;
    }

    .trip-meta .dest {
      grid-column: 1 / -1;
    }

    .chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding: 8px 12px 10px;
      flex-wrap: nowrap;
      background: transparent;
      scrollbar-width: none;
      max-width: 100%;
      scroll-snap-type: x proximity;
    }

    .chips::-webkit-scrollbar {
      display: none;
    }

    .tag,
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      width: fit-content;
      min-width: 0;
      max-width: 100%;
      padding: 4px 10px;
      white-space: nowrap;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    }

    .chips a {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      min-height: 40px;
      min-width: 40px;
      padding: 6px 12px;
      white-space: nowrap;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      background: var(--paper-2);
      border: 1px solid var(--line);
      color: var(--ink-2);
      text-decoration: none;
      box-shadow: var(--shadow-sm);
      scroll-snap-align: start;
    }

    .chips a svg {
      width: 14px;
      height: 14px;
      opacity: .85;
    }

    .chips a:hover,
    .chips a:focus-visible,
    .chips a.is-on {
      background: var(--orange);
      color: #fff;
      border-color: var(--orange);
      box-shadow: 0 4px 12px rgba(244, 120, 59, .28);
    }

    .chips a.is-on svg {
      opacity: 1;
    }

    .hero {
      position: relative;
      margin: 12px 16px 8px;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow);
      background: #222;
    }

    .hero img {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      opacity: .92;
    }

    .hero figcaption {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 28px 14px 14px;
      background: linear-gradient(transparent, rgba(20, 12, 8, .78));
      color: #fff;
    }

    .hero figcaption strong {
      display: block;
      font-size: 15px;
      letter-spacing: -0.02em;
    }

    .hero figcaption span {
      display: block;
      margin-top: 3px;
      font-size: 12px;
      opacity: .88;
    }

    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 0 16px 8px;
    }

    .stat {
      background: var(--paper-2);
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      padding: 12px 12px;
      box-shadow: var(--shadow-sm);
    }

    .stat b {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--orange);
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .stat b svg {
      width: 13px;
      height: 13px;
    }

    .stat span {
      display: block;
      margin-top: 4px;
      font-size: 13px;
      color: var(--ink-2);
      line-height: 1.35;
    }

    .route {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      margin: 8px 16px 0;
      font-size: 12px;
    }

    .route b {
      background: var(--orange);
      color: #fff;
      padding: 6px 10px;
      border-radius: 999px;
      font-weight: 700;
    }

    .route i {
      font-style: normal;
      color: var(--mist);
    }

    .note {
      margin: 12px 16px;
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      background: var(--peach);
      color: #6a4310;
      font-size: 13px;
      border: 1px solid var(--line);
    }

    .note.warn {
      background: #f6ddd4;
      color: #7a2e1c;
    }

    .pillars {
      display: grid;
      gap: 8px;
      margin: 0 16px;
    }

    .pillar {
      background: var(--paper-2);
      border: 1px solid var(--line);
      border-radius: var(--radius-sm);
      padding: 14px;
      box-shadow: var(--shadow-sm);
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 12px;
      align-items: start;
    }

    .pillar .pillar-ico {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--peach);
      color: var(--orange);
      display: grid;
      place-items: center;
    }

    .pillar .pillar-ico svg {
      width: 20px;
      height: 20px;
    }

    .pillar h3 {
      font-size: 15px;
      margin-bottom: 4px;
    }

    .pillar p {
      font-size: 13px;
      color: var(--ink-2);
    }

    .vault-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 8px;
      flex-wrap: wrap;
      margin: 28px 16px 8px;
    }

    .vault-head h2 {
      margin: 0;
    }

    .pin-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin: 0 16px 16px;
    }

    .food-vault {
      display: grid;
      gap: 10px;
      margin: 0 16px 20px;
    }

    .food-zone {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--paper-2);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .food-zone > summary {
      list-style: none;
      cursor: pointer;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      align-items: center;
      padding: 12px 14px;
      min-height: 52px;
      user-select: none;
    }

    .food-zone > summary::-webkit-details-marker {
      display: none;
    }

    .food-zone > summary .zone-title {
      min-width: 0;
    }

    .food-zone > summary .zone-title b {
      display: block;
      font-size: 15px;
      letter-spacing: -0.02em;
    }

    .food-zone > summary .zone-title span {
      display: block;
      margin-top: 2px;
      font-size: 12px;
      color: var(--mist);
      font-weight: 600;
    }

    .food-zone > summary .zone-tools {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .food-zone > summary .zone-tools .btn {
      width: auto;
      min-width: 0;
      min-height: 40px;
      padding: 8px 12px;
      font-size: 12px;
    }

    .food-zone > summary .chev {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: var(--peach);
      color: var(--orange);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
      transition: transform .18s ease;
    }

    .food-zone[open] > summary .chev {
      transform: rotate(180deg);
    }

    .food-zone .zone-body {
      padding: 0 10px 12px;
      border-top: 1px solid var(--line);
    }

    .food-zone .zone-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-top: 10px;
    }

    .food-zone .pin .kind {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin: 0 0 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      background: #ffe0cc;
      color: #9a4a18;
    }

    .food-zone .pin .kind.drink {
      background: #e7f3f1;
      color: var(--canal);
    }

    .pin {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      background: var(--paper-2);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 10px;
      margin: 0;
      min-width: 0;
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .pin img {
      width: 100%;
      aspect-ratio: 16 / 10;
      height: auto;
      object-fit: cover;
      border-radius: 10px;
      background: #eee;
    }

    .pin .meta {
      min-width: 0;
      display: block;
    }

    .pin .k {
      font-size: 11px;
      color: var(--mist);
      font-weight: 700;
      letter-spacing: .06em;
      text-transform: uppercase;
    }

    .pin h3 {
      font-size: 15px;
      margin: 2px 0 6px;
    }

    .pin .tel {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: var(--mist);
      margin-top: 4px;
      text-decoration: none;
    }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-top: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      min-width: 0;
      width: 100%;
      padding: 8px 8px;
      border-radius: 11px;
      border: 0;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }

    .btn-copy {
      grid-column: 1 / -1;
      background: var(--orange);
      color: #fff;
    }

    .btn-copy.ok {
      background: var(--canal);
    }

    .btn-amap {
      background: #e7f3f1;
      color: var(--canal);
    }

    .btn-gmap {
      background: #e7eef8;
      color: var(--google);
    }

    .btn-ghost {
      background: var(--ink);
      color: #fff;
      width: auto;
    }

    #copy-summary {
      width: 100%;
    }

    .itin {
      margin: 8px 12px 24px;
    }

    .day {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr);
      gap: 8px;
      margin: 0 0 16px;
      background: transparent;
      border: 0;
      border-radius: 0;
      overflow: visible;
      align-items: stretch;
    }

    .day-tab {
      background: linear-gradient(180deg, #ff8a4a, var(--orange-deep));
      color: #fff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: start;
      position: sticky;
      top: calc(var(--stick-h, 57px) + 6px);
      z-index: 2;
      min-height: 108px;
      width: 40px;
      padding: 16px 0;
      box-shadow: 0 8px 18px rgba(244, 120, 59, .28);
    }

    .day-tab span {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-weight: 800;
      font-size: 12px;
      letter-spacing: .18em;
      white-space: nowrap;
      line-height: 1;
    }

    .day-panel {
      background: var(--paper-2);
      border: 1px solid var(--line);
      border-radius: 14px;
      overflow: hidden;
      min-width: 0;
      box-shadow: var(--shadow-sm);
    }

    .day-cover {
      display: block;
      width: 100%;
      aspect-ratio: 2.2 / 1;
      object-fit: cover;
      background: #ddd;
    }

    .day-cols {
      display: grid;
      grid-template-columns: 78px 1fr;
      gap: 8px;
      padding: 10px 12px 6px;
      font-size: 12px;
      font-weight: 800;
      color: var(--mist);
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    .day-head {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      padding: 10px 12px 0;
    }

    .chip-date {
      background: transparent;
      color: var(--ink);
      padding-left: 0;
      font-weight: 800;
      font-size: 13px;
    }

    .chip.light {
      background: #e7f3f1;
      color: var(--canal);
    }

    .chip.mid {
      background: #ffe0cc;
      color: #9a4a18;
    }

    .chip.strong {
      background: #ffd0b8;
      color: #9a3a12;
    }

    .chip.max {
      background: var(--orange);
      color: #fff;
    }

    .chip.opt {
      background: #fff;
      color: var(--mist);
      border: 1px solid var(--line);
    }

    .day-panel>h3 {
      display: none;
    }

    .day .lede {
      padding: 4px 12px 10px;
      color: var(--ink-2);
      font-size: 14px;
    }

    .beat {
      display: grid;
      grid-template-columns: 78px minmax(0, 1fr);
      gap: 8px;
      padding: 12px;
      border-top: 1px solid var(--line);
      position: relative;
    }

    .beat::before {
      content: "";
      position: absolute;
      left: calc(78px / 2 + 12px - 3px);
      top: 0;
      bottom: 0;
      width: 2px;
      background: transparent;
      pointer-events: none;
    }

    .beat time {
      font-size: 13px;
      font-weight: 800;
      color: var(--orange-deep);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .beat time::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--orange);
      box-shadow: 0 0 0 3px var(--peach);
      margin-top: 4px;
    }

    .beat h4 {
      font-size: 15px;
      margin-bottom: 2px;
      font-weight: 700;
    }

    .beat p,
    .beat li {
      font-size: 14px;
      color: var(--ink-2);
      overflow-wrap: anywhere;
    }

    .beat ul {
      margin: 6px 0 0;
      padding-left: 18px;
    }

    .inline-pin {
      margin: 10px 0 0;
      min-width: 0;
    }

    .inline-pin .pin {
      margin: 0;
      padding: 8px;
      grid-template-columns: 64px 1fr;
      gap: 10px;
      background: var(--peach);
      border-color: transparent;
      width: 100%;
      min-width: 0;
      box-shadow: none;
      align-items: start;
    }

    .inline-pin .pin img {
      display: block;
      width: 64px;
      height: 64px;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 10px;
    }

    .inline-pin .pin h3 {
      font-size: 13px;
      margin: 0 0 2px;
    }

    .inline-pin .zh {
      font-size: 13px;
    }

    .inline-pin .pin .k,
    .inline-pin .pin .kind,
    .inline-pin .pin .tel {
      display: none;
    }

    .inline-pin .actions {
      display: flex;
      flex-wrap: nowrap;
      gap: 5px;
      grid-column: 1 / -1;
    }

    .inline-pin .btn {
      flex: 1 1 0;
      width: 0;
      min-width: 0;
      grid-column: auto;
      font-size: 11px;
      min-height: 40px;
      padding: 6px 4px;
    }

    .inline-pin .btn .ico {
      margin-right: 3px;
      width: 13px;
      height: 13px;
    }

    .food-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin: 0 16px 20px;
      background: transparent;
      border: 0;
      padding: 0;
    }

    .food-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      padding: 12px;
      background: var(--paper-2);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
    }

    .food-when {
      font-size: 12px;
      font-weight: 800;
      color: var(--orange);
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    .food-row b {
      display: block;
      font-size: 15px;
    }

    .food-row .zh {
      font-size: 14px;
      margin: 0;
    }

    .food-row p {
      font-size: 13px;
      color: var(--ink-2);
    }

    .table-wrap {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0 16px 12px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--paper-2);
      box-shadow: var(--shadow-sm);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    th,
    td {
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--line);
    }

    th {
      font-size: 11px;
      color: var(--mist);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    .flag {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      width: fit-content;
      white-space: nowrap;
    }

    .flag.must {
      background: var(--orange);
      color: #fff;
    }

    .flag.rec {
      background: #ffe0cc;
      color: #9a4a18;
    }

    .money {
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .list {
      margin: 0 16px;
      padding: 0;
      list-style: none;
    }

    .list li {
      background: var(--paper-2);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 8px;
      font-size: 14px;
      box-shadow: var(--shadow-sm);
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 10px;
    }

    .list li::before {
      content: "";
      width: 28px;
      height: 28px;
      border-radius: 9px;
      background: var(--peach) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f4783b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E") center/16px no-repeat;
    }

    .list b {
      display: block;
      margin-bottom: 2px;
    }

    .list li > * {
      grid-column: 2;
    }

    .check {
      margin: 0 16px;
    }

    .check label {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      min-height: 48px;
      padding: 12px 0;
      border-bottom: 1px solid var(--line);
      font-size: 15px;
    }

    .check input {
      width: 22px;
      height: 22px;
      margin-top: 2px;
      flex: none;
      accent-color: var(--orange);
    }

    .confirm {
      margin: 0 16px 24px;
      display: grid;
      gap: 8px;
    }

    .confirm label {
      font-size: 14px;
    }

    .confirm select,
    .confirm textarea {
      width: 100%;
      font: inherit;
      font-size: 16px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--line);
      background: var(--paper-2);
      margin-top: 6px;
    }

    .confirm textarea {
      min-height: 90px;
    }

    .dock {
      position: fixed;
      left: 50%;
      bottom: 0;
      z-index: 50;
      transform: translateX(-50%);
      width: 100%;
      max-width: 760px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      background: rgba(255, 255, 255, .94);
      color: var(--ink);
      padding: 6px 6px calc(8px + var(--safe-bot));
      backdrop-filter: blur(18px) saturate(1.2);
      -webkit-backdrop-filter: blur(18px) saturate(1.2);
      border-top: 1px solid var(--line);
      box-shadow: 0 -8px 24px rgba(80, 40, 10, .06);
    }

    .dock a,
    .dock button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      background: none;
      border: 0;
      color: var(--mist);
      min-height: 52px;
      font-size: 10px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 4px 2px;
      margin: 0;
      line-height: 1.1;
      appearance: none;
      -webkit-appearance: none;
      border-radius: 12px;
    }

    .dock a svg,
    .dock button svg {
      width: 22px;
      height: 22px;
    }

    .dock a.is-on,
    .dock button.is-on {
      color: var(--orange-deep);
      background: var(--peach);
    }

    .toast {
      position: fixed;
      left: 50%;
      bottom: calc(var(--bar) + var(--safe-bot) + 16px);
      transform: translateX(-50%) translateY(12px);
      opacity: 0;
      pointer-events: none;
      background: var(--ink);
      color: #fff;
      padding: 10px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      z-index: 80;
      transition: .2s ease;
      max-width: 90vw;
      box-shadow: var(--shadow);
    }

    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .foot {
      margin: 32px 16px 16px;
      color: var(--mist);
      font-size: 12px;
      text-align: center;
    }

    .pwa-banner {
      display: none;
      margin: 0 16px 14px;
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid var(--line);
      background: linear-gradient(135deg, #fff3ec, #fffaf7);
      gap: 10px;
      align-items: center;
      box-shadow: var(--shadow-sm);
    }

    .pwa-banner.show {
      display: flex;
    }

    .pwa-banner .pwa-ico {
      width: 40px;
      height: 40px;
      border-radius: 11px;
      background: linear-gradient(145deg, #ff9a5c, var(--orange-deep));
      color: #fff;
      display: grid;
      place-items: center;
      flex: none;
    }

    .pwa-banner .pwa-ico svg {
      width: 20px;
      height: 20px;
    }

    .pwa-banner p {
      margin: 0;
      flex: 1;
      min-width: 0;
      font-size: 13px;
      color: var(--ink-2);
      line-height: 1.35;
    }

    .pwa-banner .btn {
      width: auto;
      flex: none;
      padding: 8px 14px;
      min-height: 40px;
      background: var(--orange);
      color: #fff;
    }

    .pwa-banner .btn-ghost {
      background: transparent;
      color: var(--mist);
      border: 1px solid var(--line);
      min-width: 40px;
      padding: 8px;
    }

    .pwa-status {
      margin: 8px 16px 0;
      font-size: 12px;
      color: var(--mist);
    }

    .svg-sprite {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
    }

    @media (min-width: 641px) {
      .pin-grid,
      .food-zone .zone-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .food-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .food-zone > summary {
        grid-template-columns: 1fr;
      }

      .food-zone > summary .zone-tools {
        justify-content: flex-start;
      }

      .stats {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .keep-hide {
        display: none;
      }

      .day {
        grid-template-columns: 34px minmax(0, 1fr);
        gap: 6px;
      }

      .day-tab {
        width: 34px;
      }

      .day-cols,
      .beat {
        grid-template-columns: 68px minmax(0, 1fr);
        padding-left: 10px;
        padding-right: 10px;
      }

      .beat::before {
        left: calc(68px / 2 + 10px - 3px);
      }

      .inline-pin .btn {
        min-width: 0;
        flex: 1 1 0;
        white-space: nowrap;
        min-height: 40px;
        font-size: 11px;
        padding: 6px 2px;
      }
    }

    @media print {
      .stick,
      .chips,
      .dock,
      .toast,
      .btn,
      .actions,
      .pwa-banner {
        display: none !important;
      }

      body {
        background: #fff;
        padding: 0;
      }

      .day,
      .pin {
        break-inside: avoid;
      }

      .day-cover {
        display: none;
      }
    }
  </style>`;

// Replace style block
html = html.replace(/  <style>[\s\S]*?  <\/style>/, NEW_CSS);

const SPRITE = `
  <svg class="svg-sprite" aria-hidden="true" focusable="false">
    <symbol id="i-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-7-11a7 7 0 1 1 14 0c0 6.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-7-11a7 7 0 1 1 14 0c0 6.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>
    <symbol id="i-cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></symbol>
    <symbol id="i-food" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v2a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6v-2z"/><path d="M8 3v4M12 2v5M16 3v4"/></symbol>
    <symbol id="i-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></symbol>
    <symbol id="i-map" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><path d="M9 3v15M15 6v15"/></symbol>
    <symbol id="i-nav" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></symbol>
    <symbol id="i-plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l-3 3v-3l-4-2 4-1V9l9 4 4-6 1 1-4 7 3 1-6 2-4-1z"/></symbol>
    <symbol id="i-hotel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/></symbol>
    <symbol id="i-train" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 17l-2 4M15 17l2 4M9 15h.01M15 15h.01"/></symbol>
    <symbol id="i-cam" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></symbol>
    <symbol id="i-tips" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.6.6 1 1.4 1 2.2V17h6v-.8c0-.8.4-1.6 1-2.2A7 7 0 0 0 12 2z"/></symbol>
    <symbol id="i-wallet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H6a2 2 0 0 0-2 2v2h16V5a2 2 0 0 0-2-2z"/><circle cx="17" cy="14" r="1.5"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></symbol>
    <symbol id="i-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></symbol>
    <symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/></symbol>
    <symbol id="i-drink" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l1 6H7L8 2z"/><path d="M7 8l1.2 12.2A2 2 0 0 0 10.2 22h3.6a2 2 0 0 0 2-1.8L17 8"/><path d="M12 12v4"/></symbol>
  </svg>
`;

if (!html.includes('class="svg-sprite"')) {
  html = html.replace("<body>", "<body>\n" + SPRITE);
}

// Mast header
const NEW_MAST = `    <header class="mast">
      <div class="mast-top">
        <div class="app-mark" aria-hidden="true"><svg class="ico"><use href="#i-mark"></use></svg></div>
        <div class="titles">
          <small>Kế hoạch 1 · Vinh &amp; Hà Trang</small>
          <h1><b>HZ–WZ–SH</b> <i>07–14/01</i></h1>
        </div>
        <span class="mast-badge">2 người</span>
      </div>
      <div class="rule"></div>
      <dl class="trip-meta">
        <div>
          <dt>Bắt đầu</dt>
          <dd>07/01/2027</dd>
        </div>
        <div>
          <dt>Kết thúc</dt>
          <dd>14/01/2027</dd>
        </div>
        <div class="dest">
          <dt>Hành trình</dt>
          <dd>Hàng Châu · Ô Trấn · Thượng Hải</dd>
        </div>
      </dl>
      <p class="lede" style="padding:4px 0 12px;color:var(--ink-2);font-size:14px"><i>Đi một vòng từ hồ thơ mộng đến phố cổ lên đèn, rồi kết thúc bằng một ngày quẩy hết mình ở Disney!</i><br><br>Một chuyến đi 8 ngày 7 đêm: vừa ngắm cảnh, ăn ngon, săn ảnh, vừa có một ngày dành trọn cho Disney. Lịch trình có tính toán để vui hết cỡ nhưng vẫn chừa sức… và chừa tiền mua trà!</p>
    </header>`;

html = html.replace(/    <header class="mast">[\s\S]*?    <\/header>/, NEW_MAST);

// PWA banner with icon
html = html.replace(
  /<div class="pwa-banner" id="pwa-banner" role="region" aria-label="Cài app">\s*<p id="pwa-banner-text">[\s\S]*?<\/p>\s*<button type="button" class="btn" id="pwa-install">Cài app<\/button>\s*<button type="button" class="btn btn-ghost" id="pwa-dismiss" aria-label="Đóng">✕<\/button>\s*<\/div>/,
  `<div class="pwa-banner" id="pwa-banner" role="region" aria-label="Cài app">
      <div class="pwa-ico" aria-hidden="true"><svg class="ico"><use href="#i-download"></use></svg></div>
      <p id="pwa-banner-text">Cài sổ tay lên màn hình chính để mở như app và dùng offline khi không có mạng.</p>
      <button type="button" class="btn" id="pwa-install">Cài app</button>
      <button type="button" class="btn btn-ghost" id="pwa-dismiss" aria-label="Đóng">✕</button>
    </div>`
);

// Chips with icons
const NEW_CHIPS = `    <div class="stick">
      <nav class="chips" aria-label="Ngày">
        <a href="#pins"><svg class="ico"><use href="#i-pin"></use></svg> Địa chỉ</a>
        <a href="#d0"><svg class="ico"><use href="#i-moon"></use></svg> Đêm 07</a>
        <a href="#d1"><svg class="ico"><use href="#i-cal"></use></svg> 08 HC</a>
        <a href="#d2"><svg class="ico"><use href="#i-cal"></use></svg> 09 HC</a>
        <a href="#d3"><svg class="ico"><use href="#i-cam"></use></svg> 10 Ô Trấn</a>
        <a href="#d4"><svg class="ico"><use href="#i-cam"></use></svg> 11 SH</a>
        <a href="#d5"><svg class="ico"><use href="#i-star"></use></svg> 12 Disney</a>
        <a href="#d6"><svg class="ico"><use href="#i-plane"></use></svg> 13 Về</a>
        <a href="#food"><svg class="ico"><use href="#i-food"></use></svg> Ăn</a>
        <a href="#tips"><svg class="ico"><use href="#i-tips"></use></svg> Tips</a>
      </nav>
    </div>`;

html = html.replace(/    <div class="stick">[\s\S]*?    <\/div>\n\n    <section class="itin"/, NEW_CHIPS + `\n\n    <section class="itin"`);

// Day covers
const covers = {
  d0: ["img/transit-pvg.jpg", "Sân bay Phố Đông"],
  d1: ["img/sight-westlake.jpg", "Hồ Tây Hàng Châu"],
  d2: ["img/sight-qinghefang.jpg", "Thanh Hà Phường"],
  d3: ["img/sight-wuzhen.jpg", "Ô Trấn Tây Sách"],
  d4: ["img/sight-bund.jpg", "Bến Thượng Hải"],
  d5: ["img/sight-disney.jpg", "Shanghai Disneyland"],
  d6: ["img/sight-wukang.jpg", "Vũ Khang · về HAN"],
};

for (const [id, [src, alt]] of Object.entries(covers)) {
  const re = new RegExp(
    `(<article class="day" id="${id}">\\s*<div class="day-tab"><span>[^<]*</span></div>\\s*<div class="day-panel">)\\s*(?:<img class="day-cover"[^>]*>\\s*)?`,
    "m"
  );
  html = html.replace(re, `$1\n          <img class="day-cover" src="${src}" alt="${alt}" loading="lazy">\n          `);
}

// Move hero+stats+route to before itinerary if still after
const heroMatch = html.match(/\n    <figure class="hero">[\s\S]*?<\/figure>\n\n    <div class="stats">[\s\S]*?<\/div>\n\n    <div class="route">[\s\S]*?<\/div>\n    <p class="note">Sổ tay iPhone[\s\S]*?<\/p>\n/);
if (heroMatch) {
  let block = heroMatch[0];
  // Enhance stats icons
  block = block
    .replace("<div class=\"stat\"><b>Bay</b>", '<div class="stat"><b><svg class="ico"><use href="#i-plane"></use></svg> Bay</b>')
    .replace("<div class=\"stat\"><b>Đêm đầu</b>", '<div class="stat"><b><svg class="ico"><use href="#i-moon"></use></svg> Đêm đầu</b>')
    .replace("<div class=\"stat\"><b>Lưu trú</b>", '<div class="stat"><b><svg class="ico"><use href="#i-hotel"></use></svg> Lưu trú</b>')
    .replace("<div class=\"stat\"><b>Ngân sách</b>", '<div class="stat"><b><svg class="ico"><use href="#i-wallet"></use></svg> Ngân sách</b>');
  html = html.replace(heroMatch[0], "\n");
  html = html.replace(
    /(<div class="stick">[\s\S]*?<\/div>\n\n)(<section class="itin")/,
    `$1${block}\n    $2`
  );
}

// Pillars with icons
html = html.replace(
  /<div class="pillars">\s*<article class="pillar">\s*<h3>Hai ngày Hàng Châu<\/h3>/,
  `<div class="pillars">
      <article class="pillar">
        <div class="pillar-ico" aria-hidden="true"><svg class="ico"><use href="#i-cam"></use></svg></div>
        <div>
        <h3>Hai ngày Hàng Châu</h3>`
);
html = html.replace(
  /(<p>08\/01 Hồ Tây[\s\S]*?Không nhồi Linh Ẩn\.<\/p>)\s*<\/article>\s*<article class="pillar">\s*<h3>Đêm đèn Tây Sách<\/h3>/,
  `$1</div>
      </article>
      <article class="pillar">
        <div class="pillar-ico" aria-hidden="true"><svg class="ico"><use href="#i-moon"></use></svg></div>
        <div>
        <h3>Đêm đèn Tây Sách</h3>`
);
html = html.replace(
  /(<p>Ngủ trong Ô Trấn[\s\S]*?vắng người\.<\/p>)\s*<\/article>\s*<article class="pillar">\s*<h3>Disney một ngày<\/h3>/,
  `$1</div>
      </article>
      <article class="pillar">
        <div class="pillar-ico" aria-hidden="true"><svg class="ico"><use href="#i-star"></use></svg></div>
        <div>
        <h3>Disney một ngày</h3>`
);
html = html.replace(
  /(<p>Thứ Ba 12\/01[\s\S]*?tàu điện ngầm về\.<\/p>)\s*<\/article>\s*<article class="pillar">\s*<h3>Dự Viên lên đèn<\/h3>/,
  `$1</div>
      </article>
      <article class="pillar">
        <div class="pillar-ico" aria-hidden="true"><svg class="ico"><use href="#i-pin"></use></svg></div>
        <div>
        <h3>Dự Viên lên đèn</h3>`
);
html = html.replace(
  /(<p>Phố chợ miễn phí[\s\S]*?chỉ đi thương thành\.<\/p>)\s*<\/article>\s*<\/div>/,
  `$1</div>
      </article>
    </div>`
);

// Section h2 with icons (common ones)
const h2Icons = [
  [/id="pins"[\s\S]*?<h2>Địa chỉ tiếng Trung<\/h2>/, 'id="pins">\n      <div>\n        <h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-pin"></use></svg></span> Địa chỉ tiếng Trung</h2>'],
  [/<h2>Ga · bến · sân bay<\/h2>/, '<h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-train"></use></svg></span> Ga · bến · sân bay</h2>'],
  [/<h2>Check-in<\/h2>/, '<h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-cam"></use></svg></span> Check-in</h2>'],
  [/<h2>Quán ăn · đồ uống theo khu<\/h2>/, '<h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-food"></use></svg></span> Quán ăn · đồ uống theo khu</h2>'],
  [/<h2 id="food">Ăn gì — gọi món tiếng Trung<\/h2>/, '<h2 id="food"><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-food"></use></svg></span> Ăn gì — gọi món tiếng Trung</h2>'],
  [/<h2 id="move">Di chuyển \/ 2 người<\/h2>/, '<h2 id="move"><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-nav"></use></svg></span> Di chuyển / 2 người</h2>'],
  [/<h2 id="tips">App cài trước khi bay<\/h2>/, '<h2 id="tips"><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-tips"></use></svg></span> App cài trước khi bay</h2>'],
  [/<h2>Vài mẹo thực chiến[\s\S]*?<\/h2>/, '<h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-tips"></use></svg></span> Vài mẹo thực chiến — đọc trước để khỏi trả học phí</h2>'],
  [/<h2 id="budget">Tiền nong \/ người<\/h2>/, '<h2 id="budget"><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-wallet"></use></svg></span> Tiền nong / người</h2>'],
  [/<h2 id="check">Checklist trước chuyến đi[\s\S]*?<\/h2>/, '<h2 id="check"><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-cal"></use></svg></span> Checklist trước chuyến đi — thiếu món nào là dễ toang món đó</h2>'],
  [/<h2>4 trải nghiệm nhất định phải có<\/h2>/, '<h2><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-star"></use></svg></span> 4 trải nghiệm nhất định phải có</h2>'],
  [/<h2 id="keep">Những điểm tham quan không nên bỏ qua<\/h2>/, '<h2 id="keep"><span class="sec-ico" aria-hidden="true"><svg class="ico"><use href="#i-cam"></use></svg></span> Những điểm tham quan không nên bỏ qua</h2>'],
];
for (const [re, rep] of h2Icons) {
  html = html.replace(re, rep);
}

// Dock with icons
html = html.replace(
  /  <nav class="dock">[\s\S]*?  <\/nav>/,
  `  <nav class="dock" aria-label="Điều hướng nhanh">
    <a href="#pins"><svg class="ico"><use href="#i-pin"></use></svg><span>Địa chỉ</span></a>
    <a href="#days"><svg class="ico"><use href="#i-cal"></use></svg><span>Lịch</span></a>
    <a href="#food"><svg class="ico"><use href="#i-food"></use></svg><span>Ăn</span></a>
    <button type="button" data-copy-many="homeinn_hz,wuzhen_visitor,homeinn_sh"><svg class="ico"><use href="#i-copy"></use></svg><span>Copy KS</span></button>
  </nav>`
);

// pinCard function with icons
const OLD_PINCARD = `    function pinCard(id, p, withId) {
      const dishes = (p.dishes || []).map(function (d) { return "<span class=\\"chip opt\\">" + d + "</span>"; }).join(" ");
      const copyLbl = withId ? "Copy địa chỉ" : "Copy";
      const amapLbl = withId ? "Amap 高德" : "Amap";
      const gmapLbl = withId ? "Google Maps" : "Maps";
      const kind = p.kind === "drink"
        ? '<span class="kind drink">Đồ uống</span>'
        : (p.group === "food" ? '<span class="kind">Ăn</span>' : "");
      return '<article class="pin"' + (withId ? ' id="pin-' + id + '"' : '') + '>' +
        '<img src="' + p.img + '" alt="' + p.vi + '">' +
        '<div class="meta">' + kind + '<div class="k">' + p.k + '</div><h3>' + p.vi + '</h3>' +
        '<p class="zh" lang="zh">' + p.zh + '</p>' +
        (p.tel ? '<p style="font-size:12px;color:var(--mist);margin-top:4px">' + p.tel + '</p>' : '') +
        (dishes ? '<div style="margin-top:6px">' + dishes + '</div>' : '') +
        '<div class="actions">' +
        '<button type="button" class="btn btn-copy" data-copy="' + p.zh.replace(/"/g, "&quot;") + '">' + copyLbl + '</button>' +
        '<a class="btn btn-amap" href="' + amapHref(p) + '" target="_blank" rel="noopener">' + amapLbl + '</a>' +
        '<a class="btn btn-gmap" href="' + gmapHref(p) + '" target="_blank" rel="noopener">' + gmapLbl + '</a>' +
        '</div></div></article>';
    }`;

const NEW_PINCARD = `    function ico(name) {
      return '<svg class="ico" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
    }
    function pinCard(id, p, withId) {
      const dishes = (p.dishes || []).map(function (d) { return "<span class=\\"chip opt\\">" + d + "</span>"; }).join(" ");
      const copyLbl = withId ? "Copy địa chỉ" : "Copy";
      const amapLbl = withId ? "Amap" : "Amap";
      const gmapLbl = withId ? "Maps" : "Maps";
      const kind = p.kind === "drink"
        ? '<span class="kind drink">' + ico("drink") + ' Đồ uống</span>'
        : (p.group === "food" ? '<span class="kind">' + ico("food") + ' Ăn</span>' : "");
      const tel = p.tel
        ? '<a class="tel" href="tel:' + p.tel.replace(/[^0-9+]/g, "") + '">' + ico("phone") + " " + p.tel + "</a>"
        : "";
      return '<article class="pin"' + (withId ? ' id="pin-' + id + '"' : '') + '>' +
        '<img src="' + p.img + '" alt="' + p.vi + '" loading="lazy">' +
        '<div class="meta">' + kind + '<div class="k">' + p.k + '</div><h3>' + p.vi + '</h3>' +
        '<p class="zh" lang="zh">' + p.zh + '</p>' +
        tel +
        (dishes ? '<div style="margin-top:6px">' + dishes + '</div>' : '') +
        '<div class="actions">' +
        '<button type="button" class="btn btn-copy" data-copy="' + p.zh.replace(/"/g, "&quot;") + '" data-label="' + copyLbl + '">' + ico("copy") + copyLbl + '</button>' +
        '<a class="btn btn-amap" href="' + amapHref(p) + '" target="_blank" rel="noopener">' + ico("map") + amapLbl + '</a>' +
        '<a class="btn btn-gmap" href="' + gmapHref(p) + '" target="_blank" rel="noopener">' + ico("nav") + gmapLbl + '</a>' +
        '</div></div></article>';
    }`;

if (html.includes("function pinCard(id, p, withId)")) {
  html = html.replace(/    function pinCard\(id, p, withId\) \{[\s\S]*?\n    \}/, NEW_PINCARD);
} else {
  console.error("pinCard not found");
}

// Fix copy button restore to keep icon
html = html.replace(
  `const defaultLbl = one.closest(".inline-pin") ? "Copy" : "Copy địa chỉ";
        copyText(text).then(function () {
          one.classList.add("ok");
          one.textContent = "Đã copy";
          toast("Đã copy: " + text);
          setTimeout(function () { one.classList.remove("ok"); one.textContent = defaultLbl; }, 1600);
        })`,
  `const defaultLbl = one.getAttribute("data-label") || (one.closest(".inline-pin") ? "Copy" : "Copy địa chỉ");
        copyText(text).then(function () {
          one.classList.add("ok");
          one.innerHTML = ico("copy") + "Đã copy";
          toast("Đã copy: " + text);
          setTimeout(function () { one.classList.remove("ok"); one.innerHTML = ico("copy") + defaultLbl; }, 1600);
        })`
);

html = html.replace(
  `manyText.classList.add("ok");
          manyText.textContent = "Đã copy";
          toast("Đã copy địa chỉ trong khu");
          setTimeout(function () { manyText.classList.remove("ok"); manyText.textContent = "Copy khu"; }, 1600);`,
  `manyText.classList.add("ok");
          manyText.innerHTML = ico("copy") + "Đã copy";
          toast("Đã copy địa chỉ trong khu");
          setTimeout(function () { manyText.classList.remove("ok"); manyText.innerHTML = ico("copy") + "Copy khu"; }, 1600);`
);

// Copy khu button with icon in fillFoodZones
html = html.replace(
  `'<button type="button" class="btn btn-copy" data-copy-many-text="' + encodeURIComponent(copyBlock) + '">Copy khu</button>' +`,
  `'<button type="button" class="btn btn-copy" data-copy-many-text="' + encodeURIComponent(copyBlock) + '">' + ico("copy") + 'Copy khu</button>' +`
);

// Dock active sync
html = html.replace(
  `document.querySelector(".dock").addEventListener("click", function (e) {
      const a = e.target.closest("a[href^=\\"#\\"]");
      if (!a) return;
      e.preventDefault();
      gotoHash(a.getAttribute("href"), true);
    });`,
  `document.querySelector(".dock").addEventListener("click", function (e) {
      const a = e.target.closest("a[href^=\\"#\\"]");
      if (!a) return;
      e.preventDefault();
      gotoHash(a.getAttribute("href"), true);
    });
    function syncDock() {
      const map = { pins: "#pins", d0: "#days", d1: "#days", d2: "#days", d3: "#days", d4: "#days", d5: "#days", d6: "#days", days: "#days", food: "#food", "food-pins": "#food", tips: "#tips", budget: "#tips", check: "#tips" };
      const stick = document.querySelector(".stick");
      const line = (stick ? stick.offsetHeight : 57) + 16;
      let key = "d0";
      ["pins", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "food", "tips"].forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - line <= 8) key = id;
      });
      const href = map[key] || "#days";
      document.querySelectorAll(".dock a[href^=\\"#\\"]").forEach(function (a) {
        a.classList.toggle("is-on", a.getAttribute("href") === href);
      });
    }`
);

html = html.replace(
  `window.addEventListener("scroll", function () {
      clearTimeout(syncChip._t);
      syncChip._t = setTimeout(syncChip, 50);
    }, { passive: true });
    syncChip();`,
  `window.addEventListener("scroll", function () {
      clearTimeout(syncChip._t);
      syncChip._t = setTimeout(function () { syncChip(); syncDock(); }, 50);
    }, { passive: true });
    syncChip();
    syncDock();`
);

html = html.replace(
  /Hangzhou-trip v2026-11-23a/,
  "Hangzhou-trip v2026-11-23b · UI mobile"
);

fs.writeFileSync(file, html);
console.log("Patched", file, "bytes", html.length);