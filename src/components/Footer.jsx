import { PROPERTY } from "../constants";
import CtaLink from "./CtaLink";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-6 border-t border-salt/12 px-5 py-10 text-[0.8rem] text-salt/45 md:flex-row md:items-center md:justify-between md:px-12">
      <span className="wordmark text-salt/70">{PROPERTY.name}</span>
      <p>
        {PROPERTY.location} · {PROPERTY.region}
      </p>
      <CtaLink className="text-salt/70 transition-colors hover:text-lamp">
        View the listing
      </CtaLink>
    </footer>
  );
}
