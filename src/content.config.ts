import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per essay: src/content/writing/YYYY-MM-DD-slug/index.md
// The folder name gives the public address: /YYYY/MM/DD/slug/
const writing = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/writing' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string(),
      topic: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      // Optional figure shown with the essay when it leads the home page.
      lead: image().optional(),
      leadAlt: z.string().default(''),
      draft: z.boolean().default(false),
      responses: z
        .array(z.object({ author: z.string(), date: z.coerce.date(), body: z.string() }))
        .default([]),
    }),
});

export const collections = { writing };
