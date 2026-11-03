// The story the small drawing tells on a field page, in about fifteen seconds
// from the moment it is drawn. First one dot per function. Then pairs, larger,
// with a halo: two that reach the knot together merge into one heavier dot
// (they meet), the others pass alone (they miss). Each dot enters the capital
// and stays there, turning: the capital gathers them, its line thickens and its
// inside warms. Then the capital lets them go, towards the field of the page,
// which is touched first; from it, sparks run along the links to the two other
// fields, one after the other, until all three are touched. After that the
// drawing keeps a quiet flow. A reader who asked for less motion sees the end
// at once. The pause button of the drawing stops the clock.
type Pt = { x: number; y: number };
const NS = 'http://www.w3.org/2000/svg';
const PARTS = ['economics', 'biophysics', 'climate'];
const TAU = Math.PI * 2;

// Story time, in seconds from the moment the drawing has appeared.
const STRAND = 1.8, IN = 0.35, OUT = 0.45, TIP = 1.1, LINK = 1.5;
type Arrival = { s: number; at: number; halo?: boolean; merge?: boolean };
const PLAN: Arrival[] = [
  // One dot per function.
  { s: 0, at: 1.8 }, { s: 1, at: 2.3 }, { s: 2, at: 2.8 },
  // Pairs with a halo: the first two and the fourth and fifth meet at the knot.
  { s: 0, at: 3.5, halo: true }, { s: 1, at: 3.58, halo: true, merge: true },
  { s: 2, at: 4.1, halo: true },
  { s: 0, at: 4.6, halo: true }, { s: 2, at: 4.66, halo: true, merge: true },
  { s: 1, at: 5.1, halo: true },
  // The capital fills.
  ...[1, 0, 2, 1, 2, 0].map((s, k) => ({ s, at: 5.6 + 0.3 * k })),
];
const RELEASE = 7.0, RELEASE_GAP = 0.35, RELEASES = 6;

type Dot = {
  el: SVGCircleElement; halo?: SVGCircleElement; r: number;
  phase: 'strand' | 'in' | 'orbit' | 'out' | 'tip' | 'link';
  t0: number; path?: SVGPathElement; reverse?: boolean; dur?: number;
  s?: number; angle?: number; w?: number; off?: number; offTarget?: number; leave?: boolean; tip?: number;
  mergeWith?: Dot; target?: number; small?: boolean; gone?: boolean;
};

