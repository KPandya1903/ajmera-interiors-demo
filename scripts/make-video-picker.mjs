// Builds tools/video-picker.html: tick the clips to SHOW on the website's Films rows, then save the list.
// Usage: npm run video-picker   (after `npm run video-thumbs`)
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(await readFile(path.resolve(here, "../src/data/video-catalog.json"), "utf8"));
const current = JSON.parse(await readFile(path.resolve(here, "../src/data/videos.json"), "utf8")).map((v) => v.id);
const sig = createHash("sha1").update(JSON.stringify(current)).digest("hex").slice(0, 8);
const outDir = path.resolve(here, "../../tools");
await mkdir(outDir, { recursive: true });

const items = catalog.map((c) => ({
  id: c.id, t: c.title, mb: c.sizeMB, p: c.project, k: c.kind, g: c.group, bad: c.dark || c.flat ? 1 : 0,
}));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ajmera Interiors · Video picker</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,system-ui,sans-serif;background:#f7f3ec;color:#2b2a28}
  header{position:sticky;top:0;z-index:5;background:#1f2a44;color:#f7f3ec;padding:14px 24px;display:flex;flex-wrap:wrap;gap:10px 24px;align-items:center}
  header h1{font-size:16px;font-weight:600;letter-spacing:.04em}
  .count{font-size:14px;opacity:.85}
  .count b{color:#d9bd92}
  .spacer{flex:1}
  header button,header select{font:inherit;font-size:13px;padding:8px 14px;border:1px solid rgba(255,255,255,.35);background:transparent;color:inherit;cursor:pointer;border-radius:3px}
  header select option{color:#222}
  header button.primary{background:#f7f3ec;color:#1f2a44;border-color:#f7f3ec;font-weight:600}
  header button:hover{border-color:#fff}
  .help{padding:16px 24px;font-size:14px;color:#555;line-height:1.5}
  h2{padding:24px 24px 10px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#a7865a}
  .grid{display:grid;gap:10px;padding:0 24px 24px;align-items:start}
  .grid.wide{grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}
  .grid.tall{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
  .cell{display:contents}
  .tile{position:relative;cursor:pointer;background:#e9e0d2;overflow:hidden;border:3px solid transparent;border-radius:3px;user-select:none}
  .wide .tile{aspect-ratio:16/9}
  .tall .tile{aspect-ratio:9/16}
  .tile img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .2s,filter .2s}
  .tile .name{position:absolute;left:6px;bottom:6px;font-size:11px;background:rgba(0,0,0,.6);color:#fff;padding:2px 6px;border-radius:2px}
  .tile .mark{position:absolute;top:6px;right:6px;min-width:26px;height:26px;padding:0 6px;border-radius:13px;display:none;place-items:center;font-size:14px;font-weight:700;background:#2e7d32;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,.3)}
  .tile.on{border-color:#2e7d32}
  .tile.on .mark{display:grid}
  .tile:hover{border-color:#a7865a}
  .tile.on:hover{border-color:#43a047}
  .tile.bad img{opacity:.35;filter:grayscale(1)}
  .tile.bad.on img{opacity:.6}
  .zoom{position:absolute;top:6px;left:6px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;display:grid;place-items:center;font-size:14px;opacity:0;transition:opacity .15s}
  .tile:hover .zoom{opacity:1}
  .more{position:absolute;right:6px;bottom:6px;font-size:11px;font-weight:600;background:#a7865a;color:#fff;border:0;padding:3px 8px;border-radius:10px;cursor:pointer}
  .more:hover{background:#8d6d44}
  .tile.sub{border-style:dashed;border-color:#a7865a}
  .tile.sub.on{border-style:solid;border-color:#2e7d32}
  .pill{position:absolute;left:6px;top:38px;font-size:10px;background:rgba(0,0,0,.6);color:#fff;padding:1px 5px;border-radius:2px}
  #preview{position:fixed;inset:0;background:rgba(0,0,0,.88);display:none;place-items:center;z-index:10}
  #preview.on{display:grid}
  #box{display:flex;flex-direction:column;gap:10px;align-items:center}
  #box iframe{border:0;background:#000;width:min(92vw,1100px);aspect-ratio:16/9;max-height:78vh}
  #box.tall iframe{aspect-ratio:9/16;height:78vh;width:auto;max-width:92vw}
  #bar{display:flex;gap:10px;color:#fff;font-size:14px;align-items:center}
  #bar button{font:inherit;font-size:13px;padding:8px 14px;border:1px solid rgba(255,255,255,.5);background:transparent;color:#fff;border-radius:3px;cursor:pointer}
  #bar button#tick{background:#2e7d32;border-color:#2e7d32;font-weight:600}
  .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1f2a44;color:#fff;padding:12px 18px;border-radius:4px;font-size:14px;opacity:0;transition:opacity .3s;pointer-events:none;z-index:20}
  .toast.on{opacity:1}
</style>
</head>
<body>
<header>
  <h1>Video picker</h1>
  <span class="count" id="counts"></span>
  <span class="spacer"></span>
  <select id="view"><option value="all">Show: all clips</option><option value="sel">Show: selected only</option></select>
  <button id="site">Reset to site's current picks</button>
  <button id="reset">Clear all</button>
  <button id="download" class="primary">Save my choices</button>
</header>
<p class="help">
  <b>Tick the clips you want on the website</b> (click a tile: green border + number). Untouched clips stay off the site.
  The number is the order they appear on the site, in the order you ticked them.
  Hover and press 🔍 to <b>watch the clip</b>. A <b>+N similar</b> badge means N near-identical takes; click it to open them and pick a different one.
  Dim tiles are very dark or blank. Choices are remembered in this browser. When done press <b>Save my choices</b>; a file called <code>videos-selected.json</code> downloads; tell Claude and it will apply it.
</p>
<div id="groups"></div>
<div id="preview"><div id="box"><iframe allow="autoplay; fullscreen" allowfullscreen></iframe><div id="bar"><span id="ptitle"></span><button id="tick"></button><button id="close">Close (Esc)</button></div></div></div>
<div class="toast" id="toast"></div>
<script>
const ITEMS = ${JSON.stringify(items)};
const LEGACY = "ajmera-video-picker-selected";
const KEY = LEGACY + "-${sig}"; // changes whenever src/data/videos.json changes, so the page restarts from the site's real picks
const SITE = ${JSON.stringify(current)};
for (const k of Object.keys(localStorage)) if (k.startsWith(LEGACY + "-") && k !== KEY) localStorage.removeItem(k);
let saved = localStorage.getItem(KEY);
if (saved === null && localStorage.getItem(LEGACY) !== null) { // one-time migration of ticks saved by the earlier page
  saved = localStorage.getItem(LEGACY);
  localStorage.removeItem(LEGACY);
}
let sel = JSON.parse(saved || "null") ?? SITE.slice();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
sel = sel.filter(id => byId[id]);
const SECTIONS = [["3 BHK","walkthrough","3 BHK Walkthroughs"],["3 BHK","reel","3 BHK Reels"],["5 BHK","walkthrough","5 BHK Walkthroughs"],["5 BHK","reel","5 BHK Reels"]];
const src = it => "video-thumbs/" + it.id + (it.k === "reel" ? "-up" : "") + ".jpg";
const root = document.getElementById("groups");
const secs = [];
const open = new Set();

function tile(it, cls, extra) {
  const t = document.createElement("div");
  t.className = "tile " + cls + (it.bad ? " bad" : "");
  t.dataset.id = it.id; t.title = it.t + " · " + it.mb + " MB";
  t.innerHTML = '<img loading="lazy" src="' + src(it) + '" alt=""><span class="zoom" title="Watch this clip">🔍</span><span class="mark"></span><span class="name">' + esc(it.t.replace("EFCB","#")) + '</span>' + (extra || "");
  t.addEventListener("click", e => {
    if (e.target.classList.contains("zoom")) return showPreview(it.id);
    if (e.target.classList.contains("more")) { open.has(it.g) ? open.delete(it.g) : open.add(it.g); return build(); }
    toggle(it.id);
  });
  return t;
}
function toggle(id) { const i = sel.indexOf(id); i < 0 ? sel.push(id) : sel.splice(i, 1); render(); }

function build() {
  root.innerHTML = ""; secs.length = 0;
  for (const [proj, kind, title] of SECTIONS) {
    const list = ITEMS.filter(i => i.p === proj && i.k === kind);
    const groups = new Map();
    for (const it of list) (groups.get(it.g) ?? groups.set(it.g, []).get(it.g)).push(it);
    const gl = [...groups.values()].map(m => m.sort((a, b) => b.mb - a.mb));
    // good groups first (largest clip is the representative), blank/dark ones last
    gl.sort((a, b) => a[0].bad - b[0].bad);
    const h = document.createElement("h2"); root.append(h);
    const grid = document.createElement("div"); grid.className = "grid " + (kind === "reel" ? "tall" : "wide"); root.append(grid);
    for (const m of gl) {
      const gid = m[0].g, expanded = open.has(gid), extra = m.length > 1 ? '<button class="more">' + (expanded ? "hide" : "+" + (m.length - 1) + " similar") + '</button>' : "";
      // a group whose representative isn't ticked but another take is: show the ticked take first
      const rep = m.find(x => sel.includes(x.id)) ?? m[0];
      const shown = expanded ? [rep, ...m.filter(x => x !== rep)] : [rep];
      shown.forEach((it, n) => grid.append(tile(it, n ? "sub" : "", n ? "" : extra)));
    }
    secs.push({ h, title, list, grid });
  }
  render();
}

function render() {
  localStorage.setItem(KEY, JSON.stringify(sel));
  const only = document.getElementById("view").value === "sel";
  for (const t of document.querySelectorAll(".tile")) {
    const n = sel.indexOf(t.dataset.id);
    t.classList.toggle("on", n >= 0);
    t.querySelector(".mark").textContent = n >= 0 ? n + 1 : "";
    t.style.display = only && n < 0 ? "none" : "";
  }
  const parts = [];
  for (const s of secs) {
    const c = s.list.filter(i => sel.includes(i.id)).length;
    s.h.textContent = s.title + " · " + s.list.length + " clips · " + c + " selected";
    parts.push(s.title.replace(" Walkthroughs"," walk").replace(" Reels"," reels") + " <b>" + c + "</b>");
  }
  document.getElementById("counts").innerHTML = "Selected <b>" + sel.length + "</b> of " + ITEMS.length + " &nbsp;·&nbsp; " + parts.join(" · ");
}

let cur = null;
function showPreview(id) {
  cur = byId[id];
  const p = document.getElementById("preview");
  document.getElementById("box").classList.toggle("tall", cur.k === "reel");
  p.querySelector("iframe").src = "https://drive.google.com/file/d/" + id + "/preview";
  document.getElementById("ptitle").textContent = cur.t + " · " + cur.p + " " + cur.k;
  syncTick(); p.classList.add("on");
}
function syncTick() { document.getElementById("tick").textContent = sel.includes(cur.id) ? "✓ Selected (click to remove)" : "Tick to show on site"; }
function closePreview() { const p = document.getElementById("preview"); p.classList.remove("on"); p.querySelector("iframe").src = "about:blank"; }
document.getElementById("tick").onclick = () => { toggle(cur.id); syncTick(); };
document.getElementById("close").onclick = closePreview;
document.getElementById("preview").onclick = e => e.target.id === "preview" && closePreview();
document.addEventListener("keydown", e => e.key === "Escape" && closePreview());
document.getElementById("view").onchange = render;
document.getElementById("site").onclick = () => { if (confirm("Go back to the clips currently on the website?")) { sel = SITE.slice(); build(); } };
document.getElementById("reset").onclick = () => { if (confirm("Un-tick every clip?")) { sel = []; render(); } };
document.getElementById("download").onclick = () => {
  const blob = new Blob([JSON.stringify(sel, null, 1)], { type: "application/json" });
  Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "videos-selected.json" }).click();
  const t = document.getElementById("toast");
  t.textContent = "Saved videos-selected.json (" + sel.length + " clips) to your Downloads folder";
  t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 3500);
};
build();
</script>
</body>
</html>
`;

await writeFile(path.join(outDir, "video-picker.html"), html);
console.log(`tools/video-picker.html: ${items.length} clips (${current.length} pre-ticked)`);
