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
      // The field the essay is filed under.
      theme: z.enum(['history', 'economics', 'biophysics', 'climate', 'philosophy']).optional(),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      draft: z.boolean().default(false),
      // Corrections made after publication, shown at the end of the essay; the
      // paragraphs concerned carry a mark (<span class="mend">) and a red seam.
      revisions: z.array(z.object({ date: z.coerce.date(), note: z.string() })).default([]),
      // A timeline of the essay (an id of src/data/frises.ts), set where the text
      // holds <div class="frise-slot" data-frise="id"></div>, else after the text.
      frise: z.enum(['californian']).optional(),
    }),
});

export const collections = { writing };
