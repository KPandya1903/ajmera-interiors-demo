# Ajmera Interiors website

Marketing site for Ajmera Interiors, a family-owned interior design studio in Mumbai: a home page
(hero slideshow, services, filterable photo wall, films teaser, studio teaser), `/films`, `/about`
and `/contact` (channels plus a "Plan my home" form that opens a pre-filled WhatsApp message or email).

Next.js 16 (App Router) with `output: "export"`, React 19, Tailwind CSS 4. The build is plain static
HTML/CSS/JS in `out/`, so it can be hosted anywhere (GitHub Pages, Cloudflare Pages, Hostinger...).
There is no server, database or CMS: content lives in `src/data/*.json` and `public/`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 (also reachable from phones/TVs on the home Wi-Fi). |
| `npm run build` | Static export to `out/`. |
| `npm run lint` | ESLint. Type-check with `npx tsc --noEmit`. |
| `npm run photos` | `../raw-photos/<project>/*.JPG` to responsive WebP in `public/photos/` plus `src/data/photos.json` (blur placeholders, sizes, near-duplicate groups). Re-runnable; done photos are skipped. |
| `npm run hero` | Hero slides listed in `src/data/hero.json` to `public/hero/` at 1280/1920/2560w, from the camera originals. |
| `npm run picker` | Builds `../tools/photo-picker.html` for choosing which photos appear on the wall. |
| `npm run video-thumbs` | Reads `scripts/videos.tsv`, writes `src/data/video-catalog.json`, downloads Drive posters to `../tools/video-thumbs/`. |
| `npm run video-picker` | Builds `../tools/video-picker.html` for choosing which clips appear on the Films rows. |
| `npm run video-apply -- <file.json>` | Applies the saved video picks to `src/data/videos.json`. |

The photo, hero and video scripts need the raw files outside this repo (`../raw-photos`, `../tools`),
so they run on the owner's machine only; their outputs are committed.

## Updating content

- **Photos:** drop new JPGs into `../raw-photos/<project>/`, run `npm run photos`, then
  `npm run picker`. Untick photos in the picker and save; it downloads `hidden.json`, which replaces
  `src/data/hidden.json`. Hiding is per scene, so it survives re-running `npm run photos`.
- **Hero slides:** edit `src/data/hero.json`, then `npm run hero`.
- **Films:** add rows to `scripts/videos.tsv`, `npm run video-thumbs`, `npm run video-picker`, tick
  clips, save, then `npm run video-apply -- ~/Downloads/videos-selected.json`. To play a clip from
  YouTube instead of Drive, add its `youtubeId` in `src/data/videos.json`.
- **Founders:** `src/data/team.json` and `public/team/`.
- **Contact details:** `src/lib/contact.ts`. **Navigation and sitemap routes:** `src/lib/site.ts`.

## Environment variables

All are read at build time and default to the production site.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://ajmerainteriors.com` | Origin for canonical URLs, Open Graph, JSON-LD, sitemap and robots. |
| `NEXT_PUBLIC_BASE_PATH` | empty | Serve the site under a sub-path (e.g. `/ajmera-interiors-demo`). Sets Next's `basePath`; local assets go through `withBase()` in `src/lib/site.ts`. |
| `NEXT_PUBLIC_NOINDEX` | unset | `1` adds `<meta name="robots" content="noindex">` and a disallow-all `robots.txt`. Use for demos. |

When adding a plain `<img>`, `<a>` or other root-absolute local URL, wrap it in `withBase()`.
`next/link` hrefs and metadata URLs (resolved against `metadataBase`) are prefixed automatically.

## Deploying

**GitHub Pages demo.** `.github/workflows/deploy.yml` builds on every push to `main` (or a manual run)
with `NEXT_PUBLIC_BASE_PATH=/<repo>`, `NEXT_PUBLIC_SITE_URL=https://<owner>.github.io` and
`NEXT_PUBLIC_NOINDEX=1`, then publishes `out/` to https://kpandya1903.github.io/ajmera-interiors-demo/.
Pages must be enabled with source "GitHub Actions". `public/.nojekyll` stops Jekyll from dropping `_next/`.

To reproduce the demo build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/ajmera-interiors-demo NEXT_PUBLIC_SITE_URL=https://kpandya1903.github.io NEXT_PUBLIC_NOINDEX=1 npm run build
```

**Custom domain later.** Leave `NEXT_PUBLIC_BASE_PATH` unset (the site is at the domain root), set
`NEXT_PUBLIC_SITE_URL` to the real domain (or rely on the default), drop `NEXT_PUBLIC_NOINDEX`, and
for GitHub Pages add `public/CNAME` containing the domain. Any other static host just serves `out/`.

## Known TODOs

- About page: real studio figures (projects, clients, years). A `Stats` block is ready in
  `src/components/About.tsx` but not rendered until the owner confirms numbers.
- Films: YouTube IDs for the HD walkthroughs (Drive posters are capped at 640x360).
- Contact: street address and opening hours, if the studio wants them published (also in JSON-LD).
- Remove the unused create-next-app SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).
