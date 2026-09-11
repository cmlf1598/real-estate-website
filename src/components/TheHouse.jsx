import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced, reveal } from "../lib/motion";
import { HOUSE, PROPERTY } from "../constants";

export default function TheHouse() {
  const root = useRef(null);
  const word = useRef(null);
  const image = useRef(null);

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set(".will-reveal", { opacity: 1, y: 0 });
        gsap.set(word.current, { yPercent: 40 });
        return;
      }

      reveal(gsap.utils.toArray(".will-reveal", root.current), {
        trigger: root.current,
      });

      // The one bold moment: the name rises from behind the house and is
      // cut off by it. Spent once, here, and nowhere else on the page.
      gsap.fromTo(
        word.current,
        { yPercent: 72 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".house-stage",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.1,
          },
        }
      );

      gsap.fromTo(
        image.current,
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".house-stage",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.1,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section id="house" ref={root} className="relative pt-8 md:pt-16">
      <div className="grid gap-12 px-5 md:grid-cols-12 md:px-12">
        <div className="md:col-span-5">
          <h2 className="display-lg will-reveal text-salt">{HOUSE.heading}</h2>
        </div>
        <div className="space-y-6 md:col-span-6 md:col-start-7">
          {HOUSE.body.map((p) => (
            <p key={p.slice(0, 24)} className="prose-cliff will-reveal">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Specs sit on a rule rather than in boxes. */}
      <dl className="mt-20 grid grid-cols-2 gap-px border-t border-salt/12 bg-salt/12 md:mt-28 md:grid-cols-3">
        {HOUSE.specs.map((s) => (
          <div key={s.label} className="will-reveal bg-deep px-5 py-7 md:px-8 md:py-9">
            <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-salt/45">
              {s.label}
            </dt>
            <dd className="mt-2 text-[0.98rem] text-salt/90">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="house-stage relative mt-12 h-[70svh] min-h-[24rem] overflow-hidden md:mt-16 md:h-[82svh]">
        <span
          ref={word}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[64%] z-0 text-center font-display leading-[0.78] font-extralight whitespace-nowrap text-salt/90"
          style={{ fontSize: "clamp(4rem, 17vw, 15rem)" }}
        >
          {PROPERTY.name}
        </span>

        <div className="absolute inset-x-0 bottom-0 z-10 h-[64%] overflow-hidden">
          <img
            ref={image}
            src={HOUSE.image}
            alt={HOUSE.alt}
            loading="lazy"
            decoding="async"
            width="2200"
            height="1467"
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 62%" }}
          />
        </div>
      </div>
    </section>
  );
}
