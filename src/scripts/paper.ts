// What an essay page does once loaded.
//   1. Notes in the margin: each numbered call (a superscript link to a
//      reference or a footnote) brings its reference into the right margin,
//      level with the line that calls it, once per paragraph. Notes never
//      overlap: one that would is pushed down. Wide screens only (the CSS
//      hides them otherwise); the list at the end stays the reference.
//   2. The reading brush: a thin red line at the top of the window grows with
//      the reading and closes on the open circle at the last line.
//   3. Citing: the two buttons copy the APA or the BibTeX form.

const body = document.querySelector<HTMLElement>('.paper-body');

// 1. Notes in the margin.
const notes: { note: HTMLElement; call: HTMLElement; host: HTMLElement }[] = [];
if (body) {
  const calls = body.querySelectorAll<HTMLAnchorElement>('sup > a[href^="#"], a[data-footnote-ref]');
  for (const a of calls) {
    const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    const host = a.closest<HTMLElement>('p, li, blockquote');
    if (!target || !host || target.closest('.paper-body') !== body || host.closest('.references, ol:has(> li > [id^="ref-"])')) continue;
    const id = a.hash;
    // Once per paragraph, and not again in the paragraph right after the one that showed it.
    if (host.querySelector(`.sidenote[data-for="${CSS.escape(id)}"]`)) continue;
    const prev = host.previousElementSibling;
    if (prev && prev.querySelector(`.sidenote[data-for="${CSS.escape(id)}"]`)) continue;
    const source = (target.closest('li') ?? target.parentElement ?? target).cloneNode(true) as HTMLElement;
    // Keep the words, drop the addresses and the back-links.
    source.querySelectorAll('a').forEach((l) => {
      const text = l.textContent ?? '';
      if (/^https?:|^doi:|↩/.test(text.trim()) || l.hasAttribute('data-footnote-backref')) l.remove();
      else l.replaceWith(...l.childNodes);
    });
    source.querySelectorAll('.mend, [id]').forEach((el) => (el.classList.contains('mend') ? el.remove() : el.removeAttribute('id')));
    const note = document.createElement('aside');
    note.className = 'sidenote';
    note.dataset.for = id;
    note.setAttribute('aria-hidden', 'true'); // the list at the end remains what assistive technology reads
    const num = document.createElement('span');
    num.className = 'sidenote-num';
    num.textContent = a.textContent ?? '';
    note.append(num, ' ', ...Array.from(source.childNodes));
    host.classList.add('has-sidenote');
    host.append(note);
    notes.push({ note, call: a, host });
  }
}
const place = () => {
  let floor = -Infinity;
  for (const { note, call, host } of notes) {
    if (getComputedStyle(note).display === 'none') return;
    const top = call.getBoundingClientRect().top - host.getBoundingClientRect().top - 2;
    const pageTop = host.getBoundingClientRect().top + scrollY + top;
    const y = Math.max(pageTop, floor);
    note.style.top = `${y - (host.getBoundingClientRect().top + scrollY)}px`;
    floor = y + note.offsetHeight + 12;
  }
};
if (notes.length) {
  place();
  addEventListener('resize', place);
  document.fonts?.ready.then(place);
  addEventListener('load', place);
}

// 2. The reading brush.
const brush = document.querySelector<HTMLElement>('.read-brush');
if (brush && body) {
  let queued = false;
  const update = () => {
    queued = false;
    const r = body.getBoundingClientRect();
    const span = r.height - innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (-r.top + innerHeight * 0.2) / Math.max(1, span)));
    brush.style.setProperty('--read', p.toFixed(4));
    brush.classList.toggle('is-done', p >= 0.995);
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();
}

// 3. Citing.
document.querySelectorAll<HTMLButtonElement>('.paper-cite button[data-copy]').forEach((b) => {
  b.addEventListener('click', async () => {
    const done = b.parentElement?.querySelector<HTMLElement>('.cite-done');
    try {
      await navigator.clipboard.writeText(b.dataset.copy ?? '');
      if (done) done.textContent = 'Copied.';
    } catch {
      if (done) done.textContent = 'Select the text above to copy it.';
    }
    setTimeout(() => done && (done.textContent = ''), 2400);
  });
});
