import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { LayoutGrid } from "@/components/ui/layout-grid";
import { gsap, reduced, reveal, EASE } from "../lib/motion";
import { SPACES } from "../constants";

// Five rooms across three columns: two mixed rows, then a wide one to close.
const SPANS = [
  "md:col-span-2",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-2",
  "md:col-span-3",
];

const RoomCard = ({ name, note }) => (
  <div>
    <h3 className="font-display text-[1.7rem] font-light text-salt md:text-[2.2rem]">
      {name}
    </h3>
    <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-salt/75">
      {note}
    </p>
  </div>
);

const cards = SPACES.map((s, i) => ({
  id: s.name,
  content: <RoomCard name={s.name} note={s.note} />,
  className: SPANS[i % SPANS.length],
  thumbnail: s.image,
  alt: s.alt,
  title: s.name,
}));

export default function Spaces() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set(".will-reveal, .fade-reveal", { opacity: 1, y: 0 });
        return;
      }

      reveal(gsap.utils.toArray(".will-reveal", root.current), {
        trigger: root.current,
      });

      // The grid fades without moving — see .fade-reveal in index.css.
      gsap.to(".fade-reveal", {
        opacity: 1,
        duration: 1.4,
        ease: EASE,
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section id="spaces" ref={root} className="relative px-5 py-20 md:px-12 md:py-28">
      <div className="flex items-baseline justify-between pb-8 md:pb-12">
        <h2 className="display-md will-reveal text-salt">The rooms</h2>
        <span className="will-reveal text-[0.72rem] tracking-[0.2em] text-salt/40 uppercase">
          {SPACES.length} spaces
        </span>
      </div>

      <div className="fade-reveal">
        <LayoutGrid cards={cards} />
      </div>

      <p className="mt-6 text-[0.8rem] text-salt/40">
        Open a room to read about it.
      </p>
    </section>
  );
}
