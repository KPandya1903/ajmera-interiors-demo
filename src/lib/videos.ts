import data from "@/data/videos.json";

/** A clip lives in Google Drive (`id`) and/or on YouTube (`youtubeId`, preferred when set). */
export type Video = {
  id: string;
  title: string;
  kind: "walkthrough" | "reel";
  project: string;
  youtubeId?: string;
  /** CSS rotation (deg) to apply to the Drive poster. Defaults: reels -90, walkthroughs 0. Ignored for YouTube posters. */
  rotate?: 90 | -90 | 0;
};

export const videos = data as Video[];

/*
 * Drive's thumbnail endpoint hard-caps video posters at 640x360 (measured: sz=w1280/w1920/w4000/s0
 * all return 640x360). Only request w640 and, for retina, nothing larger exists.
 * Drive also ignores rotation metadata on phone clips, so vertical reels come back as sideways 16:9
 * frames; the card rotates them (see VideoRow).
 */
export const thumb = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w640`;
export const embed = (v: Video) =>
  v.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0&autoplay=1`
    : `https://drive.google.com/file/d/${v.id}/preview`;
export const watch = (v: Video) =>
  v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : `https://drive.google.com/file/d/${v.id}/view`;

export const poster = (v: Video) => (v.youtubeId ? `https://i.ytimg.com/vi/${v.youtubeId}/maxresdefault.jpg` : thumb(v.id));
export const posterFallback = (v: Video) => (v.youtubeId ? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg` : undefined);
/** Rotation needed to make the poster upright (YouTube posters are always upright). */
export const posterRotation = (v: Video) => (v.youtubeId ? 0 : (v.rotate ?? (v.kind === "reel" ? -90 : 0)));
export const label = (v: Video) => `${v.project} ${v.kind}`;
