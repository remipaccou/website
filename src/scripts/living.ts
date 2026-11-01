// The site lives. Now and then one of the small red signs on screen passes its
// stroke again, one at a time and never on a beat; on the home page a letter of
// the Greek names sometimes takes the red ink and gives it back. A sign first
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

// Letters of the Greek names, one span each.
const greek = document.querySelector('.greek');
const letters: HTMLElement[] = [];
if (greek) {
  const seg = 'Segmenter' in Intl ? new Intl.Segmenter('el', { granularity: 'grapheme' }) : null;
  greek.querySelectorAll('a').forEach((a) => {
    const word = a.textContent ?? '';
    a.setAttribute('aria-label', word);
    a.textContent = '';
    const parts = seg ? [...seg.segment(word)].map((g) => g.segment) : Array.from(word);
    for (const g of parts) {
      const span = document.createElement('span');
      span.className = 'letter';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = g;
      a.append(span);
      letters.push(span);
    }
  });
}
const ink = (el: HTMLElement) => {
  const from = getComputedStyle(el).color;
  const red = getComputedStyle(document.documentElement).getPropertyValue('--sun').trim() || '#b8322a';
  el.animate([{ color: from }, { color: red, offset: 0.25 }, { color: red, offset: 0.6 }, { color: from }], { duration: 3600, easing: 'ease-in-out' });
};

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
if (greek) io.observe(greek);

// One sign or one letter every three to six seconds, chosen at random.
const tick = () => {
  if (!document.hidden) {
    const signs = [...visible].filter((v) => v.matches('.sigil'));
    const useLetter = letters.length > 0 && visible.has(greek!) && (signs.length === 0 || Math.random() < 0.35);
    if (useLetter) ink(letters[Math.floor(Math.random() * letters.length)]);
    else if (signs.length) pass(signs[Math.floor(Math.random() * signs.length)]);
  }
  setTimeout(tick, 3000 + Math.random() * 3000);
};
setTimeout(tick, 4500);
