// The history page keeps one present year for its two drawings. The threads
// carry a dot each at that year (in ink while the function works without
// electricity, red after); the timeline below turns red up to the same year
// (src/scripts/frise-core.ts). The year first runs from 1790 to today in seven
// seconds, in step with the threads drawing themselves, then rests at today,
// when the knot rings, and runs again, slowly. Moving over the timeline takes
// the year in hand.
import { Y0, Y1, geometry, thread } from '../lib/swirl';
import { mountFrise } from './frise-core';

const swirl = document.querySelector<HTMLElement>('.swirl');
const frise = document.querySelector<HTMLElement>('.frise[data-sync]');
if (swirl || frise) {
  const threads = geometry.map((g) => ({ ...g, t: thread(g.base) }));
  const dots = [...document.querySelectorAll<SVGCircleElement>('.sw-now-dot')];
  const ring = document.querySelector<SVGCircleElement>('.sw-ring');
  const tl = frise ? mountFrise(frise) : null;

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
    tl?.set(year);
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
    if (!hand && !(resume && t < resume)) {
      const year = auto((t - t0) / 1000);
      if (last < Y1 && year >= Y1) knot();
      last = year;
      set(year);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  // By hand: the pointer over the timeline sets the year, for both drawings.
  tl?.onHand((y) => {
    if (y === null) {
      hand = false;
      // Carry on from where the hand left the year, after a short pause.
      const e = FIRST + REST + ((last - Y0) / (Y1 - Y0)) * RUN;
      resume = performance.now() + 1200;
      t0 = resume - e * 1000;
    } else {
      hand = true;
      last = Math.min(Y1, y);
      set(last);
    }
  });
}
