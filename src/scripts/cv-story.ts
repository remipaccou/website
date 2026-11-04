// The story the small drawing tells on a field page, in about fifteen seconds.
// From the start, dots leave the three functions, pass through the capital and
// go straight into the circles: first into the field of the page. One per
// function at first; then pairs, larger, with a halo: two that reach the knot
// together merge into one heavier dot (they meet), the others pass alone (they
// miss). Each dot that passes leaves a grain in the capital, which keeps
// turning there: the capital gathers, its line thickens, its inside warms. The
// more it holds, the faster dots come and the faster a touched field passes
// sparks along the links to the others: the spread speeds up until all three
// are touched. Then the functions turn into a living dotted flow, the circles
// stay lit and linked, the capital keeps its grains, and a quiet flow goes on.
// On the home page the economy is the first field. The story plays for every
// reader, as the drawing always has: dots that glide, nothing that zooms. A
// reader who asked for less motion is spared only the rings that spread; the
// pause button of the drawing stops the clock.
type Pt = { x: number; y: number };
const NS = 'http://www.w3.org/2000/svg';
const PARTS = ['economics', 'biophysics', 'climate'];
const TAU = Math.PI * 2;

// Story time, in seconds from the moment the drawing has appeared.
const STRAND = 1.3, IN = 0.25, HALF = 0.8, OUT = 0.35, TIP = 0.9, LINK = 1.2;
type Arrival = { s: number; at: number; halo?: boolean; merge?: boolean };
const PLAN: Arrival[] = [
  // One dot per function.
  { s: 0, at: 1.3 }, { s: 1, at: 1.8 }, { s: 2, at: 2.3 },
  // Pairs with a halo: the first two and the fourth and fifth meet at the knot.
  { s: 0, at: 2.9, halo: true }, { s: 1, at: 2.97, halo: true, merge: true },
  { s: 2, at: 3.4, halo: true },
  { s: 0, at: 3.9, halo: true }, { s: 2, at: 3.96, halo: true, merge: true },
  { s: 1, at: 4.4, halo: true },
];
const STREAM = 3.6; // after the plan, a stream that quickens as the capital fills
const FORCE = 11.8; // from here the fields still short of full are helped there, by about 13

type Dot = {
  el: SVGCircleElement; halo?: SVGCircleElement; r: number; weight: number;
  phase: 'strand' | 'in' | 'turn' | 'out' | 'tip' | 'link';
  t0: number; s?: number; path?: SVGPathElement; reverse?: boolean; target?: number;
  mergeWith?: Dot; gone?: boolean;
};
type Grain = { el: SVGCircleElement; angle: number; w: number; off: number };

