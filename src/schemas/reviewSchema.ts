import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const createReviewSchema = z
  .object({
    rating: z.coerce
      .number({ invalid_type_error: 'rating harus berupa angka' })
      .int('rating harus bilangan bulat')
      .min(1, 'rating minimal 1')
      .max(5, 'rating maksimal 5')
      .openapi({ example: 4, description: 'Rating 1 sampai 5' }),
    comment: z
      .string()
      .trim()
      .max(1000, 'comment maksimal 1000 karakter')
      .nullable()
      .optional()
      .openapi({ example: 'Kwetiaunya enak banget!', description: 'Komentar opsional' }),
  })
  .strict({ message: 'body hanya boleh berisi rating dan comment' });

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
