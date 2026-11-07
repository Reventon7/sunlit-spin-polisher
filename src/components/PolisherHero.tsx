import { useEffect, useRef } from "react";
import { mountPolisherHero } from "@/lib/polisher-hero-scene";
import logo from "@/assets/oto-logo.png.asset.json";
import { SiteFooter } from "@/components/SiteFooter";

export function PolisherHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return mountPolisherHero(ref.current);
  }, []);

  return (
    <div ref={ref} className="ph-root">
      <div className="ph-pin">
        <div className="ph-track" id="ph-track" aria-hidden="true" />
        <div className="ph-view">
          <canvas
            id="ph-gl"
            aria-label="A 3D spiral dental polisher with a slowly spinning head in a warm peach sky, with giant words wrapping around it"
          />
          <div className="ph-ui">
            <a className="ph-logo" href="#" aria-label="OTO">
              <img src={logo.url} alt="OTO" />
            </a>
            <nav className="ph-links" aria-label="Main">
              <a href="#ph-foot">[Products]</a>
              <a href="#ph-foot">[Contact]</a>
            </nav>
            <div className="ph-index" id="ph-index" aria-hidden="true">
              <i />
              <b className="on">01</b>
              <i />
              <i />
              <i />
              <b>02</b>
              <i />
              <i />
              <i />
              <b>03</b>
              <i />
              <i />
              <i />
              <b>04</b>
              <i />
              <i />
              <i />
              <b>05</b>
              <i />
            </div>
            <div className="ph-bar" aria-hidden="true">
              <i id="ph-thumb" />
            </div>
            <div className="ph-cap">
              <svg id="ph-goggle" viewBox="0 0 30 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M7 2h16a6 6 0 0 1 6 6v5a5 5 0 0 1-9 3l-2-3h-6l-2 3a5 5 0 0 1-9-3V8a6 6 0 0 1 6-6Zm1 5a3.500 3.500 0 1 0 0 7 3.500 3.500 0 0 0 0-7Zm14 0a3.500 3.500 0 1 0 0 7 3.500 3.500 0 0 0 0-7Z"
                />
              </svg>
              <p id="ph-c1">
                Meet the TCP543204M spiral polisher <br />
                Ø 12.7 x 0.6 mm · medium grit · 204-RA shank
              </p>
              <p id="ph-c2" style={{ opacity: 0 }}>
                Flexible spiral blades that follow every contour <br />
                for a smooth, even finish
              </p>
            </div>
            <p className="ph-panel ph-p1" id="ph-p1">
              Medium grit spiral blades, Ø 12.7 x 0.6 mm, mounted on a 204-RA shank for your
              contra-angle
            </p>
            <p className="ph-panel ph-p2" id="ph-p2">
              Best at 6,000 rpm, up to 15,000 rpm maximum. Available in packs of 10 and 100.
            </p>
            <button className="ph-sound" id="ph-sound" aria-pressed="false" aria-label="Ambient sound">
              <span aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <em id="ph-st">OFF</em>
            </button>
            <button className="ph-up" id="ph-up" aria-label="Back to top">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 14V2M3 7l5-5 5 5" />
              </svg>
            </button>
          </div>
          <div className="ph-veil" aria-hidden="true" />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
