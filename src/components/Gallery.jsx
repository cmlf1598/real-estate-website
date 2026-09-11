import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced, reveal } from "../lib/motion";
import { GALLERY } from "../constants";

// Deliberately uneven: a mosaic that drifts, rather than a grid of equal tiles.
const PLACEMENT = [
  { span: "md:col-span-7", ratio: "aspect-4/3", drift: 5 },
  { span: "md:col-span-4 md:col-start-9 md:mt-24", ratio: "aspect-3/4", drift: -7 },
  { span: "md:col-span-4", ratio: "aspect-3/4", drift: -4 },
  { span: "md:col-span-7 md:col-start-6 md:mt-16", ratio: "aspect-16/10", drift: 6 },
  { span: "md:col-span-6 md:col-start-2", ratio: "aspect-4/5", drift: -5 },
  { span: "md:col-span-4 md:col-start-9 md:mt-28", ratio: "aspect-square", drift: 4 },
];

export default function Gallery() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set(".will-reveal", { opacity: 1, y: 0 });
        return;
      }

      reveal(gsap.utils.toArray(".will-reveal", root.current), {
        trigger: root.current,
        stagger: 0.1,
      });

      // Each frame drifts at its own rate, so the mosaic never locks into a grid.
      gsap.utils.toArray(".gallery-img", root.current).forEach((img) => {
        const drift = Number(img.dataset.drift);
        gsap.fromTo(
          img,
          { yPercent: -drift },
          {
            yPercent: drift,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="px-5 py-24 md:px-12 md:py-36">
      <div className="grid gap-6 md:grid-cols-12 md:gap-8">
        {GALLERY.map((g, i) => {
          const p = PLACEMENT[i % PLACEMENT.length];
          return (
            <figure key={g.image} className={`will-reveal ${p.span}`}>
              <div className={`${p.ratio} overflow-hidden`}>
                <img
                  className="gallery-img h-[118%] w-full object-cover"
                  data-drift={p.drift}
                  src={g.image}
                  alt={g.alt}
                  loading="lazy"
                  decoding="async"
                  width="1600"
                  height="1600"
                />
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
