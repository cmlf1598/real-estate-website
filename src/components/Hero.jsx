import { useCallback } from "react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { ScrollTrigger } from "../lib/motion";
import { HERO } from "../constants";

export default function Hero() {
  // Expanding adds the intro copy, which changes every downstream trigger
  // position — the pinned rooms section especially.
  const handleExpanded = useCallback(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div id="top">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={HERO.media}
        mediaAlt={HERO.mediaAlt}
        bgImageSrc={HERO.background}
        bgAlt={HERO.backgroundAlt}
        title={HERO.title}
        date={HERO.meta}
        scrollToExpand={HERO.scrollCue}
        titleAsH1
        titleClassName="display-hero"
        onExpanded={handleExpanded}
      >
        <div className="px-5 pt-4 pb-16 md:px-12 md:pt-10 md:pb-24">
          <div className="grid gap-10 md:grid-cols-12">
            <h2 className="display-lg md:col-span-7 text-salt">
              {HERO.headline}
            </h2>
            <div className="space-y-6 md:col-span-5 md:pt-3">
              {HERO.intro.map((p) => (
                <p key={p.slice(0, 24)} className="prose-cliff">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
