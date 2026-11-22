// Full 3D model of the TCP543204M spiral polisher, built procedurally in three.js (units: mm).
// It renders into the hero's own WebGL2 context, so it layers exactly like the template's
// jellyfish: the scene passes the same 2D frame matrix the jellyfish quad used, and that matrix
// is applied on top of a fixed perspective camera. Only the spiral head spins.

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/** Head dimensions from the product sheet: Ø 12.7 mm, 0.6 mm disc. */
const HEAD_R = 6.35;
const BLADES = 24;
const ROOT_R = 3.15;
const SWEEP = 0.62; // gentle curved fingers, matched to the product photographs
const DISC = 0.6;
const BEVEL = 0.08;
/** Frame the camera renders into (the template's 1080x1920 portrait video frame). */
const FRAME_ASPECT = 1080 / 1920;

// Light olive-grey abrasive head and dark mandrel from the reference photographs.
const RUBBER = "#777966";
const STEEL = "#363936";

function bladeCurve(r: number) {
  const u = Math.max(0, (r - ROOT_R) / (HEAD_R - ROOT_R));
  return SWEEP * Math.pow(u, 1.4);
}

function headShape(): THREE.Shape {
  const pitch = (Math.PI * 2) / BLADES;
  const sh = Math.sin(pitch / 2);
  const capR = HEAD_R * sh * 0.43;
  const BS = 0.06; // bevel grows the outline, so pull the edges in by the same amount
  const tipR = HEAD_R - capR;
  const kTip = capR / (tipR * sh);
  const pts: THREE.Vector2[] = [];
  const centre = (a: number, r: number) => {
    const t = a + bladeCurve(r);
    return new THREE.Vector2(r * Math.cos(t), r * Math.sin(t));
  };
  const frame = (a: number, r: number) => {
    const c = centre(a, r);
    const t = centre(a, r + 0.01).sub(centre(a, r - 0.01)).normalize();
    const n = new THREE.Vector2(-t.y, t.x);
    return { c, t, n };
  };
  const half = (r: number) => {
    const u = (r - ROOT_R) / (tipR - ROOT_R);
    return r * sh * (0.72 + (kTip - 0.72) * Math.pow(u, 0.6)) - BS;
  };
  const steps = 22;
  for (let i = 0; i < BLADES; i++) {
    const a = i * pitch;
    // low-angle edge, root -> tip
    for (let s = 0; s <= steps; s++) {
      const r = ROOT_R + ((tipR - ROOT_R) * s) / steps;
      const { c, n } = frame(a, r);
      pts.push(c.clone().addScaledVector(n, -half(r)));
    }
    // round tip
    const { c, t, n } = frame(a, tipR);
    for (let s = 1; s < 14; s++) {
      const p = -Math.PI / 2 + (Math.PI * s) / 14;
      pts.push(c.clone().addScaledVector(t, (capR - BS) * Math.cos(p)).addScaledVector(n, (capR - BS) * Math.sin(p)));
    }
    // high-angle edge, tip -> root
    for (let s = steps; s >= 0; s--) {
      const r = ROOT_R + ((tipR - ROOT_R) * s) / steps;
      const f = frame(a, r);
      pts.push(f.c.clone().addScaledVector(f.n, half(r)));
    }
  }
  return new THREE.Shape(pts);
}

/** The photographed disc is nearly planar, with only a little flex at the tips. */
function shapeHeight(x: number, y: number) {
  const r = Math.hypot(x, y);
  if (r <= ROOT_R) return 0;
  const u = Math.min(1, (r - ROOT_R) / (HEAD_R - ROOT_R));
  const pitch = (Math.PI * 2) / BLADES;
  let d = Math.atan2(y, x) - bladeCurve(r);
  d = d - pitch * Math.round(d / pitch);
  const across = d / (pitch / 2);
  return 0.035 * u * u + 0.015 * across * u;
}

function headGeometry() {
  const g = new THREE.ExtrudeGeometry(headShape(), {
    depth: DISC - BEVEL * 2,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: 0.06,
    bevelSegments: 3,
    curveSegments: 4,
  });
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const nor = g.getAttribute("normal") as THREE.BufferAttribute;
  const e = 0.01;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i),
      y = pos.getY(i);
    const f = shapeHeight(x, y);
    const fx = (shapeHeight(x + e, y) - shapeHeight(x - e, y)) / (2 * e);
    const fy = (shapeHeight(x, y + e) - shapeHeight(x, y - e)) / (2 * e);
    pos.setZ(i, pos.getZ(i) + f);
    const nz = nor.getZ(i);
    const v = new THREE.Vector3(nor.getX(i) - fx * nz, nor.getY(i) - fy * nz, nz).normalize();
    nor.setXYZ(i, v.x, v.y, v.z);
  }
  g.rotateX(-Math.PI / 2);
  g.translate(0, BEVEL, 0);
  return g;
}

