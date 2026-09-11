import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { PROPERTY } from "../constants";
import CtaLink from "./CtaLink";

const LINKS = [
  { label: "The house", href: "#house" },
  { label: "The rooms", href: "#spaces" },
  { label: "The coast", href: "#coast" },
];

export default function Nav() {
  const ref = useRef(null);

  useGSAP(
    () => {
      // A backdrop only once the photograph is no longer behind the nav.
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        onToggle: (self) =>
          gsap.to(ref.current, {
            backgroundColor: self.isActive
              ? "rgba(14,31,39,0.82)"
              : "rgba(14,31,39,0)",
            backdropFilter: self.isActive ? "blur(10px)" : "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
          }),
      });
    },
    { scope: ref }
  );

  return (
    <header
      ref={ref}
      className="fixed z-50 flex items-center justify-between px-5 py-4 md:px-8"
      style={{ top: "var(--inset)", left: "var(--inset)", right: "var(--inset)" }}
    >
      <nav className="hidden flex-1 gap-7 text-[0.82rem] text-salt/70 md:flex">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="transition-colors hover:text-salt">
            {l.label}
          </a>
        ))}
      </nav>

      <a href="#top" className="wordmark flex-1 text-center text-salt md:flex-none">
        {PROPERTY.name}
      </a>

      <div className="flex flex-1 justify-end">
        <CtaLink className="text-[0.82rem] text-salt/70 transition-colors hover:text-lamp">
          Book
        </CtaLink>
      </div>
    </header>
  );
}
