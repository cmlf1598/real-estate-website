import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced, reveal } from "../lib/motion";
import { COAST } from "../constants";

export default function TheCoast() {
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
        stagger: 0.07,
      });

      gsap.fromTo(
        image.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
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
    <section id="coast" ref={root} className="relative overflow-hidden">
      <img
        ref={image}
        src={COAST.image}
        alt={COAST.alt}
        loading="lazy"
        decoding="async"
        width="2200"
        height="1467"
        className="absolute inset-0 h-[112%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-abyss/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-transparent to-abyss/60" />

      <div className="relative px-5 py-24 md:px-12 md:py-36">
        <h2 className="display-lg will-reveal max-w-[16ch] text-salt">
          {COAST.heading}
        </h2>

        <ul className="mt-14 md:mt-20 md:ml-auto md:w-[62%]">
          {COAST.places.map((p) => (
            <li
              key={p.name}
              className="will-reveal flex items-baseline justify-between gap-6 border-t border-salt/20 py-5 last:border-b"
            >
              <div className="min-w-0">
                <h3 className="font-display text-[1.25rem] font-light text-salt md:text-[1.45rem]">
                  {p.name}
                </h3>
                <p className="mt-1 text-[0.86rem] text-salt/70">{p.detail}</p>
              </div>
              <span className="shrink-0 font-sans text-[0.86rem] tabular-nums text-lamp">
                {p.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
