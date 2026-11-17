import data from "@/data/photos.json";
import duplicates from "@/data/duplicates.json";
import hidden from "@/data/hidden.json";

export type Photo = {
  id: string;
  project: string;
  label: string;
  w: number;
  h: number;
  blur: string;
  /** Vertical focal point (0–100, CSS object-position %) for the wall's 4:5 / 8:5 crops. */
  fy?: number;
};

/** Default crop focus: keep a little more floor/furniture than ceiling. Keep in sync with FOCUS_DEFAULT in scripts/optimize-photos.mjs. */
export const FOCUS_Y = 60;

/**
 * Photos the owners unticked in the photo picker (tools/photo-picker.html).
 * Hiding is per *scene*: if any near-duplicate frame of a scene was hidden, the frame
 * currently chosen to represent it stays hidden too, even after re-running `npm run photos`
 * picks a different "sharpest" frame.
 */
const hiddenIds = new Set<string>(hidden as string[]);
for (const [rep, frames] of Object.entries(duplicates as Record<string, string[]>))
  if (frames.some((f) => hiddenIds.has(f))) hiddenIds.add(rep);

export const photos = (data as Photo[]).filter((p) => !hiddenIds.has(p.id));

export const photoSrc = (p: Photo, width: 640 | 1280) => `/photos/${p.project}/${p.id.split("/")[1]}-${width}.webp`;

/** Groups the project folders into the two homes shown as filters. */
export const homeOf = (p: Photo) => (p.project.startsWith("5bhk") ? "5 BHK" : "3 BHK");