function tell(fig: HTMLElement, svg: SVGSVGElement) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const focus = PARTS.findIndex((p) => fig.classList.contains(`cv-focus-${p}`));
  const first = focus < 0 ? 0 : focus;
  const [cx, cy, rc, ain, aout] = svg.dataset.cap!.split(' ').map(Number);
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
  // The knot where the strands meet (measured once the drawing is shown).
  let K: Pt | undefined;

  const lengths = new Map<SVGPathElement, number>();
  const len = (p: SVGPathElement) => { let l = lengths.get(p); if (l === undefined) { l = p.getTotalLength(); lengths.set(p, l); } return l; };
  const along = (p: SVGPathElement, u: number, reverse = false): Pt => {
    const v = Math.min(1, Math.max(0, reverse ? 1 - u : u));
    const pt = p.getPointAtLength(v * len(p));
    return { x: pt.x, y: pt.y };
  };
  const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
  const make = (cls: string, r: number, where: Element = flow) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', cls); c.setAttribute('r', String(r));
    where.appendChild(c); return c;
  };
  const place = (c: SVGCircleElement, p: Pt) => { c.setAttribute('cx', p.x.toFixed(1)); c.setAttribute('cy', p.y.toFixed(1)); };
  // A ring that spreads from a point and fades.
  const pulse = (p: Pt, r: number, dur = 1600, strength = 0.5) => {
    const c = make('cv-pulse', r); place(c, p);
    const a = c.animate([{ transform: 'scale(0.15)', opacity: strength }, { transform: 'scale(1)', opacity: 0 }], { duration: dur, easing: 'cubic-bezier(.2,.6,.35,1)' });
    a.onfinish = () => c.remove();
  };

  // What has been touched, and how much the capital holds.
  const touched = new Set<number>();
  let entered = 0, systemic = false;
  const touch = (i: number) => {
    if (touched.has(i)) return;
    touched.add(i);
    svg.querySelectorAll(`.part-${PARTS[i]}`).forEach((el) => el.classList.add('cv-touched'));
    const c = circles[i];
    pulse({ x: +c.getAttribute('cx')!, y: +c.getAttribute('cy')! }, +c.getAttribute('r')!, 1900, 0.55);
  };
  const charge = () => {
    entered += 1;
    const k = Math.min(1, entered / 12);
    loop.classList.add('cv-charged'); note?.classList.add('cv-charged');
    loop.style.strokeWidth = (2.6 + 1.8 * k).toFixed(2);
    mass.style.opacity = (0.11 * k).toFixed(3);
  };
  const end = () => {
    systemic = true;
    svg.classList.add('cv-systemic');
    [0, 500, 1000].forEach((d) => setTimeout(() => pulse(V, 150, 2600, 0.35), d));
  };

  if (reduce) {
    [0, 1, 2].forEach((i) => svg.querySelectorAll(`.part-${PARTS[i]}`).forEach((el) => el.classList.add('cv-touched')));
    entered = 11; charge(); svg.classList.add('cv-systemic');
    return;
  }

  const dots: Dot[] = [];
  const launch = (s: number, t: number, halo = false): Dot => {
    const d: Dot = { el: make('cv-dot', R), r: R, phase: 'strand', t0: t, s };
    if (halo) { d.halo = make('cv-halo', R * 2.6); flow.insertBefore(d.halo, d.el); }
    place(d.el, along(strands[s], 0)); if (d.halo) place(d.halo, along(strands[s], 0));
    dots.push(d); return d;
  };
  const toTip = (d: Dot, t: number) => { d.phase = 'out'; d.t0 = t; };
  const spark = (k: number, reverse: boolean, t: number, target: number) => {
    const d: Dot = { el: make('cv-dot', R * 0.75), r: R * 0.75, phase: 'link', t0: t, path: links[k], reverse, dur: LINK, target, small: true };
    d.halo = make('cv-halo', R * 2); flow.insertBefore(d.halo, d.el);
    dots.push(d);
  };
  const kill = (d: Dot) => {
    d.gone = true;
    const els = [d.el, d.halo].filter(Boolean) as SVGCircleElement[];
    els.forEach((e) => { const a = e.animate([{ opacity: getComputedStyle(e).opacity }, { opacity: 0 }], { duration: 450 }); a.onfinish = () => e.remove(); });
  };

  // The scripted part.
  let planned = 0, released = 0, sparks = 0;
  let tFocus = Infinity, nextSteady = 0, nextSpark = 0;
  let last: Dot | undefined;
  const orbiting = () => dots.filter((d) => d.phase === 'orbit' && !d.leave && !d.gone);
  // The orbiting dot that will next pass the way out.
  const soonest = () => {
    let best: Dot | undefined, wait = Infinity;
    for (const d of orbiting()) {
      const a = (((aout * Math.PI) / 180 - d.angle!) % TAU + TAU) % TAU;
      const w = a / d.w!;
      if (w < wait) { wait = w; best = d; }
    }
    return best;
  };

  let T = 0, prev = 0, running = false, visible = false;
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    if (!fig.classList.contains('cv-paused') && visible) step(dt);
    if (running) requestAnimationFrame(tick);
  };

  function step(dt: number) {
    T += dt;
    // Launch what the plan holds.
    while (planned < PLAN.length && PLAN[planned].at - STRAND <= T) {
      const a = PLAN[planned];
      const d = launch(a.s, a.at - STRAND, a.halo);
      if (a.merge && last) d.mergeWith = last;
      last = d; planned += 1;
    }
    // The capital lets dots go: towards the field of the page first.
    if (T >= RELEASE + released * RELEASE_GAP && released < RELEASES) {
      const d = soonest();
      if (d) { d.leave = true; d.offTarget = 0; d.tip = 2 * first + (released % 2); }
      released += 1;
    }
    // From the field first touched, sparks to the two others.
    if (T >= tFocus + 0.5 && sparks === 0) { spark(first, false, T, (first + 1) % 3); sparks = 1; }
    if (T >= tFocus + 1.5 && sparks === 1) { spark((first + 2) % 3, true, T, (first + 2) % 3); sparks = 2; }
    // Once all are touched, a quiet flow: a dot now and then, the capital
    // passing on its oldest, a spark along a link.
    if (systemic) {
      if (T >= nextSteady) {
        launch(Math.floor(Math.random() * 3), T);
        nextSteady = T + 1.3 + Math.random() * 0.6;
        if (orbiting().length > 9) { const d = soonest(); if (d) { d.leave = true; d.offTarget = 0; d.tip = Math.floor(Math.random() * 6); } }
      }
      if (T >= nextSpark) {
        const k = Math.floor(Math.random() * 3), rev = Math.random() < 0.5;
        spark(k, rev, T, rev ? k : (k + 1) % 3);
        nextSpark = T + 3 + Math.random() * 2;
      }
    }

    for (const d of dots) {
      if (d.gone) continue;
      let p: Pt;
      if (d.phase === 'strand') {
        const u = (T - d.t0) / STRAND;
        p = along(strands[d.s!], ease(Math.min(1, u)));
        if (u >= 1) {
          if (d.mergeWith && !d.mergeWith.gone) {
            // Two dots meet at the knot: one goes on, heavier.
            const m = d.mergeWith; m.r = R * 1.45; m.el.setAttribute('r', m.r.toFixed(1));
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
          d.phase = 'orbit'; d.t0 = T; d.angle = (ain * Math.PI) / 180;
          d.w = TAU / (2.2 + Math.random() * 0.6); d.off = 0; d.offTarget = (Math.random() * 2 - 1) * 0.13 * rc;
          if (d.halo) { const h = d.halo; d.halo = undefined; const a = h.animate([{ opacity: 0.14 }, { opacity: 0 }], { duration: 500 }); a.onfinish = () => h.remove(); }
          charge();
        }
      } else if (d.phase === 'orbit') {
        const before = d.angle!;
        d.angle! += d.w! * dt;
        d.off! += (d.offTarget! - d.off!) * Math.min(1, dt * 3);
        const rr = rc + d.off!;
        p = { x: cx + rr * Math.cos(d.angle!), y: cy + rr * Math.sin(d.angle!) };
        if (d.leave) {
          const o = (aout * Math.PI) / 180;
          const wrap = (a: number) => (((a - o) % TAU) + TAU) % TAU;
          if (wrap(d.angle!) < wrap(before)) toTip(d, T);
        }
      } else if (d.phase === 'out') {
        const u = (T - d.t0) / OUT;
        p = along(trunkOut, Math.min(1, u));
        if (u >= 1) { d.phase = 'tip'; d.t0 = T; d.path = tips[d.tip!]; }
      } else if (d.phase === 'tip') {
        const u = (T - d.t0) / TIP;
        p = along(d.path!, ease(Math.min(1, u)));
        if (u >= 1) {
          const field = Math.floor(d.tip! / 2);
          pulse(p, R * 5, 900, 0.5);
          if (!touched.size) { tFocus = T; }
          if (field === first || touched.has(field)) touch(field);
          kill(d); continue;
        }
      } else {
        const u = (T - d.t0) / d.dur!;
        p = along(d.path!, ease(Math.min(1, u)), d.reverse);
        if (u >= 1) {
          pulse(p, R * 5, 900, 0.5);
          const fresh = !touched.has(d.target!);
          touch(d.target!);
          if (fresh && touched.size === 3) setTimeout(end, 400);
          kill(d); continue;
        }
      }
      place(d.el, p); if (d.halo) place(d.halo, p);
    }
    for (let i = dots.length - 1; i >= 0; i--) if (dots[i].gone) dots.splice(i, 1);
  }

  // The story begins once the drawing has appeared and is in view.
  fig.classList.add('cv-story');
  new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    if (visible && !running) {
      running = true;
      const wait = Math.max(0, 2200 - performance.now());
      setTimeout(() => { prev = performance.now(); requestAnimationFrame(tick); }, wait);
    }
  }, { threshold: 0.2 }).observe(svg);
}

document.querySelectorAll<HTMLElement>('.convergence.cv-mini').forEach((fig) => {
  fig.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => tell(fig, svg));
});
