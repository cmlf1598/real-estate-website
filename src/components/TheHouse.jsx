import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduced, reveal } from "../lib/motion";
import { HOUSE } from "../constants";

export default function TheHouse() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set(".will-reveal", { opacity: 1, y: 0 });
        return;
      }

      reveal(gsap.utils.toArray(".will-reveal", root.current), {
        trigger: root.current,
      });
    },
    { scope: root }
  );

  return (
    <section id="house" ref={root} className="relative pt-8 pb-16 md:pt-16 md:pb-24">
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
    </section>
  );
}