function tell(fig: HTMLElement, svg: SVGSVGElement) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const focus = PARTS.findIndex((p) => fig.classList.contains(`cv-focus-${p}`));
  const first = focus < 0 ? 0 : focus;
  const [cx, cy, rc, ain] = svg.dataset.cap!.split(' ').map(Number);
  const R = Number(svg.dataset.dot);
  const q = <T extends Element>(sel: string) => [...svg.querySelectorAll<T>(sel)];
  const strands = q<SVGPathElement>('.cv-strand path');
  const trunkIn = q<SVGPathElement>('.cv-trunk.t0')[0];
  const trunkOut = q<SVGPathElement>('.cv-trunk.t1')[0];
  const tips = q<SVGPathElement>('.cv-guides path');
  const links = q<SVGPathElement>('.cv-link');
  const circles = q<SVGCircleElement>('.cv-circles circle');
  const loop = q<SVGPathElement>('.cv-loop')[0];
  const note = q<SVGTextElement>('.cv-note')[0];
  const mass = q<SVGCircleElement>('.cv-mass')[0];
  const flow = q<SVGGElement>('.cv-flow')[0];
  const heart = q<SVGCircleElement>('.cv-heart')[0];
  const V: Pt = { x: +heart.getAttribute('cx')!, y: +heart.getAttribute('cy')! };
  let K: Pt | undefined; // the knot, measured once the drawing is shown

  // What each field shows: the circle, its roots and nodes, its name.
  const partsOf = [0, 1, 2].map((i) => ({
    circle: circles[i],
    rest: q<SVGElement>(`.cv-root.part-${PARTS[i]}, .cv-node.part-${PARTS[i]}`),
    label: q<SVGTextElement>(`.cv-field.part-${PARTS[i]}`)[0],
    base: focus >= 0 && i !== focus ? 0.22 : 1,
  }));
  // How far each field is touched (0 to 1), and what is shown of it.
  const level = [0, 0, 0], shown = [0, 0, 0];
  if (focus >= 0) { level[focus] = 0.55; shown[focus] = 0.55; }
  const paint = (i: number) => {
    const l = shown[i], P = partsOf[i], op = (P.base + (1 - P.base) * l).toFixed(3);
    const mix = `color-mix(in srgb, var(--sun) ${(l * 100).toFixed(0)}%, var(--ink))`;
    Object.assign(P.circle.style, { opacity: op, fill: mix, fillOpacity: (0.03 + 0.07 * l).toFixed(3), stroke: mix, strokeOpacity: (0.38 + 0.42 * l).toFixed(3), strokeWidth: (0.9 + 0.4 * l).toFixed(2) });
    P.rest.forEach((e) => { e.style.opacity = op; });
    if (P.label) { P.label.style.opacity = op; P.label.style.fill = mix; }
  };

  const lengths = new Map<SVGPathElement, number>();
  const len = (p: SVGPathElement) => { let l = lengths.get(p); if (l === undefined) { l = p.getTotalLength(); lengths.set(p, l); } return l; };
  const along = (p: SVGPathElement, u: number, reverse = false): Pt => {
    const v = Math.min(1, Math.max(0, reverse ? 1 - u : u));
    const pt = p.getPointAtLength(v * len(p));
    return { x: pt.x, y: pt.y };
  };
  const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
  const make = (cls: string, r: number) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', cls); c.setAttribute('r', r.toFixed(2));
    flow.appendChild(c); return c;
  };
  const place = (c: SVGCircleElement, p: Pt) => { c.setAttribute('cx', p.x.toFixed(1)); c.setAttribute('cy', p.y.toFixed(1)); };
  const fade = (e: Element, ms = 450) => { const a = e.animate([{ opacity: getComputedStyle(e).opacity }, { opacity: 0 }], { duration: ms }); a.onfinish = () => e.remove(); };
  // A ring that spreads from a point and fades.
  const pulse = (p: Pt, r: number, dur = 1600, strength = 0.5) => {
    if (reduce) return;
    const c = make('cv-pulse', r); place(c, p);
    const a = c.animate([{ transform: 'scale(0.15)', opacity: strength }, { transform: 'scale(1)', opacity: 0 }], { duration: dur, easing: 'cubic-bezier(.2,.6,.35,1)' });
    a.onfinish = () => c.remove();
  };
  const centre = (i: number): Pt => ({ x: +circles[i].getAttribute('cx')!, y: +circles[i].getAttribute('cy')! });

  // The capital: the grains it keeps, turning.
  const grains: Grain[] = [];
  const C = () => grains.length;
  const deposit = (n: number) => {
    for (let k = 0; k < n; k++) {
      const g: Grain = { el: make('cv-grain', R * 0.55), angle: Math.random() * TAU, w: TAU / (2.2 + Math.random() * 1.2), off: (Math.random() * 2 - 1) * 0.16 * rc };
      grains.push(g);
      if (grains.length > 26) fade(grains.shift()!.el, 900);
    }
    const k = Math.min(1, grains.length / 16);
    loop.classList.add('cv-charged'); note?.classList.add('cv-charged');
    loop.style.strokeWidth = (2.6 + 1.8 * k).toFixed(2);
    mass.style.opacity = (0.11 * k).toFixed(3);
  };

  let done = false;
  const hit = (i: number, gain: number) => {
    const was = level[i];
    level[i] = Math.min(1, level[i] + gain * (1 + C() / 12));
    if (was === 0 && level[i] > 0) pulse(centre(i), +circles[i].getAttribute('r')!, 1900, 0.55);
  };
  // The functions and the trunk become a dotted flow, dots a fixed distance apart.
  const flowing = () => q<SVGPathElement>('.cv-strand path, .cv-trunk').forEach((p) => {
    let gap = 0.02;
    try { gap = 11 / len(p); } catch { /* a drawing not shown cannot be measured: keep the default */ }
    p.style.setProperty('--gap', gap.toFixed(5));
  });
  const end = () => {
    done = true;
    flowing();
    svg.classList.add('cv-systemic');
    [0, 500, 1000].forEach((d) => setTimeout(() => pulse(V, 150, 2600, 0.35), d));
  };

  [0, 1, 2].forEach(paint);

  const dots: Dot[] = [];
  const launch = (s: number, t: number, halo = false): Dot => {
    const d: Dot = { el: make('cv-dot', R), r: R, weight: 1, phase: 'strand', t0: t, s };
    if (halo) { d.halo = make('cv-halo', R * 2.6); flow.insertBefore(d.halo, d.el); }
    dots.push(d); return d;
  };
  // Where a dot goes when it leaves the capital: to the field of the page, and
  // more and more to the fields it has touched.
  const pick = () => {
    if (done) return Math.floor(Math.random() * 3);
    const w = [0, 1, 2].map((i) => (i === first ? 1 : 0.8 * level[i]));
    let r = Math.random() * (w[0] + w[1] + w[2]);
    for (let i = 0; i < 3; i++) { if ((r -= w[i]) <= 0) return i; }
    return first;
  };
  // Links run i -> i+1 (link i); a spark to the previous field takes one backwards.
  const spark = (from: number, to: number, t: number) => {
    const forward = to === (from + 1) % 3;
    const d: Dot = { el: make('cv-dot', R * 0.75), r: R * 0.75, weight: 1, phase: 'link', t0: t, path: links[forward ? from : to], reverse: !forward, target: to };
    d.halo = make('cv-halo', R * 2); flow.insertBefore(d.halo, d.el);
    dots.push(d);
  };
  const kill = (d: Dot) => { d.gone = true; fade(d.el); if (d.halo) fade(d.halo); };

  let T = 0, prev = 0, running = false, visible = false;
  let planned = 0, nextStream = STREAM;
  let last: Dot | undefined;
  const nextSpark = [Infinity, Infinity, Infinity];

  function step(dt: number) {
    T += dt;
    // The plan, then a stream that quickens with the capital (calm once all are touched).
    while (planned < PLAN.length && PLAN[planned].at - STRAND <= T) {
      const a = PLAN[planned];
      const d = launch(a.s, a.at - STRAND, a.halo);
      if (a.merge && last) d.mergeWith = last;
      last = d; planned += 1;
    }
    if (T >= nextStream) {
      launch(Math.floor(Math.random() * 3), T);
      nextStream = T + (done ? 1.1 + Math.random() * 0.6 : Math.max(0.22, 0.8 / (1 + C() / 5)));
    }
    // A field well touched passes sparks to the others, faster as the capital grows.
    for (let i = 0; i < 3; i++) {
      if (level[i] >= 0.85 && nextSpark[i] === Infinity) nextSpark[i] = T + 0.3;
      if (T >= nextSpark[i]) {
        const open = [0, 1, 2].filter((j) => j !== i && (done || level[j] < 1));
        if (open.length) spark(i, open[Math.floor(Math.random() * open.length)], T);
        nextSpark[i] = T + (done ? 4 + Math.random() * 3 : Math.max(0.35, 2.0 / (1 + C() / 6)));
      }
    }
    // Late in the story, the fields still short of full are helped there.
    if (!done && T >= FORCE) for (let i = 0; i < 3; i++) level[i] = Math.min(1, level[i] + dt * (T >= FORCE + 1.2 ? 1 : 0.25));
    for (let i = 0; i < 3; i++) {
      if (Math.abs(level[i] - shown[i]) > 0.002) { shown[i] += (level[i] - shown[i]) * Math.min(1, dt * 2.5); paint(i); }
    }
    if (!done && level.every((l) => l >= 1)) end();

    // The grains turn in the capital.
    for (const g of grains) {
      g.angle += g.w * dt;
      const rr = rc + g.off;
      place(g.el, { x: cx + rr * Math.cos(g.angle), y: cy + rr * Math.sin(g.angle) });
    }

    for (const d of dots) {
      if (d.gone) continue;
      let p: Pt;
      if (d.phase === 'strand') {
        const u = (T - d.t0) / STRAND;
        p = along(strands[d.s!], ease(Math.min(1, u)));
        if (u >= 1) {
          if (d.mergeWith && !d.mergeWith.gone) {
            // Two dots meet at the knot: one goes on, heavier, and will leave more.
            const m = d.mergeWith; m.r = R * 1.45; m.weight = 2; m.el.setAttribute('r', m.r.toFixed(1));
            m.halo?.setAttribute('r', (m.r * 2.6).toFixed(1));
            K ??= along(strands[0], 1);
            pulse(K, R * 9, 1100, 0.6);
            kill(d); continue;
          }
          d.phase = 'in'; d.t0 = T;
        }
      } else if (d.phase === 'in') {
        const u = (T - d.t0) / IN;
        p = along(trunkIn, Math.min(1, u));
        if (u >= 1) {
          d.phase = 'turn'; d.t0 = T;
          if (d.halo) { const h = d.halo; d.halo = undefined; fade(h, 500); }
        }
      } else if (d.phase === 'turn') {
        // Half a turn round the capital, from the way in to the way out.
        const u = Math.min(1, (T - d.t0) / HALF);
        const a = (ain * Math.PI) / 180 + Math.PI * u;
        p = { x: cx + rc * Math.cos(a), y: cy + rc * Math.sin(a) };
        if (u >= 1) { deposit(d.weight); d.phase = 'out'; d.t0 = T; }
      } else if (d.phase === 'out') {
        const u = (T - d.t0) / OUT;
        p = along(trunkOut, Math.min(1, u));
        if (u >= 1) { d.phase = 'tip'; d.t0 = T; d.target = pick(); d.path = tips[2 * d.target + Math.floor(Math.random() * 2)]; }
      } else if (d.phase === 'tip') {
        const u = (T - d.t0) / TIP;
        p = along(d.path!, ease(Math.min(1, u)));
        if (u >= 1) { pulse(p, R * 5, 900, 0.5); hit(d.target!, 0.065 * d.weight); kill(d); continue; }
      } else {
        const u = (T - d.t0) / LINK;
        p = along(d.path!, ease(Math.min(1, u)), d.reverse);
        if (u >= 1) { pulse(p, R * 5, 900, 0.5); hit(d.target!, 0.09); kill(d); continue; }
      }
      place(d.el, p); if (d.halo) place(d.halo, p);
    }
    for (let i = dots.length - 1; i >= 0; i--) if (dots[i].gone) dots.splice(i, 1);
    svg.dataset.levels = level.map((l) => l.toFixed(2)).join(' ') + ' C' + C();
  }

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    if (!fig.classList.contains('cv-paused') && visible) step(dt);
    requestAnimationFrame(tick);
  };

  // The story begins once the drawing has appeared and is in view.
  fig.classList.add('cv-story');
  new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    if (visible && !running) {
      running = true;
      setTimeout(() => { prev = performance.now(); requestAnimationFrame(tick); }, Math.max(0, 1800 - performance.now()));
    }
  }, { threshold: 0.2 }).observe(svg);
}

document.querySelectorAll<HTMLElement>('.convergence').forEach((fig) => {
  fig.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => tell(fig, svg));
});
