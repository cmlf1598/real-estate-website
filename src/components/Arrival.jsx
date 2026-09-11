import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced, reveal } from "../lib/motion";
import { ARRIVAL } from "../constants";

export default function Arrival() {
  const root = useRef(null);
  const image = useRef(null);

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set(".will-reveal", { opacity: 1, y: 0 });
        return;
      }
      reveal(gsap.utils.toArray(".will-reveal", root.current), {
        trigger: root.current,
      });

      gsap.fromTo(
        image.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: image.current.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative px-5 py-24 md:px-12 md:py-40">
      {/* The horizon. It runs behind everything on this page. */}
      <div className="hairline absolute top-1/2 right-0 left-0 h-px" aria-hidden="true" />

      <div className="relative grid gap-14 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5 md:pt-16">
          <h2 className="display-lg will-reveal text-salt">{ARRIVAL.heading}</h2>
          <div className="mt-8 space-y-6">
            {ARRIVAL.body.map((p) => (
              <p key={p.slice(0, 24)} className="prose-cliff will-reveal">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="will-reveal relative aspect-4/5 overflow-hidden md:aspect-3/4">
            <img
              ref={image}
              src={ARRIVAL.image}
              alt={ARRIVAL.alt}
              loading="lazy"
              decoding="async"
              width="2200"
              height="2933"
              className="absolute inset-0 h-[116%] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
