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
    if (now && label) {
      now.setAttribute('transform', `translate(${X(year).toFixed(2)} 0)`);
      now.setAttribute('opacity', '1');
      label.textContent = String(Math.floor(year));
      // Near the right edge the year goes to the left of the line.
      label.setAttribute('x', year > 2010 ? '-4' : '4');
      label.setAttribute('text-anchor', year > 2010 ? 'end' : 'start');
    }
  };
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
