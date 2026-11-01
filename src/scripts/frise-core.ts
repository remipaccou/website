// One thesis timeline, brought to life. The timeline is shown as an image; on
// top of it, a red copy of its own lines, dots and circles (read from the same
// file) is uncovered up to the present year, band by band, each band with its
// own scale; a small red dot runs along each long line at that year.
const SVGNS = 'http://www.w3.org/2000/svg';
type Region = { y0: number; y1: number; stops: number[][] };
type Cal = { w: number; h: number; regions: Region[] };
let count = 0;

// Year to x in a band, linear between its stops.
const xOf = (r: Region, year: number) => {
  const s = r.stops;
  if (year <= s[0][0]) return s[0][1];
  for (let i = 0; i < s.length - 1; i++)
    if (year <= s[i + 1][0]) return s[i][1] + ((year - s[i][0]) * (s[i + 1][1] - s[i][1])) / (s[i + 1][0] - s[i][0]);
  return s[s.length - 1][1];
};

export function mountFrise(fig: HTMLElement) {
  const cal: Cal = JSON.parse(fig.dataset.cal ?? '{}');
  const svg = fig.querySelector<SVGSVGElement>('.frise-now')!;
  const img = fig.querySelector<HTMLImageElement>('img')!;
  const reds = [...svg.querySelectorAll<SVGGElement>('.fr-red')];
  const rects = [...svg.querySelectorAll<SVGRectElement>('.fr-clip-rect')];
  const dotLayer = svg.querySelector<SVGGElement>('.fr-dots')!;
  const now = svg.querySelector<SVGGElement>('.fr-now')!;
  const label = svg.querySelector<SVGTextElement>('.fr-year')!;
  const n = ++count;
  rects.forEach((r, i) => {
    r.parentElement!.id = `fr${n}-${i}`;
    reds[i].setAttribute('clip-path', `url(#fr${n}-${i})`);
  });
  const first = cal.regions[0].stops[0][0];
  const last = Math.max(...cal.regions.map((r) => r.stops[r.stops.length - 1][0]));
  const tracks: { region: Region; xs: number[]; ys: number[]; dots: SVGCircleElement[] }[] = [];
  let year = first;

  const set = (y: number) => {
    year = y;
    cal.regions.forEach((r, i) => {
      const end = r.stops[r.stops.length - 1][0];
      // At the end of its time a band is red to the edge, its last years included.
      rects[i].setAttribute('width', y >= Math.min(end, last) ? String(cal.w) : y <= r.stops[0][0] ? '0' : Math.max(0, xOf(r, y)).toFixed(2));
    });
    for (const tr of tracks) {
      const fx = xOf(tr.region, y);
      const live = y > tr.region.stops[0][0] && y < tr.region.stops[tr.region.stops.length - 1][0];
      let k = 0;
      if (live)
        for (let i = 0; i < tr.xs.length - 1; i++) {
          const a = tr.xs[i], b = tr.xs[i + 1];
          if ((a <= fx && fx < b) || (b <= fx && fx < a)) {
            const d = tr.dots[k] ?? tr.dots[tr.dots.push(dotLayer.appendChild(document.createElementNS(SVGNS, 'circle'))) - 1];
            d.setAttribute('class', 'fr-run');
            d.setAttribute('r', '1.7');
            d.setAttribute('cx', fx.toFixed(2));
            d.setAttribute('cy', (tr.ys[i] + ((tr.ys[i + 1] - tr.ys[i]) * (fx - a)) / (b - a || 1)).toFixed(2));
            d.setAttribute('opacity', '1');
            k++;
          }
        }
      for (let j = k; j < tr.dots.length; j++) tr.dots[j].setAttribute('opacity', '0');
    }
    const r0 = cal.regions[0];
    const x = xOf(r0, y);
    now.setAttribute('transform', `translate(${x.toFixed(2)} 0)`);
    now.setAttribute('opacity', '1');
    label.textContent = String(Math.floor(y));
    const right = x > cal.w * 0.82;
    label.setAttribute('x', right ? '-4' : '4');
    label.setAttribute('text-anchor', right ? 'end' : 'start');
  };

  // The red copy: the file's black lines, dots and circles, sorted into bands;
  // its words, its grey alternatives and its legend are left alone.
  fetch(img.getAttribute('src')!)
    .then((r) => r.text())
    .then((text) => {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      const black = (v: string | null) => !!v && /^rgb\(0%,\s*0%,\s*0%\)$/.test(v.trim());
      const white = (v: string | null) => !!v && /^rgb\(100%,\s*100%,\s*100%\)$/.test(v.trim());
      doc.querySelectorAll('path').forEach((src) => {
        if (src.closest('defs')) return;
        const stroke = src.getAttribute('stroke'), fill = src.getAttribute('fill');
        const line = black(stroke) && (fill === 'none' || white(fill));
        const mark = black(fill);
        if (!line && !mark) return;
        const p = document.createElementNS(SVGNS, 'path');
        for (const at of ['d', 'transform', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-miterlimit', 'fill-rule'])
          if (src.hasAttribute(at)) p.setAttribute(at, src.getAttribute(at)!);
        p.setAttribute('class', mark ? 'fr-mark' : white(fill) ? 'fr-ring' : 'fr-line');
        reds[0].appendChild(p);
        // Its place, in the drawing's own units, whatever size it is shown at.
        const m = p.transform.baseVal.consolidate()?.matrix;
        const bb = p.getBBox();
        const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].map(([x, y]) =>
          m ? [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f] : [x, y]);
        const ys = pts.map((q) => q[1]), xs = pts.map((q) => q[0]);
        const mid = (Math.min(...ys) + Math.max(...ys)) / 2;
        const i = cal.regions.findIndex((r) => mid >= r.y0 && mid <= r.y1);
        if (i < 0) return p.remove();
        reds[i].appendChild(p);
        // The long lines carry a dot.
        if (p.getAttribute('class') !== 'fr-line' || Math.max(...xs) - Math.min(...xs) < 30 || Math.min(...ys) > cal.regions[i].y1 - 8) return;
        const len = p.getTotalLength();
        const sx: number[] = [], sy: number[] = [];
        const steps = Math.min(400, Math.max(40, Math.round(len / 2)));
        for (let s = 0; s <= steps; s++) {
          const q = p.getPointAtLength((len * s) / steps);
          sx.push(m ? m.a * q.x + m.c * q.y + m.e : q.x);
          sy.push(m ? m.b * q.x + m.d * q.y + m.f : q.y);
        }
        tracks.push({ region: cal.regions[i], xs: sx, ys: sy, dots: [] });
      });
      set(year);
    })
    .catch(() => {});

  // By hand: the pointer over the timeline sets the year.
  const handlers: ((y: number | null) => void)[] = [];
  const wrap = svg.parentElement!;
  const fromPointer = (ev: PointerEvent) => {
    const r = svg.getBoundingClientRect();
    const ux = ((ev.clientX - r.left) / r.width) * cal.w;
    const r0 = cal.regions[0], s = r0.stops;
    let y = first;
    for (let i = 0; i < s.length - 1; i++)
      if (ux >= s[i][1]) y = s[i][0] + ((ux - s[i][1]) * (s[i + 1][0] - s[i][0])) / (s[i + 1][1] - s[i][1]);
    return Math.min(last, Math.max(first, y));
  };
  const take = (ev: PointerEvent) => handlers.forEach((h) => h(fromPointer(ev)));
  wrap.addEventListener('pointermove', take);
  wrap.addEventListener('pointerdown', take);
  wrap.addEventListener('pointerleave', () => handlers.forEach((h) => h(null)));

  return { set, first, last, get year() { return year; }, onHand: (h: (y: number | null) => void) => handlers.push(h) };
}

// A timeline on its own: the year runs once from start to end when the
// timeline comes into view, rests at the end, and runs again, slowly.
export function runFrise(fig: HTMLElement) {
  const f = mountFrise(fig);
  const FIRST = 9, REST = 4, RUN = 30;
  const span = f.last - f.first;
  const auto = (e: number) => {
    if (e < FIRST) return f.first + (span * e) / FIRST;
    const c = (e - FIRST) % (REST + RUN);
    return c < REST ? f.last : f.first + (span * (c - REST)) / RUN;
  };
  let t0 = 0, hand = false, resume = 0, seen = false;
  new IntersectionObserver((es) => { if (!seen && es.some((e) => e.isIntersecting)) { seen = true; t0 = performance.now(); } }, { threshold: 0.3 }).observe(fig);
  f.onHand((y) => {
    if (y === null) {
      hand = false;
      const e = FIRST + REST + ((f.year - f.first) / span) * RUN;
      resume = performance.now() + 1200;
      t0 = resume - e * 1000;
    } else { hand = true; seen = true; f.set(y); }
  });
  const frame = (t: number) => {
    if (seen && !hand && !(resume && t < resume)) f.set(auto((t - t0) / 1000));
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
