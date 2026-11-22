import { useEffect, useRef } from "react";
import { mountPolisherHero } from "@/lib/polisher-hero-scene";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { BackToTop } from "./BackToTop";
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
            aria-label="A 3D spiral dental polisher with a slowly spinning head in a soft sage sky, with giant words wrapping around it"
          />
          <a className="ph-logo" href="#" aria-label="OTO">
            <Logo />
          </a>
          <div className="ph-ui">
            <nav className="ph-links" aria-label="Main">
              <Link to="/products">Products</Link>
              <a href="#ph-foot">Contact</a>
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
            <div className="ph-cap">
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
            <BackToTop />
          </div>
          <div className="ph-veil" aria-hidden="true" />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
