import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced, reveal } from "../lib/motion";
import { GUESTS } from "../constants";

export default function Guests() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set(".will-reveal", { opacity: 1, y: 0 });
        return;
      }
      reveal(gsap.utils.toArray(".will-reveal", root.current), {
        trigger: root.current,
        stagger: 0.16,
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="px-5 pb-24 md:px-12 md:pb-36">
      <div className="grid gap-12 border-t border-salt/12 pt-14 md:grid-cols-12 md:gap-10 md:pt-20">
        {GUESTS.map((g) => (
          <figure key={g.name} className="will-reveal md:col-span-5 md:even:col-start-8">
            <blockquote className="font-display text-[1.3rem] leading-[1.55] font-light text-salt/90 md:text-[1.5rem]">
              {g.quote}
            </blockquote>
            <figcaption className="mt-6 text-[0.8rem] text-salt/45">
              {g.name} — {g.origin}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
