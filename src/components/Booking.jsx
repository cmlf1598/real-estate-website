import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced, reveal } from "../lib/motion";
import { BOOKING, PROPERTY, CTA_LABEL } from "../constants";
import CtaLink from "./CtaLink";

export default function Booking() {
  const root = useRef(null);
  const image = useRef(null);
  const cta = useRef(null);

  useGSAP(
    () => {
      if (!reduced()) {
        reveal(gsap.utils.toArray(".will-reveal", root.current), {
          trigger: root.current,
          stagger: 0.12,
        });

        gsap.fromTo(
          image.current,
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1.2,
            },
          }
        );
      } else {
        gsap.set(".will-reveal", { opacity: 1, y: 0 });
      }

      // The only magnetic element on the page. It is also the only thing
      // we actually want anyone to press.
      const el = cta.current;
      if (!el || reduced() || !window.matchMedia("(pointer: fine)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

      const move = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      };
    },
    { scope: root }
  );

  return (
    <section id="booking" ref={root} className="relative overflow-hidden">
      <img
        ref={image}
        src={BOOKING.image}
        alt={BOOKING.alt}
        loading="lazy"
        decoding="async"
        width="2200"
        height="1467"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss/92 via-abyss/58 to-abyss/28" />

      <div className="relative flex min-h-[92svh] flex-col justify-end px-5 py-20 md:px-12 md:py-28">
        <h2 className="display-lg will-reveal max-w-[18ch] text-salt">
          {BOOKING.heading}
        </h2>
        <p className="prose-cliff will-reveal mt-7">{BOOKING.body}</p>

        <div className="will-reveal mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <CtaLink
            ref={cta}
            className="inline-block bg-salt px-10 py-5 text-[0.95rem] font-medium text-abyss transition-colors hover:bg-lamp"
          >
            {CTA_LABEL}
          </CtaLink>
          <p className="text-[0.84rem] text-salt/55">
            {PROPERTY.rateFrom} a night · {PROPERTY.minimumNights}-night minimum ·
            Sleeps {PROPERTY.guests}
          </p>
        </div>
      </div>
    </section>
  );
}
