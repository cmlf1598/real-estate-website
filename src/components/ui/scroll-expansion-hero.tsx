import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  bgAlt?: string;
  mediaAlt?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  /** Type scale for the title. Defaults to the display-xl utility. */
  titleClassName?: string;
  /** Renders the title as the page h1. Off by default so the component stays reusable. */
  titleAsH1?: boolean;
  /** Fires once the media has finished expanding. Use it to refresh scroll-driven layout. */
  onExpanded?: () => void;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  bgAlt = "",
  mediaAlt,
  title,
  date,
  scrollToExpand,
  textBlend,
  titleClassName = "display-xl",
  titleAsH1 = false,
  onExpanded,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  // Held in refs so the wheel and touch listeners are registered once, rather
  // than torn down and rebuilt on every frame of the gesture.
  const progressRef = useRef<number>(0);
  const expandedRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number>(0);
  const onExpandedRef = useRef<(() => void) | undefined>(onExpanded);
  onExpandedRef.current = onExpanded;

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
    progressRef.current = 0;
    expandedRef.current = false;
  }, [mediaType]);

  useEffect(() => {
    // Taking over the scroll wheel is a strong move. Anyone who has asked for
    // less motion gets the expanded state immediately and an ordinary page.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      progressRef.current = 1;
      expandedRef.current = true;
      setScrollProgress(1);
      setMediaFullyExpanded(true);
      setShowContent(true);
      onExpandedRef.current?.();
      return;
    }

    const apply = (next: number) => {
      const clamped = Math.min(Math.max(next, 0), 1);
      progressRef.current = clamped;
      setScrollProgress(clamped);

      if (clamped >= 1) {
        expandedRef.current = true;
        setMediaFullyExpanded(true);
        setShowContent(true);
        onExpandedRef.current?.();
      } else if (clamped < 0.75) {
        setShowContent(false);
      }
    };

    const collapse = () => {
      expandedRef.current = false;
      setMediaFullyExpanded(false);
    };

    const handleWheel = (e: WheelEvent) => {
      if (expandedRef.current && e.deltaY < 0 && window.scrollY <= 5) {
        collapse();
        e.preventDefault();
      } else if (!expandedRef.current) {
        e.preventDefault();
        apply(progressRef.current + e.deltaY * 0.0009);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartYRef.current) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;

      if (expandedRef.current && deltaY < -20 && window.scrollY <= 5) {
        collapse();
        e.preventDefault();
      } else if (!expandedRef.current) {
        e.preventDefault();
        // A little more sensitive on the way back up than on the way down.
        apply(progressRef.current + deltaY * (deltaY < 0 ? 0.008 : 0.005));
        touchStartYRef.current = touchY;
      }
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = 0;
    };

    // Without this, pinning the page at scroll 0 traps anyone navigating by
    // keyboard: the section could never be passed.
    const ADVANCE = ["ArrowDown", "PageDown", "End", " ", "Spacebar"];
    const RETREAT = ["ArrowUp", "PageUp", "Home"];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedRef.current) return;
      if (ADVANCE.includes(e.key)) {
        e.preventDefault();
        apply(progressRef.current + (e.key === "End" ? 1 : 0.22));
      } else if (RETREAT.includes(e.key)) {
        e.preventDefault();
        apply(progressRef.current - (e.key === "Home" ? 1 : 0.22));
      }
    };

    // Tabbing to anything past the hero should release it, not yank the page
    // back to the top.
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        !expandedRef.current &&
        target &&
        sectionRef.current &&
        !sectionRef.current.contains(target)
      ) {
        apply(1);
      }
    };

    const handleScroll = () => {
      if (!expandedRef.current) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  const Heading = titleAsH1 ? "h1" : "h2";
  const stageHeight = "100svh";

  return (
    <div
      ref={sectionRef}
      className="overflow-x-hidden transition-colors duration-700 ease-in-out"
    >
      <section
        className="relative flex flex-col items-center justify-start"
        style={{ minHeight: stageHeight }}
      >
        <div
          className="relative flex w-full flex-col items-center"
          style={{ minHeight: stageHeight }}
        >
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt={bgAlt}
              width={1920}
              height={1080}
              fetchPriority="high"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-abyss/45" />
          </motion.div>

          <div className="relative z-10 mx-auto flex w-full flex-col items-center justify-start">
            <div
              className="relative flex w-full flex-col items-center justify-center"
              style={{ height: stageHeight }}
            >
              <div
                className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
                }}
              >
                {mediaType === "video" ? (
                  <div className="pointer-events-none relative h-full w-full">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="h-full w-full object-cover"
                      controls={false}
                      disablePictureInPicture
                    />
                    <motion.div
                      className="absolute inset-0 bg-abyss/40"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="relative h-full w-full">
                    <img
                      src={mediaSrc}
                      alt={mediaAlt || title || ""}
                      className="h-full w-full object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-abyss/60"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.35 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                <div className="relative z-10 mt-5 flex flex-col items-center gap-2 text-center transition-none">
                  {date && (
                    <p
                      className="text-[0.82rem] tracking-wide text-salt/70"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="wordmark text-[0.6rem] text-salt/55"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* One heading element holding two halves, so the accessible name
                  stays "The Cliffs" while the words travel apart on screen. */}
              <Heading
                className={`${titleClassName} relative z-10 flex w-full flex-col items-center justify-center gap-1 text-center text-salt transition-none ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                <span
                  className="block transition-none"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </span>
                <span
                  className="block transition-none"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </span>
              </Heading>
            </div>

            <motion.div
              className="flex w-full flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              // Faded-out content is still tabbable without this.
              inert={!showContent}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
