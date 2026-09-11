import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/motion";
import { SPACES } from "../constants";

export default function Spaces() {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Pinned horizontal travel on pointer-sized screens only. Narrow screens
      // get an ordinary swipe, which is what a thumb expects anyway.
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const distance = () =>
            track.current.scrollWidth - track.current.parentElement.clientWidth;

          gsap.to(track.current, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="spaces" ref={root} className="relative py-20 md:py-0">
      <div className="flex items-baseline justify-between px-5 pb-8 md:px-12 md:pt-24 md:pb-10">
        <h2 className="display-md text-salt">The rooms</h2>
        <span className="text-[0.72rem] tracking-[0.2em] text-salt/40 uppercase">
          {SPACES.length} spaces
        </span>
      </div>

      <div className="snap-x snap-mandatory overflow-x-auto px-5 pb-6 md:overflow-hidden md:px-12 md:pb-24 [&::-webkit-scrollbar]:hidden">
        <div ref={track} className="flex gap-5 md:gap-8">
          {SPACES.map((s) => (
            <article
              key={s.name}
              className="w-[80vw] shrink-0 snap-start sm:w-[62vw] md:w-[46vw] lg:w-[38vw]"
            >
              <div className="aspect-4/5 overflow-hidden md:aspect-auto md:h-[54svh]">
                <img
                  src={s.image}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  width="1400"
                  height="1867"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 font-display text-[1.6rem] font-light text-salt md:text-[1.9rem]">
                {s.name}
              </h3>
              <p className="mt-3 max-w-[30rem] text-[0.92rem] leading-relaxed text-salt/72">
                {s.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
