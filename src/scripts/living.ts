// The site lives. Now and then one of the small red signs on screen passes its
// stroke again, one at a time and never on a beat. A sign first
// seen lower on the page draws itself when it comes into view, not at load,
// when nobody was there to see it. The circle by the name and the signs of the
// fields keep their own rhythm (see the CSS) and are left out here.

const EASE = 'cubic-bezier(0.6, 0, 0.2, 1)';
const paths = (s: Element) => [...s.querySelectorAll<SVGPathElement>('path')];

const draw = (s: Element) =>
  paths(s).forEach((p, i) =>
    p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1500, delay: i * 250, easing: EASE, fill: 'backwards' }),
  );

// The line withdraws from its start, then is drawn again (a dash offset of -2 is
// one full period of the pattern, so the sign ends exactly as it began).
const pass = (s: Element) =>
  paths(s).forEach((p, i) =>
    p.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -2 }], { duration: 1600, delay: i * 220, easing: 'ease-in-out' }),
  );

// What is on screen.
const visible = new Set<Element>();
const seen = new WeakSet<Element>();
const opened = performance.now();
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        if (!seen.has(e.target) && e.target.matches('.sigil') && performance.now() - opened > 1200) draw(e.target);
        seen.add(e.target);
        visible.add(e.target);
      } else visible.delete(e.target);
    }
  },
  { threshold: 0.5 },
);
document.querySelectorAll('.sigil:not(.site-mark):not(.field-nav .sigil)').forEach((s) => io.observe(s));

// One sign every eight to fourteen seconds, chosen at random: the site lives, quietly.
const tick = () => {
  if (!document.hidden) {
    const signs = [...visible].filter((v) => v.matches('.sigil'));
    if (signs.length) pass(signs[Math.floor(Math.random() * signs.length)]);
  }
  setTimeout(tick, 8000 + Math.random() * 6000);
};
setTimeout(tick, 6000);
