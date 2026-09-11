import React, { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Card = {
  id: number | string;
  content: ReactNode;
  /** Grid placement, e.g. "md:col-span-2". */
  className?: string;
  thumbnail: string;
  /** Describes the photograph. Falls back to a generic label. */
  alt?: string;
  /** Short name. Shown on hover and used to build the accessible label. */
  title?: string;
};

export const LayoutGrid = ({
  cards,
  className,
}: {
  cards: Card[];
  className?: string;
}) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);
  const still = useReducedMotion();

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    // Pressing the open card closes it, which is what its label promises.
    setSelected((current) => (current?.id === card.id ? null : card));
  };

  const handleOutsideClick = useCallback(() => {
    setLastSelected(selected);
    setSelected(null);
  }, [selected]);

  // An expanded card is a dialog in all but name: Escape has to close it.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleOutsideClick();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, handleOutsideClick]);

  return (
    <div
      className={cn(
        "relative mx-auto grid w-full auto-rows-[15rem] grid-cols-1 gap-4 md:auto-rows-[21rem] md:grid-cols-3",
        className
      )}
    >
      {cards.map((card) => {
        const isSelected = selected?.id === card.id;
        return (
          // Deliberately not positioned: the expanded card is absolute against
          // the grid itself, so it can centre over the whole thing.
          <div key={card.id} className={card.className}>
            <motion.button
              type="button"
              aria-expanded={isSelected}
              aria-label={
                isSelected
                  ? `Close ${card.title ?? "card"}`
                  : `${card.title ?? "Card"} — read more`
              }
              onClick={() => handleClick(card)}
              layoutId={still ? undefined : `card-${card.id}`}
              className={cn(
                "card-trigger relative block cursor-pointer overflow-hidden text-left",
                isSelected
                  ? // Fixed, not absolute: the grid is taller than the viewport,
                    // so centring within it can put the card off screen.
                    "fixed inset-0 z-50 m-auto flex h-[62vh] w-[92vw] flex-col items-center justify-center md:w-[58vw]"
                  : lastSelected?.id === card.id
                    ? "z-40 h-full w-full"
                    : "h-full w-full"
              )}
            >
              {isSelected && <SelectedCard selected={selected} />}
              <ImageComponent card={card} still={!!still} />
              {!isSelected && card.title && <HoverVeil title={card.title} />}
            </motion.button>
          </div>
        );
      })}

      <motion.div
        onClick={handleOutsideClick}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-abyss opacity-0",
          selected ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected ? 0.55 : 0 }}
        transition={{ duration: still ? 0 : 0.3 }}
      />
    </div>
  );
};

const ImageComponent = ({ card, still }: { card: Card; still: boolean }) => (
  <motion.img
    layoutId={still ? undefined : `image-${card.id}-image`}
    src={card.thumbnail}
    loading="lazy"
    decoding="async"
    className="card-image absolute inset-0 h-full w-full object-cover object-center"
    alt={card.alt ?? ""}
  />
);

/** Says the card can be opened, and names what is behind it. */
const HoverVeil = ({ title }: { title: string }) => (
  <span
    aria-hidden="true"
    className="card-veil pointer-events-none absolute inset-0 z-20 flex items-end bg-gradient-to-t from-abyss/85 via-abyss/25 to-transparent"
  >
    <span className="card-veil-label flex w-full items-center justify-between gap-4 px-5 pb-4 md:px-6 md:pb-5">
      <span className="font-display text-[1.15rem] font-light text-salt md:text-[1.35rem]">
        {title}
      </span>
      <span className="text-[0.62rem] tracking-[0.2em] text-salt/60 uppercase">
        Open
      </span>
    </span>
  </span>
);

const SelectedCard = ({ selected }: { selected: Card | null }) => (
  <div className="relative z-[60] flex h-full w-full flex-col justify-end shadow-2xl">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.65 }}
      className="absolute inset-0 z-10 h-full w-full bg-abyss"
    />
    <AnimatePresence>
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-[70] px-6 pb-6 md:px-8 md:pb-8"
      >
        {selected?.content}
      </motion.div>
    </AnimatePresence>
  </div>
);
