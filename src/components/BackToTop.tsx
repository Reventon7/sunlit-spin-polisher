import { ArrowUp } from "lucide-react";

export function BackToTop({ footer = false }: { footer?: boolean }) {
  return (
    <button type="button" className={footer ? "footer-up" : "ph-up"}
      id={footer ? undefined : "ph-up"} aria-label="Back to top" hidden={!footer}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>
      <ArrowUp aria-hidden="true" />
    </button>
  );
}
