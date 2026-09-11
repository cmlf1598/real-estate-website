import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Slow and even. Nothing here should feel eager.
export const EASE = "power2.out";
export const EASE_IN_OUT = "power2.inOut";

/** Standard section reveal: content rises a little and settles. */
export function reveal(targets, { trigger, stagger = 0.12, y = 26, delay = 0 } = {}) {
  return gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: 1.4,
    ease: EASE,
    stagger,
    delay,
    scrollTrigger: trigger
      ? { trigger, start: "top 78%", once: true }
      : undefined,
    onStart() {
      gsap.set(targets, { willChange: "transform, opacity" });
    },
    onComplete() {
      gsap.set(targets, { willChange: "auto", clearProps: "willChange" });
    },
    startAt: { y },
  });
}

export { gsap, ScrollTrigger };
