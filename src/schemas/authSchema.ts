import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const passwordSchema = z
  .string({ required_error: 'password wajib diisi' })
  .min(8, 'password minimal 8 karakter')
  .max(72, 'password maksimal 72 karakter')
  .openapi({ example: 'rahasia123', description: 'Password 8-72 karakter' });

const emailSchema = z
  .string({ required_error: 'email wajib diisi' })
  .trim()
  .toLowerCase()
  .email('format email tidak valid')
  .max(150, 'email maksimal 150 karakter')
  .openapi({ example: 'budi@test.com', description: 'Alamat email' });

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'name wajib diisi' })
      .trim()
      .min(3, 'name minimal 3 karakter')
      .max(100, 'name maksimal 100 karakter')
      .openapi({ example: 'Budi Santoso', description: 'Nama lengkap (3-100 karakter)' }),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict({ message: 'body hanya boleh berisi name, email, dan password' });

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z
      .string({ required_error: 'password wajib diisi' })
      .min(1, 'password wajib diisi')
      .openapi({ example: 'rahasia123' }),
  })
  .strict({ message: 'body hanya boleh berisi email dan password' });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
