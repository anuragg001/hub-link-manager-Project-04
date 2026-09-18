import { z } from 'zod';

export const createLinkSchema = z.object({
  destinationUrl: z.string().url(),
  vanitySlug: z.string().optional()
});