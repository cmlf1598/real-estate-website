import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced } from "../lib/motion";
import { GALLERY, GALLERY_FRAME } from "../constants";

// Pixels of scroll the collage plays across, then the distance the stage
// dissolves over once it has let go of the top of the viewport.
const TRAVEL = 2000;
const FADE_DISTANCE = 460;

// The frame at the centre grows from a held print to wider than the window.
const CENTRE_SCALE = 2.6;

// One pass each: `lead` is how far into the scroll the image enters from below,
// `span` how much of the scroll it spends crossing. Shorter span, faster pass.
// Left is the centre of the image, so values past the edges let it bleed off.
const PASSES = [
  { left: "24%", width: "clamp(11rem, 30vw, 25rem)", ratio: "aspect-4/3", lead: 0.06, span: 0.66 },
  { left: "82%", width: "clamp(9rem, 24vw, 20rem)", ratio: "aspect-3/4", lead: 0.19, span: 0.8 },
  { left: "46%", width: "clamp(8rem, 21vw, 17rem)", ratio: "aspect-square", lead: 0.31, span: 0.58 },
  { left: "90%", width: "clamp(10rem, 27vw, 22rem)", ratio: "aspect-16/10", lead: 0.43, span: 0.72 },
  { left: "13%", width: "clamp(12rem, 34vw, 28rem)", ratio: "aspect-4/5", lead: 0.54, span: 0.86 },
];

// The mosaic that stands in when motion is turned off — see below.
const STILL = [
  "md:col-span-7",
  "md:col-span-4 md:col-start-9 md:mt-24",
  "md:col-span-4",
  "md:col-span-7 md:col-start-6 md:mt-16",
  "md:col-span-6 md:col-start-2",
  "md:col-span-4 md:col-start-9 md:mt-28",
];

export default function Gallery() {
  // Read once: the whole section is a different shape without motion.
  const [still] = useState(() => reduced());

  const root = useRef(null);
  const track = useRef(null); // tall spacer that buys the collage its scroll
  const stage = useRef(null); // the sticky, viewport-height layer
  const centre = useRef(null);
  const passes = useRef([]);

  useGSAP(
    () => {
      if (still) return;

      // The centre frame grows for the whole length of the collage.
      gsap.fromTo(
        centre.current,
        { scale: 1 },
        {
          scale: CENTRE_SCALE,
          ease: "none",
          scrollTrigger: {
            trigger: track.current,
            start: "top top",
            end: `+=${TRAVEL}`,
            scrub: 0.8,
          },
        }
      );

      // Every other image crosses the stage on its own schedule, so they never
      // move as a block. Each starts parked just below the stage.
      passes.current.forEach((el, i) => {
        if (!el) return;
        const { lead, span } = PASSES[i % PASSES.length];
        gsap.set(el, { xPercent: -50, willChange: "transform" });
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: () => -(stage.current.offsetHeight + el.offsetHeight + 48),
            ease: "none",
            scrollTrigger: {
              trigger: track.current,
              start: `top top-=${Math.round(lead * TRAVEL)}`,
              end: `top top-=${Math.round((lead + span) * TRAVEL)}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Once the stage releases, it dissolves into the page as the next
      // section comes up underneath it.
      gsap.to(stage.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: track.current,
          start: `top top-=${TRAVEL}`,
          end: `+=${FADE_DISTANCE}`,
          scrub: 0.8,
        },
      });
    },
    { scope: root, dependencies: [still] }
  );

  // No scroll to spend on a collage, so the images are simply laid out.
  if (still) {
    return (
      <section id="gallery" ref={root} className="px-5 py-24 md:px-12 md:py-36">
        <div className="grid gap-6 md:grid-cols-12 md:gap-8">
          {[GALLERY_FRAME, ...GALLERY].map((g, i) => (
            <figure key={g.image} className={STILL[i % STILL.length]}>
              <img
                src={g.image}
                alt={g.alt}
                loading="lazy"
                decoding="async"
                width="1600"
                height="1600"
                className="w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" ref={root} className="relative">
      <div
        ref={track}
        className="relative"
        style={{ height: `calc(100vh + ${TRAVEL}px)` }}
      >
        <div
          ref={stage}
          className="sticky top-0 h-screen w-full overflow-hidden"
        >
          {/* The image everything else passes over. */}
          <div className="absolute inset-0 grid place-items-center">
            <div
              ref={centre}
              className="aspect-3/2 w-[clamp(15rem,42vw,38rem)] overflow-hidden"
              style={{ willChange: "transform" }}
            >
              <img
                src={GALLERY_FRAME.image}
                alt={GALLERY_FRAME.alt}
                decoding="async"
                width="2400"
                height="1600"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {GALLERY.map((g, i) => {
            const p = PASSES[i % PASSES.length];
            return (
              <figure
                key={g.image}
                ref={(el) => {
                  passes.current[i] = el;
                }}
                className={`absolute overflow-hidden ${p.ratio}`}
                style={{
                  left: p.left,
                  top: "100%",
                  width: p.width,
                  zIndex: 2 + i,
                }}
              >
                <img
                  src={g.image}
                  alt={g.alt}
                  loading="lazy"
                  decoding="async"
                  width="1600"
                  height="1600"
                  className="h-full w-full object-cover"
                />
              </figure>
            );
          })}

          {/* Images dim into the page rather than clipping hard at the edges. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[18vh] bg-gradient-to-b from-deep to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[12vh] bg-gradient-to-t from-deep to-transparent" />
        </div>
      </div>
    </section>
  );
}
