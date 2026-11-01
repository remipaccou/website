// The history page keeps one present year for its two drawings. The threads
// carry a dot each at that year (in ink while the function works without
// electricity, red after); the timeline below carries a red line at the same
// year. The year first runs from 1790 to today in seven seconds, in step with
// the threads drawing themselves, then rests at today, when the knot rings,
// and runs again, slowly. Moving over the timeline takes the year in hand.
import { Y0, Y1, geometry, thread } from '../lib/swirl';

const swirl = document.querySelector<HTMLElement>('.swirl');
const frise = document.querySelector<HTMLElement>('.frise');
if (swirl || frise) {
  const threads = geometry.map((g) => ({ ...g, t: thread(g.base) }));
  const dots = [...document.querySelectorAll<SVGCircleElement>('.sw-now-dot')];
  const ring = document.querySelector<SVGCircleElement>('.sw-ring');
  const now = frise?.querySelector<SVGGElement>('.fr-now');
  const clip = frise?.querySelector<SVGRectElement>('.fr-clip-rect');
  const redLayer = frise?.querySelector<SVGGElement>('.fr-red');
  const dotLayer = frise?.querySelector<SVGGElement>('.fr-dots');
  const img = frise?.querySelector<HTMLImageElement>('img');
  // The long lines of the timeline, sampled in its own units, for the dots at the present year.
  let tracks: { xs: number[]; ys: number[]; dots: SVGCircleElement[] }[] = [];
  const label = frise?.querySelector<SVGTextElement>('.fr-year');
  const svg = frise?.querySelector<SVGSVGElement>('.frise-now');
  const x1800 = Number(frise?.dataset.x1800 ?? 112), perYear = Number(frise?.dataset.perYear ?? 2.405);
  const X = (y: number) => x1800 + (y - 1800) * perYear;

  const FIRST = 7, REST = 4, RUN = 26; // seconds
  const set = (year: number) => {
    dots.forEach((d, k) => {
      const g = threads[k];
      if (year < g.start) return d.setAttribute('opacity', '0');
      const p = g.t.at(year);
      d.setAttribute('cx', p.x.toFixed(1));
      d.setAttribute('cy', p.yy.toFixed(1));
      d.setAttribute('opacity', '1');
      d.classList.toggle('is-ink', year < g.elec);
    });
    // At today the whole drawing is red, its last years to the edge included.
    if (clip) clip.setAttribute('width', year >= Y1 ? '781.746' : Math.max(0, X(year)).toFixed(2));
    const fx = X(year);
    for (const tr of tracks) {
      let n = 0;
      for (let i = 0; i < tr.xs.length - 1; i++) {
        const a = tr.xs[i], b = tr.xs[i + 1];
        if ((a <= fx && fx < b) || (b <= fx && fx < a)) {
          const k = (fx - a) / (b - a || 1);
          const d = tr.dots[n] ?? tr.dots[tr.dots.push(dotLayer!.appendChild(document.createElementNS(SVGNS, 'circle'))) - 1];
          d.setAttribute('class', 'fr-run');
          d.setAttribute('r', '1.7');
          d.setAttribute('cx', fx.toFixed(2));
          d.setAttribute('cy', (tr.ys[i] + (tr.ys[i + 1] - tr.ys[i]) * k).toFixed(2));
          d.setAttribute('opacity', '1');
          n++;
        }
      }
      for (let j = n; j < tr.dots.length; j++) tr.dots[j].setAttribute('opacity', '0');
    }
    if (now && label) {
      now.setAttribute('transform', `translate(${X(year).toFixed(2)} 0)`);
      now.setAttribute('opacity', '1');
      label.textContent = String(Math.floor(year));
      // Near the right edge the year goes to the left of the line.
      label.setAttribute('x', year > 2010 ? '-4' : '4');
      label.setAttribute('text-anchor', year > 2010 ? 'end' : 'start');
    }
  };
  // Build the red copy from the timeline's own drawing: its black lines, dots and
  // circles (not its words, its grey alternatives or its legend).
  const SVGNS = 'http://www.w3.org/2000/svg';
  if (img && redLayer && dotLayer) {
    fetch(img.currentSrc || img.src)
      .then((r) => r.text())
      .then((text) => {
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        const black = (v: string | null) => !!v && /^rgb\(0%,\s*0%,\s*0%\)$/.test(v.trim());
        const white = (v: string | null) => !!v && /^rgb\(100%,\s*100%,\s*100%\)$/.test(v.trim());
        const kept: SVGPathElement[] = [];
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
          redLayer.appendChild(p);
          kept.push(p);
        });
        // Leave out the legend, under the axis; sample the long lines for the dots.
        // (Geometry in the drawing's own units, whatever size it is shown at.)
        for (const p of kept) {
          const m = p.transform.baseVal.consolidate()?.matrix;
          const bb = p.getBBox();
          const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].map(([x, y]) =>
            m ? [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f] : [x, y]);
          const top = Math.min(...pts.map((q) => q[1]));
          const width = Math.max(...pts.map((q) => q[0])) - Math.min(...pts.map((q) => q[0]));
          if (top > 366) { p.remove(); continue; }
          if (p.getAttribute('class') !== 'fr-line' || width < 30 || top > 352) continue;
          const len = p.getTotalLength();
          const xs: number[] = [], ys: number[] = [];
          const steps = Math.min(400, Math.max(40, Math.round(len / 2)));
          for (let i = 0; i <= steps; i++) {
            const q = p.getPointAtLength((len * i) / steps);
            xs.push(m ? m.a * q.x + m.c * q.y + m.e : q.x);
            ys.push(m ? m.b * q.x + m.d * q.y + m.f : q.y);
          }
          tracks.push({ xs, ys, dots: [] });
        }
      })
      .catch(() => {});
  }

  const knot = () =>
    ring?.animate([{ transform: 'scale(1)', opacity: 0.6 }, { transform: 'scale(3.2)', opacity: 0 }], { duration: 1500, easing: 'ease-out' });

  // The automatic year, as a function of the time since it started.
  const auto = (e: number) => {
    if (e < FIRST) return Y0 + ((Y1 - Y0) * e) / FIRST;
    const c = (e - FIRST) % (REST + RUN);
    return c < REST ? Y1 : Y0 + ((Y1 - Y0) * (c - REST)) / RUN;
  };
  let t0 = performance.now(), hand = false, last = Y0, resume = 0;
  const frame = (t: number) => {
    if (!hand) {
      if (resume && t < resume) { /* waiting a moment after the hand let go */ }
      else {
        const year = auto((t - t0) / 1000);
        if (last < Y1 && year >= Y1) knot();
        last = year;
        set(year);
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  // By hand: the pointer over the timeline sets the year.
  if (svg) {
    const fromPointer = (ev: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const ux = ((ev.clientX - r.left) / r.width) * 781.746;
      return Math.min(Y1, Math.max(Y0, 1800 + (ux - x1800) / perYear));
    };
    const take = (ev: PointerEvent) => {
      hand = true;
      last = fromPointer(ev);
      set(last);
    };
    const wrap = svg.parentElement!;
    wrap.addEventListener('pointermove', take);
    wrap.addEventListener('pointerdown', take);
    wrap.addEventListener('pointerleave', () => {
      hand = false;
      // Carry on from where the hand left the year, after a short pause.
      const e = FIRST + REST + ((last - Y0) / (Y1 - Y0)) * RUN;
      resume = performance.now() + 1200;
      t0 = resume - e * 1000;
    });
  }
}
