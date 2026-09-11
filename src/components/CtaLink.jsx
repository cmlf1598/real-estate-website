import { AIRBNB_URL, CTA_LABEL } from "../constants";

/** Every route to the listing is this component, so the label and URL never drift. */
export default function CtaLink({ className = "", children, ref, ...rest }) {
  return (
    <a
      ref={ref}
      href={AIRBNB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {children ?? CTA_LABEL}
    </a>
  );
}
