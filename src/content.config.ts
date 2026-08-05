import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const publikace = z.object({ publikovano: z.boolean(), poradi: z.number().int() });

const novinky = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/novinky' }),
  schema: z.object({
    title: z.string(), publishedAt: z.coerce.date(), summary: z.string(),
    coverImage: z.string().optional(), coverImageAlt: z.string().optional(),
    publikace, featured: z.boolean(),
    seo: z.object({ title: z.string().optional(), description: z.string().optional() }),
  }),
});
const dokumenty = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/dokumenty' }),
  schema: z.object({
    title: z.string(), category: z.enum(['stanovy', 'vyrocni-zpravy', 'ostatni']),
    year: z.number().int(), description: z.string().optional(), file: z.string(), publikace,
  }),
});
const zapisy = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/zapisy-z-jednani' }),
  schema: z.object({ title: z.string(), meetingDate: z.coerce.date(), file: z.string(), publikace }),
});
const cerpani = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/cerpani-prispevku' }),
  schema: z.object({ year: z.string().regex(/^\d{4}$/), file: z.string(), publikace }),
});

export const collections = { novinky, dokumenty, zapisy, cerpani };
