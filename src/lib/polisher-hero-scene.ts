// WebGL2 scene for the scroll-driven polisher hero.
// Port of the "Driftlab jellyfish" template: same sky, points, word ribbons and motion,
// with the keyed jellyfish video replaced by a full 3D polisher model (polisher-model.ts)
// drawn into the same context. The sky photo is recoloured to a cool mineral palette.

import { createPolisherModel, type PolisherModel } from "@/lib/polisher-model";

export const HERO_WORDS = ["SPIRAL", "POLISH TO", "PERFECTION", "SMOOTH", "AND BRILLIANT"];

const SKY =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261102_045255_3cb4b3c2-3cb5-4af9-93b4-bd88f2f883c3.png&w=1920&q=80";

/** Head spin in radians per second (slow: one full turn every ~16 s). */
export const HEAD_SPIN = 0.4;

const STEP = 0.14,
  GAP = 3.4,
  RADIUS = 9,
  CAM = 11,
  FOCAL = 8.14;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  x = clamp((x - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const ease = (x: number) => x * x * x * (x * (6 * x - 15) + 10);

type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };

export function mountPolisherHero(root: HTMLElement): () => void {
  const q = <T extends HTMLElement = HTMLElement>(id: string) =>
    root.querySelector(`#${id}`) as T;
  const cv = q<HTMLCanvasElement>("ph-gl");
  const track = q("ph-track");
  const glMaybe = cv.getContext("webgl2", {
    alpha: false,
    antialias: true,
    premultipliedAlpha: true,
  });
  if (!glMaybe) return () => {};
  const gl = glMaybe;
  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  let alive = true;

  function program(vs: string, fs: string, names: string[]): Prog {
    const sh = (t: number, s: string) => {
      const o = gl.createShader(t)!;
      gl.shaderSource(o, "#version 300 es\nprecision highp float;\n" + s);
      gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o));
      return o;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    const u: Prog["u"] = {};
    names.forEach((n) => (u[n] = gl.getUniformLocation(p, n)));
    return { p, u };
  }

  const QUAD = `out vec2 v;void main(){vec2 c=vec2((gl_VertexID<<1)&2,gl_VertexID&2);v=c;gl_Position=vec4(c*2.-1.,0,1);}`;
  const skyP = program(
    QUAD,
    `in vec2 v;uniform sampler2D T;uniform vec3 C;out vec4 O;
  void main(){vec2 uv=vec2(.5)+(v-.5)*C.xy;uv.y=1.-uv.y;uv.x+=C.z;vec3 c=textureLod(T,uv,1.6).rgb;
  float L=dot(c,vec3(.299,.587,.114));
  float t=clamp(smoothstep(.77,.93,L)*.55+(1.-smoothstep(.05,.29,c.b-c.r))*.45,0.,1.);
  vec3 a=vec3(.52,.64,.62),b=vec3(.76,.83,.79),d=vec3(.95,.96,.91);
  O=vec4(t<.5?mix(a,b,t*2.):mix(b,d,t*2.-1.),1.);}`,
    ["T", "C"],
  );
  const wordP = program(
    `layout(location=0) in vec2 a;uniform vec4 W;uniform vec4 B;uniform float A;uniform vec3 L;out vec2 v;
  void main(){
    float t=(a.x-.5)*W.x+W.y;
    float th=clamp(t/${RADIUS.toFixed(1)},-1.45,1.45);
    float x=${RADIUS.toFixed(1)}*sin(th),z=${RADIUS.toFixed(1)}*(1.-cos(th))*.82;
    float y=(a.y-.5)*L.x+L.y-L.z-3.6*pow(smoothstep(.8,8.,t),1.25)-.012*t*t;
    v=vec2(mix(B.x,B.z,a.x),mix(B.w,B.y,a.y));
    gl_Position=vec4(x*${FOCAL.toFixed(2)}/A,y*${FOCAL.toFixed(2)},0.,${CAM.toFixed(1)}-z);
  }`,
    `in vec2 v;uniform sampler2D T;out vec4 O;void main(){float a=texture(T,v).a;O=vec4(vec3(.043,.035,.03)*a,a);}`,
    ["W", "B", "A", "L", "T"],
  );
  const dotP = program(
    `layout(location=0) in vec4 a;uniform float S,H,P;out float k;out float r;
  void main(){k=a.w;float y=fract(a.y+S*.012*(.4+a.z))*2.3-1.15;float x=fract(a.x+H*(a.w>.5?.035:.004))*2.4-1.2+.03*sin(S*.2+a.z*9.);
    gl_Position=vec4(x,y,0,1);gl_PointSize=(a.w>.5?5.+a.z*15.:5.+a.z*24.)*P;r=S*.6+a.z*7.+H;}`,
    `in float k;in float r;out vec4 O;void main(){vec2 p=gl_PointCoord-.5;
    if(k>.5){float c=cos(r),s=sin(r);p=mat2(c,-s,s,c)*p;float a=step(max(abs(p.x),abs(p.y)),.3);O=vec4(vec3(.043,.035,.03)*a,a);}
    else{float a=smoothstep(.5,.1,length(p))*.62;O=vec4(vec3(.96,.99,.97)*a,a);}}`,
    ["S", "H", "P"],
  );
  // word atlas: one row per word, cut to its measured width
  const ROW = 512,
    EM = 440,
    atlas = document.createElement("canvas");
  atlas.width = 4096;
  atlas.height = ROW * HERO_WORDS.length;
  type Slot = { len: number; c: number; u: number; top: number; bot: number };
  let layout: Slot[] = [];
  function drawAtlas() {
    const x = atlas.getContext("2d")!;
    x.clearRect(0, 0, atlas.width, atlas.height);
    x.font = `${EM}px Anton`;
    x.textBaseline = "alphabetic";
    x.fillStyle = "#000";
    x.textAlign = "left";
    (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "8px";
    let c = 0;
    layout = [];
    HERO_WORDS.forEach((w, i) => {
      const m = x.measureText(w).width + 16;
      x.fillText(w, 8, i * ROW + EM * 0.92 + 6);
      const uW = (m / EM) * 0.86;
      layout.push({
        len: uW,
        c: c + uW / 2,
        u: m / atlas.width,
        top: i / HERO_WORDS.length,
        bot: (i + 1) / HERO_WORDS.length,
      });
      c += uW + GAP;
    });
  }
  const tex = (unit: number, filter: number) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    return t;
  };
  const tSky = tex(0, gl.LINEAR_MIPMAP_LINEAR),
    tWords = tex(1, gl.LINEAR_MIPMAP_LINEAR);
  const aniso = gl.getExtension("EXT_texture_filter_anisotropic");
  const load = (url: string, cors: boolean) =>
    new Promise<HTMLImageElement | null>((r) => {
      const i = new Image();
      if (cors) i.crossOrigin = "anonymous";
      i.onload = () => r(i);
      i.onerror = () => r(null);
      i.src = url;
    });

  const cols = 56,
    ribbon = new Float32Array((cols + 1) * 4);
  for (let i = 0; i <= cols; i++) ribbon.set([i / cols, 0, i / cols, 1], i * 4);
  const vaoW = gl.createVertexArray();
  gl.bindVertexArray(vaoW);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, ribbon, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const dots: number[] = [];
  let sd = 7;
  const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 40; i++) dots.push(rnd(), rnd(), rnd(), i % 4 ? 0 : 1);
  const vaoD = gl.createVertexArray();
  gl.bindVertexArray(vaoD);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
  const vaoE = gl.createVertexArray();

  let model: PolisherModel | null = null;
  try {
    model = createPolisherModel(cv, gl);
  } catch (e) {
    console.error("Polisher model failed to start", e);
  }

  let H = 1,
    dpr = 1,
    asp = 1;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const W = Math.round(cv.clientWidth * dpr);
    H = Math.round(cv.clientHeight * dpr);
    cv.width = W;
    cv.height = H;
    asp = W / H;
    gl.viewport(0, 0, W, H);
    model?.resize(W, H);
  }
  addEventListener("resize", size);

  let target = 0,
    now = 0,
    mx = 0,
    my = 0,
    tmx = 0,
    tmy = 0;

  function draw(s: number, sec: number) {
    const n = HERO_WORDS.length,
      span = STEP * (n - 1),
      k = clamp(s / span) * (n - 1),
      i = Math.min(n - 2, Math.floor(k)),
      f = k - i;
    const c0 = layout[i]!.c,
      c1 = layout[i + 1]!.c,
      head = c0 + (c1 - c0) * ease(f);
    const sink = ease(smooth(span + 0.015, span + 0.105, s)) * 6;
    const grow = ease(smooth(span + 0.08, span + 0.22, s)),
      side = smooth(0.76, 0.82, s) - 2 * smooth(0.88, 0.94, s);
    // the model shares this context, so restore our own state every frame
    gl.viewport(0, 0, cv.width, cv.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tSky);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tWords);
    // sky
    gl.disable(gl.BLEND);
    gl.useProgram(skyP.p);
    gl.bindVertexArray(vaoE);
    gl.uniform1i(skyP.u["T"]!, 0);
    const ca = asp / (16 / 9),
      fx = ca > 1 ? 1 : ca,
      fy = ca > 1 ? 1 / ca : 1;
    gl.uniform3f(skyP.u["C"]!, fx * 0.92, fy * 0.92, s * 0.05 + sec * 0.0022);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // points
    gl.useProgram(dotP.p);
    gl.bindVertexArray(vaoD);
    gl.uniform1f(dotP.u["S"]!, sec);
    gl.uniform1f(dotP.u["H"]!, head * 0.1 + s * 4);
    gl.uniform1f(dotP.u["P"]!, H / 900);
    gl.drawArrays(gl.POINTS, 0, 40);
    // words
    gl.useProgram(wordP.p);
    gl.bindVertexArray(vaoW);
    gl.uniform1i(wordP.u["T"]!, 1);
    gl.uniform1f(wordP.u["A"]!, asp);
    const hs = clamp(asp * 0.58, 0.26, 1);
    gl.uniform3f(wordP.u["L"]!, hs, 0.19 + 0.1 * (1 - hs), sink);
    layout.forEach((w) => {
      const t = w.c - head;
      if (Math.abs(t) > 24) return;
      gl.uniform4f(wordP.u["W"]!, w.len * hs, t * hs, 0, 0);
      gl.uniform4f(wordP.u["B"]!, 0, w.top, w.u, w.bot);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, (cols + 1) * 2);
    });
    // polisher (same motion as the template's jellyfish)
    const h = (0.98 + grow * 0.42) * clamp(0.62 + asp * 0.4, 0.6, 1),
      w = ((h * (1080 / 1920)) / asp) * (0.93 + 0.07 * Math.cos(s * 14));
    const roll = (0.1 * Math.sin(s * 13 + 0.4) + 0.03 * Math.sin(sec * 0.5)) * (1 + grow * 0.5),
      co = Math.cos(roll),
      si = Math.sin(roll);
    const ox = mx * 0.018 + side * 0.34 * Math.min(1, asp),
      oy = 0.03 + 0.018 * Math.sin(sec * 0.8) + my * 0.018 - grow * 0.1;
    gl.bindVertexArray(null);
    model?.render([
      w * 2 * co,
      w * 2 * si * asp,
      0,
      (-h * 2 * si) / asp,
      h * 2 * co,
      0,
      ox,
      oy,
      1,
    ], calm ? 0 : -sec * HEAD_SPIN);
    ui(s, k);
  }

  let lastIdx = 0;
  const marks = [...q("ph-index").querySelectorAll("b")];
  const c1El = q("ph-c1"),
    c2El = q("ph-c2"),
    p1 = q("ph-p1"),
    p2 = q("ph-p2");
  function ui(s: number, k: number) {
    const op = (a: number, b: number, c: number, d: number) => smooth(a, b, s) * (1 - smooth(c, d, s));
    const c1 = 1 - smooth(0.04, 0.08, s),
      c2 = op(0.08, 0.12, 0.56, 0.62);
    c1El.style.opacity = String(c1);
    c2El.style.opacity = String(c2);
    const a = op(0.72, 0.77, 0.84, 0.88),
      b = op(0.9, 0.95, 1.1, 1.2);
    p1.style.opacity = String(a);
    p1.style.transform = `translateY(calc(-50% + ${(1 - a) * 18}px))`;
    p2.style.opacity = String(b);
    p2.style.transform = `translateY(calc(-50% + ${(1 - b) * 18}px))`;
    const idx = Math.round(k);
    if (idx !== lastIdx) {
      marks[lastIdx]?.classList.remove("on");
      marks[idx]?.classList.add("on");
      lastIdx = idx;
    }
  }

  const read = () => {
    const r = track.getBoundingClientRect(),
      m = r.height - innerHeight;
    target = clamp(-r.top / m);
    upBtn.hidden = window.scrollY <= 0;
  };
  const onMove = (e: PointerEvent) => {
    tmx = (e.clientX / innerWidth) * 2 - 1;
    tmy = 1 - (e.clientY / innerHeight) * 2;
  };
  addEventListener("scroll", read, { passive: true });
  addEventListener("pointermove", onMove);
  let raf = 0;
  // Footer hand-off: 0 when the footer is below the screen, 1 once it covers the hero.
  const foot = document.getElementById("ph-foot");
  function loop(t: number) {
    if (!alive) return;
    now += (target - now) * (calm ? 1 : 0.1);
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;
    const fp = foot ? clamp((innerHeight - foot.getBoundingClientRect().top) / innerHeight) : 0;
    root.style.setProperty("--fp", fp.toFixed(4));
    if (fp < 1) draw(now, t / 1000);
    raf = requestAnimationFrame(loop);
  }
  const upBtn = q<HTMLButtonElement>("ph-up");
  const upload = (unit: number, t: WebGLTexture | null, img: HTMLImageElement | TexImageSource, premul: boolean) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premul);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  };

  // The font stylesheet may arrive after this runs, so redraw the word atlas whenever
  // a font finishes loading.
  let ready = false;
  const redrawWords = () => {
    if (!alive || !ready) return;
    drawAtlas();
    upload(1, tWords, atlas, false);
  };
  document.fonts.addEventListener("loadingdone", redrawWords);
  const fontReady = document.fonts.ready
    .then(() => document.fonts.load(`${EM}px Anton`, "SPIRAL"))
    .catch(() => null);

  Promise.all([load(SKY, true), fontReady]).then(
    ([sky]) => {
    if (!alive) return;
    ready = true;
    drawAtlas();
    if (sky) upload(0, tSky, sky, false);
    upload(1, tWords, atlas, false);
    cv.parentElement?.setAttribute("data-scene-ready", "");
    size();
    read();
    now = target;
    raf = requestAnimationFrame(loop);
    },
  );

  return () => {
    alive = false;
    document.fonts.removeEventListener("loadingdone", redrawWords);
    cancelAnimationFrame(raf);
    removeEventListener("resize", size);
    removeEventListener("scroll", read);
    removeEventListener("pointermove", onMove);
    model?.dispose();
  };
}
