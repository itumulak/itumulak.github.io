import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});
