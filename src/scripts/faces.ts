// The two faces of the economics page: a face is chosen by its heading (or by the address,
// #meso or #macro); the chosen one opens, the other folds into a strip. Choosing the open
// face again brings both back side by side.
const faces = document.querySelector<HTMLElement>('[data-faces]');
if (faces) {
  const sides = [...faces.querySelectorAll<HTMLElement>('[data-face]')];
  const set = (which: string | null, keepScroll = false) => {
    if (which) faces.dataset.open = which; else delete faces.dataset.open;
    for (const side of sides) {
      const open = side.dataset.face === which;
      side.classList.toggle('is-open', open);
      side.classList.toggle('is-closed', !!which && !open);
      side.querySelector<HTMLElement>('.face-body')!.hidden = !open;
      side.querySelector('.face-btn')!.setAttribute('aria-expanded', String(open));
    }
    history.replaceState(null, '', which ? `#${which}` : location.pathname + location.search);
    if (!keepScroll && faces.getBoundingClientRect().top < 0) faces.scrollIntoView({ block: 'start' });
  };
  // The heading toggles its face; a folded strip opens wherever it is clicked.
  for (const side of sides) {
    const me = side.dataset.face!;
    side.addEventListener('click', (e) => {
      if ((e.target as Element).closest('.face-btn')) set(faces.dataset.open === me ? null : me);
      else if (side.classList.contains('is-closed')) set(me);
    });
  }
  const fromHash = () => {
    const h = location.hash.slice(1);
    if (sides.some((s) => s.dataset.face === h)) set(h, true);
  };
  fromHash();
  addEventListener('hashchange', fromHash);
}
