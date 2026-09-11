# The Cliffs

A single-page site for a luxury clifftop Airbnb on Australia's southern coastline.
Its one job is to move a visitor to the listing.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build && npm run preview
```

## Changing the content

Everything the site says lives in [`src/constants/index.js`](src/constants/index.js) —
copy, room names, drive times, rates, testimonials and every image path. Components
read from it and hold no content of their own.

- **The listing URL** is `AIRBNB_URL`. It is used by all four calls to action
  (nav, the sticky stay bar, the closing section, the footer) through
  `src/components/CtaLink.jsx`, so changing it in one place changes it everywhere.
- **Photography** is in `public/images/`. Replace a file with a real photograph of
  the same name and nothing else needs to change. The current set is Unsplash
  placeholder imagery, chosen for golden and blue hour — keep that light when
  swapping, since the palette is built around it.

## Design notes

- Palette and type tokens are declared in the `@theme` block of `src/index.css`.
  Newsreader (light) for display, Schibsted Grotesk for everything else.
- The page floats inset on a slate ground (`#frame`). The inset collapses below 768px.
- Motion is GSAP ScrollTrigger via `@gsap/react`. `src/lib/motion.js` holds the
  shared reveal and the `reduced()` guard; every component checks it and falls back
  to a static, fully readable page under `prefers-reduced-motion`.
- The large "The Cliffs" rising from behind the house in `TheHouse.jsx` is the one
  deliberate typographic moment. Its occlusion is expressed as a percentage of the
  word's own height, so it holds at any screen size.
