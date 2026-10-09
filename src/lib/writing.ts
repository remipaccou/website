import { getCollection, type CollectionEntry } from 'astro:content';

export type Essay = CollectionEntry<'writing'>;

const pad = (n: number) => String(n).padStart(2, '0');

// "2025-12-12-my-essay" gives the slug "my-essay".
export const slugOf = (essay: Essay) => essay.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');

export const dateParts = (date: Date) => ({
  year: String(date.getUTCFullYear()),
  month: pad(date.getUTCMonth() + 1),
  day: pad(date.getUTCDate()),
});

// Same address scheme as the former WordPress site: /YYYY/MM/DD/slug/
export const pathOf = (essay: Essay) => {
  const { year, month, day } = dateParts(essay.data.date);
  return `/${year}/${month}/${day}/${slugOf(essay)}/`;
};

export const longDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const readingMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 230));

export async function getEssays() {
  const all = await getCollection('writing', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
