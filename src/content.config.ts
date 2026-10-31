import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
    // Keep the historical filename, including Chinese slugs and the "featurs" typo.
    generateId: ({ entry }) => entry.replace(/\\/g, '/').replace(/\.(md|mdx)$/i, ''),
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    series: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
