/**
 * Cube orientation math.
 *
 * The original site interpolated rotateX/rotateY angles independently, so some transitions
 * (e.g. top → bottom, or side → top) swung through faces that were never meant to show.
 * Here each face has one explicit target orientation stored as a quaternion, and transitions
 * spherically interpolate (slerp) from the cube's *current* orientation to the target. That is
 * always the shortest rotation, about a single axis, even if a previous turn was interrupted.
 */

/** [x, y, z, w] */
export type Quat = readonly [number, number, number, number];

const RAD = Math.PI / 180;

function axisAngle(x: number, y: number, z: number, degrees: number): Quat {
  const half = (degrees * RAD) / 2;
  const s = Math.sin(half);
  return [x * s, y * s, z * s, Math.cos(half)];
}

/** Hamilton product. Composes like CSS: transform "A B" = multiply(A, B). */
function multiply(a: Quat, b: Quat): Quat {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

/** Equivalent to CSS `rotateX(x) rotateY(y)`. */
function pose(rotateX: number, rotateY: number): Quat {
  return multiply(axisAngle(1, 0, 0, rotateX), axisAngle(0, 1, 0, rotateY));
}

/**
 * Where each face sits on the cube, by service index. Faces are pushed out by half the cube
 * size (--half) along their own normal.
 */
export const FACE_TRANSFORMS = [
  "translateZ(var(--half))", // 0 front
  "rotateY(90deg) translateZ(var(--half))", // 1 right
  "rotateY(180deg) translateZ(var(--half))", // 2 back
  "rotateY(-90deg) translateZ(var(--half))", // 3 left
  "rotateX(90deg) translateZ(var(--half))", // 4 top
  "rotateX(-90deg) translateZ(var(--half))", // 5 bottom
] as const;

/**
 * Cube orientation that brings each face to the front, upright. Index-aligned with
 * FACE_TRANSFORMS, so service i is always on face i and shown by pose i.
 */
export const FACE_POSES: readonly Quat[] = [
  pose(0, 0),
  pose(0, -90),
  pose(0, 180),
  pose(0, 90),
  pose(-90, 0),
  pose(90, 0),
];

/**
 * Which cube face each service (by list index) is printed on.
 *
 * Opposite faces can never be reached without sweeping past a third face, and because every
 * face must arrive upright, back ↔ top/bottom also sweeps past a side. This order is one of the
 * only four cycles where no step between consecutive services, including last → first, shows
 * an unintended face. Each step is one rotation about a single axis: a 90° quarter turn, or for
 * bottom → right and left → top a 120° turn about a corner axis (needed to arrive upright).
 *
 *   front → bottom → right → back → left → top → (front)
 *
 * Verified numerically by sampling each slerp path and checking which face points at the viewer.
 */
export const SERVICE_FACES = [0, 5, 1, 2, 3, 4] as const;

export function slerp(a: Quat, b: Quat, t: number): Quat {
  let [bx, by, bz, bw] = b;
  let dot = a[0] * bx + a[1] * by + a[2] * bz + a[3] * bw;

  // q and -q are the same orientation; flip to take the short way round.
  if (dot < 0) {
    [bx, by, bz, bw] = [-bx, -by, -bz, -bw];
    dot = -dot;
  }

  if (dot > 0.9995) {
    const q: Quat = [
      a[0] + t * (bx - a[0]),
      a[1] + t * (by - a[1]),
      a[2] + t * (bz - a[2]),
      a[3] + t * (bw - a[3]),
    ];
    const length = Math.hypot(...q);
    return [q[0] / length, q[1] / length, q[2] / length, q[3] / length];
  }

  const theta0 = Math.acos(dot);
  const theta = theta0 * t;
  const sinTheta0 = Math.sin(theta0);
  const s0 = Math.cos(theta) - (dot * Math.sin(theta)) / sinTheta0;
  const s1 = Math.sin(theta) / sinTheta0;
  return [s0 * a[0] + s1 * bx, s0 * a[1] + s1 * by, s0 * a[2] + s1 * bz, s0 * a[3] + s1 * bw];
}

/** CSS rotate3d() for a unit quaternion. */
export function toCssRotation(q: Quat): string {
  const w = Math.min(1, Math.max(-1, q[3]));
  const s = Math.sqrt(1 - w * w);
  if (s < 1e-6) return "rotate3d(0, 1, 0, 0deg)";
  const angle = (2 * Math.acos(w)) / RAD;
  const f = (n: number) => (n / s).toFixed(5);
  return `rotate3d(${f(q[0])}, ${f(q[1])}, ${f(q[2])}, ${angle.toFixed(3)}deg)`;
}
