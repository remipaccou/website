import { getEssays, pathOf } from './writing';
import { publications } from './publications';
import { talks } from '../data/talks';
import { notices as manual } from '../data/notices';
import { href } from './url';

export interface Notice { sort: number; label: string; kind: string; text: string; detail?: string; url?: string }

// 'YYYY-MM' or 'YYYY-MM-DD' gives a sort key and the label 'YYYY.MM'.
const parse = (date: string) => {
  const [y, m = '01', d = '01'] = date.split('-');
  return { sort: Date.UTC(+y, +m - 1, +d), label: date.length > 4 ? `${y}.${m}` : y };
};

export async function getNotices(limit = 7): Promise<Notice[]> {
  const essays = (await getEssays()).map((e) => ({
    ...parse(e.data.date.toISOString().slice(0, 10)),
    kind: 'Essay',
    text: e.data.title,
    url: href(pathOf(e)),
  }));
  // Papers carry a year only: they sort at the start of that year.
  const papers = publications.map((p) => ({
    ...parse(String(p.year)),
    kind: 'Paper',
    text: p.title,
    detail: p.venue ?? p.note,
    url: p.link,
  }));
  const spoken = talks.map((t) => ({
    ...parse(t.date),
    kind: 'Talk',
    text: t.title,
    detail: [t.event, t.place].filter(Boolean).join(', '),
    url: t.url,
  }));
  const written = manual.map((n) => ({ ...parse(n.date), kind: n.kind, text: n.text, detail: n.detail, url: n.url }));
  return [...written, ...spoken, ...essays, ...papers].sort((a, b) => b.sort - a.sort).slice(0, limit);
}
