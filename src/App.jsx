import { useEffect } from "react";
import { ScrollTrigger, reduced } from "./lib/motion";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import StayBar from "./components/StayBar";
import Arrival from "./components/Arrival";
import TheHouse from "./components/TheHouse";
import Spaces from "./components/Spaces";
import TheCoast from "./components/TheCoast";
import Gallery from "./components/Gallery";
import Guests from "./components/Guests";
import Booking from "./components/Booking";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    // Only hide content ahead of a reveal when we are actually going to animate it.
    if (!reduced()) document.documentElement.classList.add("js-motion");

    // Web fonts change every measurement on the page.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    return () => document.documentElement.classList.remove("js-motion");
  }, []);

  return (
    <>
      <a
        href="#booking"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-salt focus:px-4 focus:py-2 focus:text-abyss"
      >
        Skip to booking
      </a>

      <div id="frame">
        <main>
          <Hero />
          <Arrival />
          <TheHouse />
          <Spaces />
          <TheCoast />
          <Gallery />
          <Guests />
          <Booking />
        </main>
        <Footer />
      </div>

      <Nav />
      <StayBar />
    </>
  );
}
