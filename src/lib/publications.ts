import { Cite } from '@citation-js/core';
import '@citation-js/plugin-bibtex';
import bib from '../data/publications.bib?raw';
import { site } from '../site';

export interface Publication {
  id: string;
  group: string;
  year: number;
  title: string;
  authors: { name: string; self: boolean }[];
  venue?: string;
  note?: string;
  link?: string;
  linkLabel?: string;
  selected: boolean;
}

const GROUPS: Record<string, string> = {
  'article-journal': 'Journal articles',
  'paper-conference': 'Conference papers',
  report: 'Reports',
};
export const GROUP_ORDER = ['Journal articles', 'Conference papers', 'Preprints and working papers', 'Reports'];

const selfFamily = site.author.split(' ').pop()!.toLowerCase();

const records: any[] = new Cite(bib).data;

export const publications: Publication[] = records
  .map((r) => {
    const doi = r.DOI as string | undefined;
    return {
      id: r.id,
      group: GROUPS[r.type] ?? 'Preprints and working papers',
      year: r.issued?.['date-parts']?.[0]?.[0] ?? 0,
      title: r.title,
      authors: (r.author ?? []).map((a: any) => {
        const family = [a['non-dropping-particle'], a.family].filter(Boolean).join(' ');
        return {
          name: a.literal ?? [a.given, family].filter(Boolean).join(' '),
          self: (a.family ?? '').toLowerCase() === selfFamily,
        };
      }),
      venue: r['container-title'] ?? r.publisher,
      note: r.note,
      link: doi ? `https://doi.org/${doi}` : r.URL,
      linkLabel: doi ? `doi:${doi}` : r.URL?.replace(/^https?:\/\//, ''),
      selected: String(r.keyword ?? '').split(/[,;]\s*/).includes('selected'),
    };
  })
  .sort((a, b) => b.year - a.year);

export const publicationsByGroup = GROUP_ORDER.map((group) => ({
  group,
  items: publications.filter((p) => p.group === group),
})).filter((g) => g.items.length > 0);
