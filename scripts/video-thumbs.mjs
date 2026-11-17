// Builds src/data/video-catalog.json from scripts/videos.tsv, downloads each clip's Drive poster into
// tools/video-thumbs/, makes upright copies for reels, and groups near-duplicate shots by dHash.
// Usage: npm run video-thumbs [-- --threshold=N]   (existing thumbnails are skipped; grouping is recomputed every run)
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const TSV = path.join(here, "videos.tsv");
const CATALOG = path.resolve(here, "../src/data/video-catalog.json");
const OUT = path.resolve(here, "../../tools/video-thumbs");
const arg = (n, d) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=")[1] ?? d;
const THRESHOLD = Number(arg("threshold", 64)); // max differing bits (of 256) to call two shots "the same"
const DARK_LUMA = 25;
const FLAT_STD = 12; // very low detail

const FOLDERS = {
  "1Q6drvfvtVn0CDVJPw_h1FsK0bkD2duYS": ["3 BHK", "3bhk", "walkthrough"],
  "1sOcP4YCeZnQ-m-Tc1Q2M3z91uEVBAxFY": ["3 BHK", "3bhk", "reel"],
  "1Q26vBoT2AW3NiTMbEebNTAAOkmldxCcF": ["5 BHK", "5bhk-1", "walkthrough"],
  "10EzCNzZVIypEjQdUpA56UhMPvkR1pK3K": ["5 BHK", "5bhk-1", "reel"],
  "1cVHwVZ2GeYcMVCH_UkG3VxdSvh1ABwTz": ["5 BHK", "5bhk-2", "walkthrough"],
  "1kHzA0AOO7OIM5Rlbp7FQZ4Tvu0qOObpB": ["5 BHK", "5bhk-2", "reel"],
};

const catalog = (await readFile(TSV, "utf8"))
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    const [folder, id, file, size] = l.split("\t");
    const f = FOLDERS[folder];
    if (!f) throw new Error(`unknown folder ${folder}`);
    return { id, title: file.replace(/\.[^.]+$/, ""), file, sizeMB: +(Number(size) / 1048576).toFixed(1), project: f[0], shoot: f[1], kind: f[2] };
  });

await mkdir(OUT, { recursive: true });
const exists = (p) => access(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let blocked = 0;
const failed = [];
async function download(c) {
  const file = path.join(OUT, `${c.id}.jpg`);
  if (await exists(file)) return;
  for (let attempt = 0; attempt < 5; attempt++) {
    if (blocked >= 6) return;
    try {
      const r = await fetch(`https://drive.google.com/thumbnail?id=${c.id}&sz=w640`);
      if (r.status === 403 || r.status === 429) {
        blocked++;
        await sleep(2000 * 2 ** attempt);
        continue;
      }
      if (r.status >= 400 && r.status < 500) break; // 404 etc: retrying won't help
      if (r.ok && r.headers.get("content-type")?.startsWith("image/")) {
        await writeFile(file, Buffer.from(await r.arrayBuffer()));
        blocked = 0;
        return;
      }
    } catch {}
    await sleep(800 * 2 ** attempt);
  }
  failed.push(c.id);
}

let next = 0;
let done = 0;
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (next < catalog.length) {
      const c = catalog[next++];
      await download(c);
      if (++done % 100 === 0) console.log(`  downloaded ${done}/${catalog.length}`);
      await sleep(120);
    }
  }),
);
if (blocked >= 6) {
  console.error("STOP: repeated 403/429 from Drive. Wait a while and re-run (existing thumbs are kept).");
  process.exit(2);
}

// Upright copies for reels, hashes, quality flags
const hashes = new Map();
for (const c of catalog) {
  const file = path.join(OUT, `${c.id}.jpg`);
  if (!(await exists(file))) { if (!failed.includes(c.id)) failed.push(c.id); continue; }
  const meta = await sharp(file).metadata();
  let img = sharp(file);
  if (c.kind === "reel") {
    const up = path.join(OUT, `${c.id}-up.jpg`);
    if (meta.width > meta.height) { // Drive hands back phone clips sideways; -90 puts them upright
      if (!(await exists(up))) await sharp(file).rotate(-90).jpeg({ quality: 82 }).toFile(up);
      img = sharp(up);
    } else if (!(await exists(up))) await writeFile(up, await readFile(file));
  }
  const { data } = await img.resize(17, 16, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  hashes.set(c.id, Array.from({ length: 256 }, (_, k) => (data[Math.floor(k / 16) * 17 + (k % 16)] > data[Math.floor(k / 16) * 17 + (k % 16) + 1] ? 1 : 0)));
  const st = await sharp(file).greyscale().stats();
  const { mean, stdev } = st.channels[0];
  c.dark = mean < DARK_LUMA || undefined;
  c.flat = (!c.dark && stdev < FLAT_STD) || undefined;
  c.luma = Math.round(mean);
}

// Single-link union-find within (shoot, kind), guarded so chains can't drift: a merge is refused if any
// cross pair of the two clusters differs by more than THRESHOLD + SLACK bits (same shoot + same orientation only).
const SLACK = 8;
const parent = new Map(catalog.map((c) => [c.id, c.id]));
const members = new Map(catalog.map((c) => [c.id, [c.id]]));
const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
const dist = (a, b) => { let d = 0; for (let k = 0; k < 256; k++) d += a[k] !== b[k]; return d; };
const edges = [];
for (let i = 0; i < catalog.length; i++) {
  const a = catalog[i];
  if (!hashes.has(a.id) || a.dark || a.flat) continue;
  for (let j = i + 1; j < catalog.length; j++) {
    const b = catalog[j];
    if (b.shoot !== a.shoot || b.kind !== a.kind || !hashes.has(b.id) || b.dark || b.flat) continue;
    const d = dist(hashes.get(a.id), hashes.get(b.id));
    if (d <= THRESHOLD) edges.push([d, a.id, b.id]);
  }
}
edges.sort((x, y) => x[0] - y[0]);
for (const [, x, y] of edges) {
  const rx = find(x), ry = find(y);
  if (rx === ry) continue;
  const ok = members.get(rx).every((p) => members.get(ry).every((q) => dist(hashes.get(p), hashes.get(q)) <= THRESHOLD + SLACK));
  if (!ok) continue;
  parent.set(rx, ry);
  members.set(ry, [...members.get(ry), ...members.get(rx)]);
}
const groups = new Map();
for (const c of catalog) (groups.get(find(c.id)) ?? groups.set(find(c.id), []).get(find(c.id))).push(c);
let n = 0;
for (const members of groups.values()) {
  n++;
  for (const m of members) m.group = `g${String(n).padStart(3, "0")}`;
}
for (const c of catalog) for (const k of ["dark", "flat"]) if (!c[k]) delete c[k];
await writeFile(CATALOG, JSON.stringify(catalog, null, 1) + "\n");

const stat = (kind, project) => {
  const l = catalog.filter((c) => c.kind === kind && c.project === project);
  return `${project} ${kind}: ${l.length} clips, ${new Set(l.map((c) => c.group)).size} groups`;
};
console.log(`threshold ${THRESHOLD}; ${catalog.length} clips; dark ${catalog.filter((c) => c.dark).length}; flat ${catalog.filter((c) => c.flat).length}; failed ${failed.length}`);
for (const p of ["3 BHK", "5 BHK"]) for (const k of ["walkthrough", "reel"]) console.log(" ", stat(k, p));
if (failed.length) console.log("failed ids:", failed.join(" "));
