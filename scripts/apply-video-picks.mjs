// Applies the owner's picks to src/data/videos.json.
// Usage: npm run video-apply -- ~/Downloads/videos-selected.json [--force]
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const fail = (m) => { console.error(m); process.exit(1); };
const force = process.argv.includes("--force");
const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!arg) fail("Usage: node scripts/apply-video-picks.mjs <videos-selected.json> [--force]");
const file = arg.startsWith("~") ? path.join(os.homedir(), arg.slice(1)) : path.resolve(arg);
let picks;
try {
  picks = JSON.parse(await readFile(file, "utf8"));
} catch (e) {
  fail(e.code === "ENOENT" ? `File not found: ${file}` : `Could not read ${file} as JSON: ${e.message}`);
}
if (!Array.isArray(picks) || picks.some((x) => typeof x !== "string")) fail("Expected a JSON array of ids (the file the picker's \"Save my choices\" downloads).");
if (!picks.length && !force) fail("The selection is empty; this would remove every film from the site. Re-run with --force if that is really what you want.");

const catalog = new Map(JSON.parse(await readFile(path.resolve(here, "../src/data/video-catalog.json"), "utf8")).map((c) => [c.id, c]));
const VIDEOS = path.resolve(here, "../src/data/videos.json");
const existing = new Map(JSON.parse(await readFile(VIDEOS, "utf8")).map((v) => [v.id, v]));

const unknown = picks.filter((id) => !catalog.has(id));
if (unknown.length) fail(`Unknown ids (not in catalog): ${unknown.join(", ")}`);
const ids = [...new Set(picks)];
if (ids.length !== picks.length) console.warn(`Warning: ${picks.length - ids.length} duplicate id(s) ignored.`);

const out = ids.map((id) => {
  const c = catalog.get(id), old = existing.get(id);
  const v = { id, title: c.title, kind: c.kind, project: c.project };
  if (old?.rotate !== undefined) v.rotate = old.rotate;
  if (old?.youtubeId) v.youtubeId = old.youtubeId;
  return v;
});
await writeFile(VIDEOS, JSON.stringify(out, null, 1) + "\n");
for (const p of ["3 BHK", "5 BHK"]) for (const k of ["walkthrough", "reel"]) console.log(`${p} ${k}s: ${out.filter((v) => v.project === p && v.kind === k).length}`);
console.log(`Wrote ${out.length} videos to src/data/videos.json`);
