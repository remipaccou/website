// The geometry of the history drawing, shared by the page (built once) and by
// its script (which places the dots of the present year on the threads).
//
// One thread per function. Its radius shrinks slowly, then fast as 2007 nears,
// then holds at the knot; its angle turns so that the thread grows by the same
// length every year, so that a line drawn at a steady speed keeps the calendar.

export const Y0 = 1790, Y1 = 2026, M0 = 1975, M1 = 2007;
const R0 = 190, RC = 7, V = 6.05; // radii in px; V: length of thread per year
const STEP = 0.25;

export const radius = (y: number) => {
  if (y >= M1) return RC;
  const u = (y - Y0) / (M1 - Y0);
  return RC + (R0 - RC) * (1 - (0.55 * u + 0.45 * u ** 6));
};

// transmit, compute, store: the angle each starts from, the year of its first
// technique and the year it became electric (chapter 1 of the thesis).
export const geometry = [
  { base: -90, start: 1794, elec: 1837 },
  { base: 30, start: 1834, elec: 1890 },
  { base: 150, start: 1804, elec: 1898 },
];

export type Pt = { y: number; x: number; yy: number };
export function thread(base: number) {
  const pts: Pt[] = [];
  let a = (base * Math.PI) / 180;
  for (let y = Y0; y <= Y1 + 1e-9; y += STEP) {
    const r = radius(y);
    pts.push({ y, x: r * Math.cos(a), yy: r * Math.sin(a) });
    a += (V * STEP) / r;
  }
  // The point at any year, between two computed ones.
  const at = (y: number): Pt => {
    const i = Math.min(pts.length - 2, Math.max(0, Math.floor((y - Y0) / STEP)));
    const p = pts[i], q = pts[i + 1], k = Math.min(1, Math.max(0, (y - p.y) / STEP));
    return { y, x: p.x + (q.x - p.x) * k, yy: p.yy + (q.yy - p.yy) * k };
  };
  const f = (n: number) => n.toFixed(1);
  const path = (from: number, to: number) =>
    pts.filter((p) => p.y >= from - 1e-9 && p.y <= to + 1e-9).map((p, i) => `${i ? 'L' : 'M'}${f(p.x)} ${f(p.yy)}`).join('');
  return { at, path };
}
