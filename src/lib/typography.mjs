// Unicode superscript and subscript characters (10²⁵, E₀) are drawn unevenly
// by most text fonts. These helpers turn them into real <sup>/<sub> markup,
// so they can be typed directly in Markdown and still look right.
const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '−' };
const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '₊': '+', '₋': '−' };
const RUN = /([⁰¹²³⁴-⁹⁺⁻]+)|([₀-₉₊₋]+)/g;

/** Splits text into plain, sup and sub parts. */
export function splitScripts(text) {
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(RUN)) {
    if (m.index > last) parts.push({ kind: 'text', value: text.slice(last, m.index) });
    const map = m[1] ? SUP : SUB;
    parts.push({ kind: m[1] ? 'sup' : 'sub', value: [...m[0]].map((c) => map[c]).join('') });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', value: text.slice(last) });
  return parts;
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Plain text to an HTML string with <sup>/<sub>. */
export const scriptsToHtml = (text) =>
  splitScripts(text)
    .map((p) => (p.kind === 'text' ? escape(p.value) : `<${p.kind}>${escape(p.value)}</${p.kind}>`))
    .join('');
