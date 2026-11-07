import { useEffect, useRef } from "react";
import { mountPolisherHero } from "@/lib/polisher-hero-scene";

export function PolisherHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return mountPolisherHero(ref.current);
  }, []);

  return (
    <div ref={ref}>
      <div className="ph-track" id="ph-track">
        <div className="ph-view">
          <canvas
            id="ph-gl"
            aria-label="A spiral dental polisher spinning slowly in a lilac sky with giant words wrapping around it"
          />
          <div className="ph-ui">
            <a className="ph-logo" href="#" aria-label="Sun Dental">
              Sun Dental
              <svg viewBox="0 0 50 30" aria-hidden="true">
                <path d="M2 22C8 20 12 6 15 3c2-2-3 20-1 21 3 1 5-9 8-9-1 3-2 8 0 8 3 0 4-8 7-8s-1 8 2 8 5-6 8-6 2 4 9 2" />
              </svg>
            </a>
            <nav className="ph-links" aria-label="Main">
              <a href="#">[Products]</a>
              <a href="#">[Contact]</a>
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
        </div>
      </div>
    </div>
  );
}
