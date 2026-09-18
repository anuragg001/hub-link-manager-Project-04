import { z } from 'zod';

export const bioSchema = z.object({
  displayName: z.string().min(1),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  theme: z.enum(['Minimal Light', 'Dark Slate', 'Gradient']).optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url()
  })).optional()
});