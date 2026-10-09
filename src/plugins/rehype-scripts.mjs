// Applies src/lib/typography.mjs to every text node of a Markdown page,
// leaving code and rendered equations untouched.
import { splitScripts } from '../lib/typography.mjs';

const SKIP = new Set(['code', 'pre', 'script', 'style', 'math', 'svg']);

export default function rehypeScripts() {
  return (tree) => walk(tree);
}

function walk(node) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      const parts = splitScripts(child.value);
      if (parts.length === 1 && parts[0].kind === 'text') { next.push(child); continue; }
      for (const p of parts) {
        next.push(
          p.kind === 'text'
            ? { type: 'text', value: p.value }
            : { type: 'element', tagName: p.kind, properties: { className: ['script'] }, children: [{ type: 'text', value: p.value }] },
        );
      }
      continue;
    }
    if (child.type === 'element') {
      const cls = child.properties?.className;
      const isKatex = Array.isArray(cls) && cls.some((c) => String(c).startsWith('katex'));
      if (!SKIP.has(child.tagName) && !isKatex) walk(child);
    }
    next.push(child);
  }
  node.children = next;
}
