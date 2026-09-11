import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reduced } from "../lib/motion";
import { STAY_FACTS, PROPERTY, CTA_LABEL } from "../constants";
import CtaLink from "./CtaLink";

export default function StayBar() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const bar = ref.current;
      const still = reduced();

      gsap.set(bar, { yPercent: 130, opacity: 0 });

      // Reduced motion still gets the bar out of the way of the opening
      // photograph and the closing section — it just arrives without travelling.
      const show = () =>
        gsap.to(bar, {
          yPercent: 0,
          opacity: 1,
          duration: still ? 0 : 0.9,
          ease: "power3.out",
        });
      const hide = () =>
        gsap.to(bar, {
          yPercent: 130,
          opacity: 0,
          duration: still ? 0 : 0.6,
          ease: "power2.in",
        });

      const hero = document.getElementById("top");
      const booking = document.getElementById("booking");

      // Stay out of the way of the opening photograph.
      if (hero)
        ScrollTrigger.create({
          trigger: hero,
          start: "bottom 85%",
          onEnter: show,
          onLeaveBack: hide,
        });

      // The closing section makes its own case; the bar would only repeat it.
      if (booking)
        ScrollTrigger.create({
          trigger: booking,
          start: "top 80%",
          onEnter: hide,
          onLeaveBack: show,
        });
    },
    { scope: ref }
  );

  return (
    <aside
      ref={ref}
      aria-label="Booking summary"
      className="fixed z-40"
      style={{ bottom: "var(--inset)", left: "var(--inset)", right: "var(--inset)" }}
    >
      <div className="flex items-stretch border-t border-salt/15 bg-abyss/80 backdrop-blur-xl">
        {/* Full detail where there is room for it. */}
        <dl className="hidden flex-1 grid-cols-4 lg:grid">
          {STAY_FACTS.map((f) => (
            <div key={f.label} className="border-r border-salt/10 px-7 py-5">
              <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-salt/45">
                {f.label}
              </dt>
              <dd className="mt-1.5 text-[0.95rem] text-salt/90">{f.value}</dd>
            </div>
          ))}
        </dl>

        {/* Below that, the one number that matters. */}
        <div className="flex flex-1 items-center px-5 py-4 lg:hidden">
          <p className="text-[0.9rem] text-salt/90">
            From <span className="text-salt">{PROPERTY.rateFrom}</span>
            <span className="text-salt/50"> / {PROPERTY.rateUnit}</span>
          </p>
        </div>

        <CtaLink className="flex shrink-0 items-center bg-salt px-5 text-[0.82rem] font-medium text-abyss transition-colors hover:bg-lamp md:px-9 md:text-[0.9rem]">
          <span className="hidden sm:inline">{CTA_LABEL}</span>
          <span className="sm:hidden">Book</span>
        </CtaLink>
      </div>
    </aside>
  );
}