/** 204-RA latch shank: Ø 2.35 mm, latch groove and D-flat at the end. */
function shankGeometry() {
  const P = (r: number, y: number) => new THREE.Vector2(r, y);
  const prof = [
    P(0, -18.2),
    P(0.95, -18.2),
    P(1.175, -17.98),
    P(1.175, -17.35),
    P(0.8, -17.2),
    P(0.8, -16.6),
    P(1.175, -16.45),
    P(1.175, -15.31),
    P(1.175, -15.29),
    P(1.175, -3.6),
    P(1.24, -3.2),
    P(1.36, -2.95),
    P(1.36, -2.62),
    P(1.22, -2.5),
    P(0, -2.5),
  ];
  const g = new THREE.LatheGeometry(prof, 96);
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const nor = g.getAttribute("normal") as THREE.BufferAttribute;
  const FLAT = 0.52;
  for (let i = 0; i < pos.count; i++) {
    if (pos.getY(i) < -15.3 && pos.getX(i) > FLAT) {
      pos.setX(i, FLAT);
      nor.setXYZ(i, 1, 0, 0);
    }
  }
  return g;
}

/** Rubber hub under the disc that grips the mandrel. */
function hubGeometry() {
  const P = (r: number, y: number) => new THREE.Vector2(r, y);
  return new THREE.LatheGeometry(
    [P(0, -2.6), P(1.45, -2.6), P(1.62, -2.48), P(1.7, -2.2), P(1.72, -0.4), P(1.95, 0.02), P(0, 0.02)],
    72,
  );
}

function gritTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d")!;
  const img = x.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + Math.random() * 110;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(0.9, 0.9);
  return t;
}

export type PolisherModel = {
  resize(w: number, h: number): void;
  /** frame: the hero's 3x3 column-major frame matrix; spin: head angle in radians. */
  render(frame: ArrayLike<number>, spin: number): void;
  dispose(): void;
};

export function createPolisherModel(
  canvas: HTMLCanvasElement,
  gl: WebGL2RenderingContext,
  variant: "Soft" | "Hard" = "Soft",
): PolisherModel {
  const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true });
  renderer.autoClear = false;
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.03).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.85;

  scene.add(new THREE.HemisphereLight("#fff3e4", "#d9a070", 0.9));
  const key = new THREE.DirectionalLight("#fff6ec", 2.4);
  key.position.set(-6, 12, 9);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#ffb46e", 2.2);
  rim.position.set(7, 4, -9);
  scene.add(rim);
  const fill = new THREE.DirectionalLight("#ffe2c4", 0.7);
  fill.position.set(8, -2, 6);
  scene.add(fill);

  const grit = gritTexture();
  const rubber = new THREE.MeshPhysicalMaterial({
    color: variant === "Hard" ? "#343b37" : RUBBER,
    roughness: 0.9,
    metalness: 0,
    sheen: 0.08,
    sheenRoughness: 0.9,
    sheenColor: new THREE.Color("#b5b39c"),
    clearcoat: 0,
    bumpMap: grit,
    bumpScale: 0.09,
    envMapIntensity: 0.35,
  });
  const steel = new THREE.MeshStandardMaterial({
    color: STEEL,
    metalness: 0.65,
    roughness: 0.67,
    bumpMap: grit,
    bumpScale: 0.018,
  });

  const geos = [headGeometry(), hubGeometry(), shankGeometry()];
  const head = new THREE.Group();
  head.add(new THREE.Mesh(geos[0], rubber));
  const hub = new THREE.Mesh(geos[1], rubber);
  const shank = new THREE.Mesh(geos[2], steel);
  shank.rotation.y = -0.35;
  const model = new THREE.Group();
  model.add(head, hub, shank);
  model.traverse((o) => (o.frustumCulled = false));
  scene.add(model);

  // Fixed camera framing the polisher inside the portrait frame: head near the top third,
  // shank running down to the bottom edge, seen from slightly above.
  const camera = new THREE.PerspectiveCamera(22, FRAME_ASPECT, 10, 400);
  const target = new THREE.Vector3(0, -5.6, 0);
  const elev = THREE.MathUtils.degToRad(26);
  const dist = 84;
  camera.position.set(0, target.y + dist * Math.sin(elev), dist * Math.cos(elev));
  camera.lookAt(target);
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();
  const base = camera.projectionMatrix.clone();
  const affine = new THREE.Matrix4();

  return {
    resize(w, h) {
      renderer.setSize(w, h, false);
    },
    render(m, spin) {
      head.rotation.y = spin;
      affine.set(m[0]! * 0.5, m[3]! * 0.5, 0, m[6]!, m[1]! * 0.5, m[4]! * 0.5, 0, m[7]!, 0, 0, 1, 0, 0, 0, 0, 1);
      camera.projectionMatrix.multiplyMatrices(affine, base);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      renderer.resetState();
      renderer.clearDepth();
      renderer.render(scene, camera);
      renderer.resetState();
    },
    dispose() {
      geos.forEach((g) => g.dispose());
      rubber.dispose();
      steel.dispose();
      grit.dispose();
      env.dispose();
      pmrem.dispose();
      room.dispose?.();
      renderer.dispose();
    },
  };
}
