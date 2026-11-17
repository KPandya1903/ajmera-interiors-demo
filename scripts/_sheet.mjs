// usage: node scripts/_sheet.mjs out.jpg id1 id2 ...  -> labelled contact sheet
import sharp from "sharp";
const [out, ...ids] = process.argv.slice(2);
const W = 240, cols = 6, rows = Math.ceil(ids.length / cols);
const tiles = await Promise.all(ids.map(async (id, i) => {
  const [proj, name] = id.split("/");
  const img = await sharp(`public/photos/${proj}/${name}-640.webp`).resize(W, W, { fit: "cover" }).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="22"><rect width="100%" height="100%" fill="black" opacity=".6"/><text x="6" y="16" font-size="14" fill="white" font-family="sans-serif">${name.replace("EFCB","")}</text></svg>`);
  return [{ input: img, left: (i % cols) * W, top: Math.floor(i / cols) * W }, { input: label, left: (i % cols) * W, top: Math.floor(i / cols) * W }];
}));
await sharp({ create: { width: cols * W, height: rows * W, channels: 3, background: "#222" } }).composite(tiles.flat()).jpeg({ quality: 70 }).toFile(out);
