// Astro 7 requires this at src/content.config.ts (the legacy src/content/config.ts path is rejected).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  // image() resolves the path against src/assets and hands Astro the dimensions,
  // so <Image> can emit width/height and avoid layout shift.
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      link: z.string(),
      screenshot: image().optional(),
      repoUrl: z.string().optional(),
    }),
});

export const collections = { articles, tools };
