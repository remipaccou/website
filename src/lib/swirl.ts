// The geometry of the history drawing, shared by the page (built once) and by
// its script (which reddens the threads up to the present year).
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

// Transmit, compute, store: the angle each thread starts from, the year of its
// first technique, and its two dates in chapter 1 of the thesis (§1.11 and the
// figure of electric dependence, fig:ch1-frise-regimes). `op`: electricity
// becomes constitutive of the operation or of keeping a state (the signal in
// 1837, execution in 1946, working memory in 1970). `avail`: energy is held
// continuously so that the service stays available (the central battery of the
// telephone in 1895, SAGE's hot standby in 1958, the web server in 1991). The
// dates mark a first architecture, not the regime of all that is installed.
export const geometry = [
  { base: -90, start: 1794, op: 1837, avail: 1895 },
  { base: 30, start: 1791, op: 1946, avail: 1958 },
  { base: 150, start: 1804, op: 1970, avail: 1991 },
];

// The three strokes of the thesis figures: dotted, outside any constitutive
// dependence on electricity; thin, electricity makes the operation or holds a
// state; thick, energy held for availability.
export type Stroke = 'hors' | 'oper' | 'dispo';
export const segments = (g: (typeof geometry)[number]): [Stroke, number, number][] => [
  ['hors', g.start, g.op],
  ['oper', g.op, g.avail],
  ['dispo', g.avail, Y1],
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
  const f = (n: number) => n.toFixed(1);
  const seg = pts.map((p) => `L${f(p.x)} ${f(p.yy)}`);
  // The point at any year, between two computed ones.
  const at = (y: number): Pt => {
    const i = Math.min(pts.length - 2, Math.max(0, Math.floor((y - Y0) / STEP)));
    const p = pts[i], q = pts[i + 1], k = Math.min(1, Math.max(0, (y - p.y) / STEP));
    return { y, x: p.x + (q.x - p.x) * k, yy: p.yy + (q.yy - p.yy) * k };
  };
  // The thread from one year to another, both ends exact (a dotted stroke
  // keeps its dots in place however far the path is drawn).
  const path = (from: number, to: number) => {
    if (to <= from) return '';
    const a0 = at(from), b = at(to);
    let d = `M${f(a0.x)} ${f(a0.yy)}`;
    const i1 = Math.floor((to - Y0) / STEP - 1e-6);
    for (let i = Math.ceil((from - Y0) / STEP + 1e-6); i <= i1; i++) d += seg[i];
    return d + `L${f(b.x)} ${f(b.yy)}`;
  };
  return { at, path };
}
