import rss from '@astrojs/rss';
import { site } from '../site';
import { href } from '../lib/url';
import { getEssays, pathOf } from '../lib/writing';

export async function GET(context) {
  const essays = await getEssays();
  return rss({
    title: `${site.author}: Information, energy and ecology`,
    description: 'Essays by Rémi Paccou on information, energy and ecology.',
    site: new URL(href('/'), context.site),
    items: essays.map((essay) => ({
      title: essay.data.title,
      pubDate: essay.data.date,
      description: essay.data.description,
      link: new URL(href(pathOf(essay)), context.site).href,
    })),
  });
}
