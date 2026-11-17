import data from "@/data/videos.json";

export type Video = { id: string; title: string; kind: "walkthrough" | "reel"; project: string };

export const videos = data as Video[];
export const thumb = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w640`;
export const embed = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
export const watch = (id: string) => `https://drive.google.com/file/d/${id}/view`;
