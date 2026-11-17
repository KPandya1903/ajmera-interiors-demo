// High-resolution hero slides, made straight from the camera originals. Usage: npm run hero
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const slides = JSON.parse(await readFile(path.resolve(here, "../src/data/hero.json"), "utf8"));
const OUT = path.resolve(here, "../public/hero");
await mkdir(OUT, { recursive: true });

for (const { id } of slides) {
  const [project, name] = id.split("/");
  const input = path.resolve(here, "../../raw-photos", project, `${name}.JPG`);
  for (const width of [1280, 1920, 2560]) {
    await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 86, smartSubsample: true }).toFile(path.join(OUT, `${name}-${width}.webp`));
  }
  console.log("hero:", name);
}
