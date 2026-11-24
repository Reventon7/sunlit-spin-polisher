import { useEffect, useRef, useState } from "react";
import type { PolisherVariant } from "./RequestDialog";

export function ProductPreview({ variant }: { variant: PolisherVariant }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!gl) { setUnavailable(true); return; }
    let alive = true;
    let cleanup: (() => void) | undefined;
    import("@/lib/polisher-model").then(({ createPolisherModel }) => {
      if (!alive) return;
      const model = createPolisherModel(canvas, gl, variant);
      const paint = () => {
        const { width, height } = canvas.getBoundingClientRect();
        if (!width || !height) return;
        const dpr = Math.min(window.devicePixelRatio, 2);
        model.resize(Math.round(width * dpr), Math.round(height * dpr));
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        model.render([1.125 * height / width, 0, 0, 0, 2, 0, 0, 0, 1], 0.15);
      };
      const observer = new ResizeObserver(paint);
      observer.observe(canvas);
      paint();
      cleanup = () => { observer.disconnect(); model.dispose(); };
    }).catch(() => { if (alive) setUnavailable(true); });
    return () => { alive = false; cleanup?.(); };
  }, [variant]);
  return <div className={`product-visual ${variant.toLowerCase()}`}>
    <canvas ref={ref} aria-label={`${variant} spiral polisher, ${variant === "Soft" ? "light olive" : "dark charcoal"} head`} />
    {unavailable && <p className="preview-unavailable">{variant === "Soft" ? "Light olive" : "Dark charcoal"} spiral polisher</p>}
  </div>;
}
