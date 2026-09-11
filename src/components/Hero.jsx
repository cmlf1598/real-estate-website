import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced, EASE } from "../lib/motion";
import { HERO } from "../constants";

export default function Hero() {
  const root = useRef(null);
  const image = useRef(null);

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set(".will-reveal", { opacity: 1, y: 0 });
        return;
      }

      // One orchestrated arrival, then the page is still.
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(image.current, { scale: 1.12, duration: 2.6, ease: "power1.out" })
        .to(".hero-line", { opacity: 1, y: 0, duration: 1.5, stagger: 0.14 }, 0.5)
        .to(".hero-meta", { opacity: 1, duration: 1.2 }, 1.3)
        .to(".hero-cue", { opacity: 1, duration: 1.2 }, 1.5);

      // The photograph keeps moving a little after you start to leave it.
      gsap.to(image.current, {
        scale: 1.14,
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative overflow-hidden"
      style={{ height: "calc(100svh - 2 * var(--inset))", minHeight: "34rem" }}
    >
      <img
        ref={image}
        src={HERO.image}
        alt={HERO.alt}
        width="2200"
        height="1467"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Enough shadow at the foot to hold type, and no more. */}
      <div className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-abyss/10 to-abyss/35" />

      <div className="relative flex h-full flex-col justify-end px-5 pb-24 md:px-12 md:pb-28">
        <h1 className="display-xl text-salt">
          {HERO.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span className="hero-line will-reveal block translate-y-[0.2em]">
                {i > 0 ? " " : ""}
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-meta will-reveal mt-7 text-[0.82rem] tracking-wide text-salt/65">
          {HERO.meta}
        </p>
      </div>

      <div className="hero-cue will-reveal absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="wordmark text-[0.6rem] text-salt/55">Scroll</span>
        <span className="hairline h-10 w-px" />
      </div>
    </section>
  );
}
