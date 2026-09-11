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

## Project structure

This is **Vite + React 19 + Tailwind v4**, not Next.js. TypeScript is configured
(`tsconfig.json`) and `@/*` resolves to `src/*` in both Vite and tsc, so components
authored for a shadcn layout drop in unchanged.

Reusable, presentational components live in `src/components/ui/` — the shadcn
convention. Keeping that folder separate matters because `shadcn` CLI writes there
by default, so anything you add later lands beside the existing pieces instead of
mixing with the page sections in `src/components/`.

To adopt shadcn properly later: `npx shadcn@latest init`. It will ask for a global
CSS file and a Tailwind config — point it at `src/index.css` and review the diff
before accepting, since this project uses Tailwind v4 `@theme` tokens rather than a
`tailwind.config.js`.

### The hero

`src/components/ui/scroll-expansion-hero.tsx` holds the media that expands as you
scroll. It came from a Next.js source and was ported: `next/image` became plain
`<img>` (installing Next into a Vite app would break the build, not fix it), and the
hardcoded blue palette became this project's tokens.

Three things were added because the component takes over the scroll wheel:

- **Reduced motion** renders it expanded immediately and never hijacks scroll.
- **Keyboard** — arrows, Page Down, Space and End advance the expansion, and focus
  landing past the hero releases it. Without this the page pins at scroll 0 and a
  keyboard user can never get past it.
- **`onExpanded`** fires when expansion finishes, so `Hero.jsx` can call
  `ScrollTrigger.refresh()` — the intro copy appearing moves every trigger below it.

### The rooms grid

`src/components/ui/layout-grid.tsx` is the Aceternity LayoutGrid, ported the same way
(no `next/image`, project tokens instead of the white/neutral palette, sharp corners).
The five rooms span a three-column grid as 2+1 / 1+2 / 3, so none is dropped.

Two deviations worth knowing:

- The expanded card is `position: fixed`, not absolute. The grid is taller than the
  viewport, so centring inside it put the card off screen on small viewports.
- Because of that, **no ancestor of the grid may carry a transform** — a transformed
  ancestor becomes the containing block for fixed children and breaks the centring.
  That is why the grid uses the opacity-only `.fade-reveal` hook rather than the
  usual `.will-reveal`, which animates `y`.

Cards are real `<button>`s with `aria-expanded`; Escape closes an open card, and so
does pressing it again.

The hover affordance lives in `index.css` (`.card-trigger` / `.card-image` /
`.card-veil`): the photograph scales very slightly, a gradient rises, and the room
name and an "Open" label fade in. It is keyed on `@media (hover: hover)`, so touch
devices — which have no hover to give — show the names permanently instead. Focus
gets the same treatment as hover, and `prefers-reduced-motion` keeps the labels but
drops the scale.

## Design notes

- Palette and type tokens are declared in the `@theme` block of `src/index.css`.
  Newsreader (light) for display, Schibsted Grotesk for everything else.
- The page runs edge to edge; `#frame` is a plain full-bleed wrapper.
- Motion is GSAP ScrollTrigger via `@gsap/react`. `src/lib/motion.js` holds the
  shared reveal and the `reduced()` guard; every component checks it and falls back
  to a static, fully readable page under `prefers-reduced-motion`.
- The large "The Cliffs" rising from behind the house in `TheHouse.jsx` is the one
  deliberate typographic moment. Its occlusion is expressed as a percentage of the
  word's own height, so it holds at any screen size.
