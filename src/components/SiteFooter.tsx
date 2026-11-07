import logoLight from "@/assets/oto-logo-light.png.asset.json";

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
  const toTop = () => {
    const calm = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  };

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
            <p>TCP543204M spiral polisher for contra-angle handpieces.</p>
            <a className="ph-btn" href="mailto:?subject=TCP543204M%20quote">
              Request a quote
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>

        <img className="ph-foot-logo" src={logoLight.url} alt="OTO" />

        <div className="ph-foot-bar">
          <span>© 2026 OTO</span>
          <span>Spiral polishers</span>
          <button type="button" onClick={toTop}>
            [Back to top ↑]
          </button>
        </div>
      </div>
    </footer>
  );
}
