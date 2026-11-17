// Builds tools/photo-picker.html: every photo on the wall, click to untick, then save the list.
// Usage: npm run picker   (re-run after `npm run photos` adds new photos)
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const photos = JSON.parse(await readFile(path.resolve(here, "../src/data/photos.json"), "utf8"));
const hidden = JSON.parse(await readFile(path.resolve(here, "../src/data/hidden.json"), "utf8"));
const outDir = path.resolve(here, "../../tools");
await mkdir(outDir, { recursive: true });

const items = photos.map((p) => ({ id: p.id, home: p.project.startsWith("5bhk") ? "5 BHK" : "3 BHK", ratio: +(p.w / p.h).toFixed(3) }));

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ajmera Interiors · Photo picker</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,system-ui,sans-serif;background:#f7f3ec;color:#2b2a28}
  header{position:sticky;top:0;z-index:5;background:#1f2a44;color:#f7f3ec;padding:14px 24px;display:flex;flex-wrap:wrap;gap:12px 24px;align-items:center}
  header h1{font-size:16px;font-weight:600;letter-spacing:.04em}
  .count{font-size:14px;opacity:.85}
  .count b{color:#d9bd92}
  .spacer{flex:1}
  header button,header select{font:inherit;font-size:13px;padding:8px 14px;border:1px solid rgba(255,255,255,.35);background:transparent;color:inherit;cursor:pointer;border-radius:3px}
  header button.primary{background:#f7f3ec;color:#1f2a44;border-color:#f7f3ec;font-weight:600}
  header button:hover{border-color:#fff}
  .help{padding:16px 24px;font-size:14px;color:#555;line-height:1.5}
  h2{padding:24px 24px 10px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#a7865a}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;padding:0 24px 24px}
  .tile{position:relative;cursor:pointer;background:#e9e0d2;aspect-ratio:1;overflow:hidden;border:3px solid transparent;border-radius:3px;user-select:none}
  .tile img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .2s,filter .2s}
  .tile .name{position:absolute;left:6px;bottom:6px;font-size:11px;background:rgba(0,0,0,.55);color:#fff;padding:2px 6px;border-radius:2px}
  .tile .mark{position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:15px;font-weight:700;background:#2e7d32;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,.3)}
  .tile.off{border-color:#c62828}
  .tile.off img{opacity:.35;filter:grayscale(1)}
  .tile.off .mark{background:#c62828}
  .tile:hover{border-color:#a7865a}
  .tile.off:hover{border-color:#e53935}
  .zoom{position:absolute;top:6px;left:6px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;display:grid;place-items:center;font-size:13px;opacity:0;transition:opacity .15s}
  .tile:hover .zoom{opacity:1}
  #preview{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;place-items:center;z-index:10;cursor:zoom-out}
  #preview img{max-width:92vw;max-height:88vh}
  #preview.on{display:grid}
  .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1f2a44;color:#fff;padding:12px 18px;border-radius:4px;font-size:14px;opacity:0;transition:opacity .3s;pointer-events:none}
  .toast.on{opacity:1}
</style>
</head>
<body>
<header>
  <h1>Photo picker</h1>
  <span class="count">Showing <b id="kept"></b> · Hidden <b id="hiddenCount"></b> · Total ${items.length}</span>
  <span class="spacer"></span>
  <select id="view"><option value="all">All photos</option><option value="kept">Only shown</option><option value="off">Only hidden</option></select>
  <button id="reset">Show all again</button>
  <button id="download" class="primary">Save my choices</button>
</header>
<p class="help">
  <b>Click a photo to hide it</b> from the website (it turns grey with a red ✕). Click again to bring it back.
  Hover and press the 🔍 to view it large. Your choices are remembered in this browser.
  When you're done, press <b>Save my choices</b>. A file called <code>hidden.json</code> downloads; tell Claude and it will apply it.
</p>
<div id="groups"></div>
<div id="preview"><img alt=""></div>
<div class="toast" id="toast"></div>
<script>
const ITEMS = ${JSON.stringify(items)};
const KEY = "ajmera-photo-picker-hidden";
const off = new Set(JSON.parse(localStorage.getItem(KEY) || "null") ?? ${JSON.stringify(hidden)});
const src = (id, w) => "../site/public/photos/" + id.split("/")[0] + "/" + id.split("/")[1] + "-" + w + ".webp";
const groups = document.getElementById("groups");

for (const home of ["3 BHK", "5 BHK"]) {
  const list = ITEMS.filter(i => i.home === home);
  if (!list.length) continue;
  const h = document.createElement("h2"); h.textContent = home + " Residence · " + list.length + " photos"; groups.append(h);
  const grid = document.createElement("div"); grid.className = "grid"; groups.append(grid);
  for (const it of list) {
    const t = document.createElement("div");
    t.className = "tile"; t.dataset.id = it.id; t.title = it.id;
    t.innerHTML = '<img loading="lazy" src="' + src(it.id, 640) + '" alt=""><span class="zoom" title="View large">🔍</span><span class="mark"></span><span class="name">' + it.id.split("/")[1].replace("EFCB","#") + '</span>';
    t.addEventListener("click", e => {
      if (e.target.classList.contains("zoom")) { showPreview(it.id); return; }
      off.has(it.id) ? off.delete(it.id) : off.add(it.id); render();
    });
    grid.append(t);
  }
}

function render() {
  localStorage.setItem(KEY, JSON.stringify([...off]));
  const view = document.getElementById("view").value;
  for (const t of document.querySelectorAll(".tile")) {
    const isOff = off.has(t.dataset.id);
    t.classList.toggle("off", isOff);
    t.querySelector(".mark").textContent = isOff ? "✕" : "✓";
    t.style.display = view === "all" || (view === "off") === isOff ? "" : "none";
  }
  document.getElementById("kept").textContent = ITEMS.length - off.size;
  document.getElementById("hiddenCount").textContent = off.size;
}

function showPreview(id) {
  const p = document.getElementById("preview");
  p.querySelector("img").src = src(id, 1280); p.classList.add("on");
}
document.getElementById("preview").onclick = e => e.currentTarget.classList.remove("on");
document.addEventListener("keydown", e => e.key === "Escape" && document.getElementById("preview").classList.remove("on"));
document.getElementById("view").onchange = render;
document.getElementById("reset").onclick = () => { if (confirm("Show every photo again?")) { off.clear(); render(); } };
document.getElementById("download").onclick = () => {
  const blob = new Blob([JSON.stringify([...off].sort(), null, 1)], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "hidden.json" });
  a.click();
  const t = document.getElementById("toast");
  t.textContent = "Saved hidden.json (" + off.size + " hidden) to your Downloads folder";
  t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 3500);
};
render();
</script>
</body>
</html>
`;

await writeFile(path.join(outDir, "photo-picker.html"), html);
console.log(`tools/photo-picker.html: ${items.length} photos (${hidden.length} already hidden)`);
