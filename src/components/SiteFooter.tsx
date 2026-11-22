import { Instagram } from "lucide-react";
import { Logo } from "./Logo";
import { BackToTop } from "./BackToTop";
import { RequestDialog } from "./RequestDialog";

const SPECS = [
  ["Diameter", "Ø 12.7 mm"],
  ["Thickness", "0.6 mm"],
  ["Grit", "Medium"],
  ["Shank", "204-RA"],
  ["Speed", "6,000 rpm · max 15,000"],
  ["Packs", "10 / 100"],
] as const;

/** Small spinning spiral mark that echoes the polisher head. */
function SpiralMark() {
  const petals = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg className="ph-foot-mark" viewBox="-50 -50 100 100" aria-hidden="true">
      <g>
        <circle r="27" />
        {petals.map((a) => (
          <path
            key={a}
            transform={`rotate(${a})`}
            d="M24 -3.4C33 -3.6 41 0 46.5 7.2a3.4 3.4 0 0 1-5.4 4C36.5 6.2 31 3.6 24 3.4Z"
          />
        ))}
      </g>
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="ph-foot" id="ph-foot">
      <div className="ph-foot-in">
        <div className="ph-foot-head">
          <p className="ph-foot-tag">[06] — Order</p>
          <SpiralMark />
        </div>

        <h2 className="ph-foot-title">
          A brilliant finish, <br />
          <span>one spiral</span> at a time.
        </h2>

        <div className="ph-foot-row">
          <dl className="ph-foot-specs">
            {SPECS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="ph-foot-cta">
            <p>Request a spiral polisher for contra-angle handpieces.</p>
            <RequestDialog />
          </div>
        </div>

        <Logo className="ph-foot-logo" />

        <div className="ph-foot-bar">
          <span>© 2026 OTO</span>
          <span>Spiral polishers</span>
          <div className="footer-actions">
            <span className="instagram-placeholder" role="img" aria-label="Instagram — coming soon" title="Instagram — coming soon"><Instagram aria-hidden="true" /></span>
            <BackToTop footer />
          </div>
        </div>
      </div>
    </footer>
  );
}
