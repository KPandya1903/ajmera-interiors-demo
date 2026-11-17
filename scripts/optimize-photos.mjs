// Turns raw-photos/<project>/*.JPG into responsive WebP + a manifest the site reads.
// Re-runnable: already-processed photos are skipped. Usage: npm run photos
import sharp from "sharp";
import { readdir, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.resolve(here, "../../raw-photos");
const OUT = path.resolve(here, "../public/photos");
const MANIFEST = path.resolve(here, "../src/data/photos.json");
const WIDTHS = [640, 1280];
const LABELS = { "3bhk": "3 BHK Residence", "5bhk-part-1": "5 BHK Residence", "5bhk-part-2": "5 BHK Residence" };

const exists = (p) => access(p).then(() => true, () => false);
const photos = [];

for (const dir of (await readdir(RAW, { withFileTypes: true })).filter((d) => d.isDirectory())) {
  const files = (await readdir(path.join(RAW, dir.name))).filter((f) => /\.(jpe?g)$/i.test(f)).sort();
  await mkdir(path.join(OUT, dir.name), { recursive: true });
  let n = 0;
  await Promise.all(
    chunk(files, 6).map(async (group) => {
      for (const file of group) {
        const base = file.replace(/\.[^.]+$/, "");
        const input = path.join(RAW, dir.name, file);
        const img = sharp(input).rotate(); // honour EXIF orientation
        const meta = await img.metadata();
        const swap = meta.orientation && meta.orientation >= 5;
        const w = swap ? meta.height : meta.width;
        const h = swap ? meta.width : meta.height;
        for (const width of WIDTHS) {
          const out = path.join(OUT, dir.name, `${base}-${width}.webp`);
          if (!(await exists(out))) await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
        }
        const blur = (await sharp(input).rotate().resize(16).blur().webp({ quality: 40 }).toBuffer()).toString("base64");
        photos.push({ id: `${dir.name}/${base}`, project: dir.name, label: LABELS[dir.name] ?? dir.name, w, h, blur: `data:image/webp;base64,${blur}` });
        n++;
      }
    }),
  );
  console.log(`${dir.name}: ${n} photos`);
}

photos.sort((a, b) => a.id.localeCompare(b.id));

// --- Drop near-duplicates -------------------------------------------------
// The photographer shoots 2–20 near-identical frames of every angle. Group frames whose
// 256-bit difference-hash is within DUP_DISTANCE bits and keep the sharpest of each group.
// 30 was checked by eye on contact sheets: it merges only true repeats, not different angles.
const DUP_DISTANCE = 30;
const small = (p) => path.join(OUT, p.project, `${p.id.split("/")[1]}-640.webp`);
for (const p of photos) {
  const px = await sharp(small(p)).resize(17, 16, { fit: "fill" }).greyscale().raw().toBuffer();
  p.hash = Array.from({ length: 256 }, (_, k) => (px[Math.floor(k / 16) * 17 + (k % 16)] > px[Math.floor(k / 16) * 17 + (k % 16) + 1] ? 1 : 0));
  p.sharpness = (await sharp(small(p)).greyscale().stats()).sharpness;
}
const parent = photos.map((_, i) => i);
const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
for (let i = 0; i < photos.length; i++)
  for (let j = i + 1; j < photos.length; j++) {
    let d = 0;
    for (let k = 0; k < 256 && d <= DUP_DISTANCE; k++) d += photos[i].hash[k] !== photos[j].hash[k];
    if (d <= DUP_DISTANCE) parent[find(i)] = find(j);
  }
const groups = new Map();
photos.forEach((p, i) => groups.set(find(i), [...(groups.get(find(i)) ?? []), p]));
const keep = [];
const dropped = {};
for (const g of groups.values()) {
  const best = g.reduce((a, b) => (b.sharpness > a.sharpness ? b : a));
  keep.push(best);
  if (g.length > 1) dropped[best.id] = g.filter((p) => p !== best).map((p) => p.id);
}
keep.sort((a, b) => a.id.localeCompare(b.id));

// --- Focal point for grid crops -----------------------------------------------
// The wall shows portrait photos as 4:5 tiles and landscape ones as 8:5 tiles. Ask sharp's
// "attention" strategy (skin, saturation, detail) where it would crop, and store that as a
// CSS object-position, so the crop keeps the interesting part of the room.
for (const p of keep) {
  const portrait = p.h > p.w;
  const [cw, ch] = portrait ? [640, 800] : [640, 400];
  const { info } = await sharp(small(p))
    .resize(cw, ch, { fit: "cover", position: sharp.strategy.attention })
    .toBuffer({ resolveWithObject: true });
  const scaledH = Math.round((640 * p.h) / p.w);
  const spare = scaledH - ch;
  p.fy = spare > 0 ? Math.round((-(info.cropOffsetTop ?? 0) / spare) * 100) : 50;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip working fields
await writeFile(MANIFEST, JSON.stringify(keep.map(({ hash, sharpness, ...p }) => p)));
await writeFile(path.resolve(here, "../src/data/duplicates.json"), JSON.stringify(dropped, null, 1));
console.log(`manifest: ${keep.length} unique photos (${photos.length - keep.length} near-duplicates hidden, see src/data/duplicates.json)`);

function chunk(arr, parts) {
  const out = Array.from({ length: parts }, () => []);
  arr.forEach((x, i) => out[i % parts].push(x));
  return out;
}
