import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  createStallSchema,
  idParamSchema,
  stallQuerySchema,
  updateStallSchema,
} from '../schemas/stallSchema.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';
import { createReviewSchema } from '../schemas/reviewSchema.ts';

const registry = new OpenAPIRegistry();

// Security Scheme Bearer JWT
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Masukkan token JWT dari endpoint POST /api/v1/auth/login',
});

const secured = [{ bearerAuth: [] }];

// Komponen Schema Respons & Input
const stallSchema = registry.register(
  'Stall',
  z.object({
    id: z.number().openapi({ example: 1 }),
    ownerId: z.number().openapi({ example: 2 }),
    name: z.string().openapi({ example: 'Warung Bu Tini' }),
    category: z.string().nullable().openapi({ example: 'Kwetiau' }),
    location: z.string().nullable().openapi({ example: 'Kantin FKIP' }),
    description: z.string().nullable().openapi({ example: 'Kedai kwetiau goreng & kuah' }),
    avgRating: z.number().openapi({ example: 4.5 }),
    reviewCount: z.number().openapi({ example: 2 }),
    isPopular: z.boolean().openapi({ example: false }),
  }),
);

const menuSchema = registry.register(
  'Menu',
  z.object({
    id: z.number().openapi({ example: 1 }),
    stallId: z.number().openapi({ example: 2 }),
    name: z.string().openapi({ example: 'Kwetiau Goreng Spesial' }),
    price: z.number().openapi({ example: 15000 }),
    isAvailable: z.boolean().openapi({ example: true }),
  }),
);

const reviewSchema = registry.register(
  'Review',
  z.object({
    id: z.number().openapi({ example: 1 }),
    stallId: z.number().openapi({ example: 1 }),
    userId: z.number().openapi({ example: 3 }),
    rating: z.number().openapi({ example: 5 }),
    comment: z.string().nullable().openapi({ example: 'Enak banget!' }),
    likeCount: z.number().openapi({ example: 0 }),
    createdAt: z.string().nullable().openapi({ example: '2026-10-19T12:00:00.000Z' }),
  }),
);

const authUserSchema = registry.register(
  'AuthUser',
  z.object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Admin Kantin' }),
    email: z.string().openapi({ example: 'admin@kantin.test' }),
    role: z.enum(['admin', 'owner', 'customer']).openapi({ example: 'admin' }),
  }),
);

const errorSchema = registry.register(
  'ErrorResponse',
  z.object({
    status: z.string().openapi({ example: 'fail' }),
    message: z.string().openapi({ example: 'Validasi gagal' }),
    errors: z
      .array(z.object({ field: z.string(), message: z.string() }))
      .optional()
      .openapi({
        example: [{ field: 'name', message: 'name minimal 3 karakter' }],
      }),
  }),
);

const stallInput = registry.register('StallInput', createStallSchema);
const stallUpdate = registry.register('StallUpdate', updateStallSchema);
const registerInput = registry.register('RegisterInput', registerSchema);
const loginInput = registry.register('LoginInput', loginSchema);
const reviewInput = registry.register('ReviewInput', createReviewSchema);

const stallListResponse = registry.register(
  'StallListResponse',
  z.object({
    status: z.literal('success'),
    meta: z.object({
      page: z.number().openapi({ example: 1 }),
      limit: z.number().openapi({ example: 10 }),
      total: z.number().openapi({ example: 10 }),
    }),
    data: z.array(stallSchema),
  }),
);

const stallDetailResponse = registry.register(
  'StallDetailResponse',
  z.object({
    status: z.literal('success'),
    data: stallSchema,
  }),
);

const menuListResponse = registry.register(
  'MenuListResponse',
  z.object({
    status: z.literal('success'),
    data: z.array(menuSchema),
  }),
);

const registerResponse = registry.register(
  'RegisterResponse',
  z.object({
    status: z.literal('success'),
    data: z.object({ user: authUserSchema }),
  }),
);

const loginResponse = registry.register(
  'LoginResponse',
  z.object({
    status: z.literal('success'),
    data: z.object({
      token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
      tokenType: z.literal('Bearer'),
      expiresIn: z.string().openapi({ example: '2h' }),
      user: authUserSchema,
    }),
  }),
);

const meResponse = registry.register(
  'MeResponse',
  z.object({
    status: z.literal('success'),
    data: authUserSchema,
  }),
);

const reviewDetailResponse = registry.register(
  'ReviewDetailResponse',
  z.object({
    status: z.literal('success'),
    data: reviewSchema,
  }),
);

const unauthorizedResponse = {
  401: {
    description: 'Belum login / Token tidak ada atau tidak valid',
    content: { 'application/json': { schema: errorSchema } },
  },
};

const forbiddenResponse = {
  403: {
    description: 'Sudah login, tetapi role tidak punya akses / bukan pemilik warung',
    content: { 'application/json': { schema: errorSchema } },
  },
};

// Pendaftaran Path Endpoint Auth
registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/register',
  summary: 'Daftar akun baru (role otomatis customer)',
  request: {
    body: {
      description: 'Data pendaftaran',
      content: { 'application/json': { schema: registerInput } },
    },
  },
  responses: {
    201: { description: 'Akun berhasil dibuat', content: { 'application/json': { schema: registerResponse } } },
    400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } },
    409: { description: 'Email sudah terdaftar', content: { 'application/json': { schema: errorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/auth/login',
  summary: 'Login dan terima token JWT',
  request: {
    body: {
      description: 'Kredensial login',
      content: { 'application/json': { schema: loginInput } },
    },
  },
  responses: {
    200: { description: 'Login berhasil', content: { 'application/json': { schema: loginResponse } } },
    400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } },
    401: { description: 'Email atau password salah', content: { 'application/json': { schema: errorSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/auth/me',
  summary: 'Ambil data user dari token JWT',
  security: secured,
  responses: {
    200: { description: 'Data user dari token', content: { 'application/json': { schema: meResponse } } },
    ...unauthorizedResponse,
  },
});

// Pendaftaran Path Endpoint Stalls & Reviews
registry.registerPath({
  method: 'get',
  path: '/api/v1/stalls',
  summary: 'Daftar warung (Publik)',
  request: { query: stallQuerySchema },
  responses: {
    200: { description: 'Daftar warung + meta pagination', content: { 'application/json': { schema: stallListResponse } } },
    400: { description: 'Query parameter tidak valid', content: { 'application/json': { schema: errorSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/stalls/{id}',
  summary: 'Detail warung (Publik)',
  request: { params: idParamSchema },
  responses: {
    200: { description: 'Detail warung', content: { 'application/json': { schema: stallDetailResponse } } },
    400: { description: 'Parameter id tidak valid', content: { 'application/json': { schema: errorSchema } } },
    404: { description: 'Warung tidak ditemukan', content: { 'application/json': { schema: errorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/stalls',
  summary: 'Tambah warung (Owner, Admin)',
  security: secured,
  request: {
    body: {
      description: 'Data warung baru',
      content: { 'application/json': { schema: stallInput } },
    },
  },
  responses: {
    201: { description: 'Warung berhasil dibuat', content: { 'application/json': { schema: stallDetailResponse } } },
    400: { description: 'Body tidak valid', content: { 'application/json': { schema: errorSchema } } },
    ...unauthorizedResponse,
    ...forbiddenResponse,
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/v1/stalls/{id}',
  summary: 'Update warung (Owner pemilik warung, Admin)',
  security: secured,
  request: {
    params: idParamSchema,
    body: {
      description: 'Data warung yang diubah',
      content: { 'application/json': { schema: stallUpdate } },
    },
  },
  responses: {
    200: { description: 'Warung ter-update', content: { 'application/json': { schema: stallDetailResponse } } },
    400: { description: 'Body/parameter tidak valid', content: { 'application/json': { schema: errorSchema } } },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    404: { description: 'Warung tidak ditemukan', content: { 'application/json': { schema: errorSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/stalls/{id}',
  summary: 'Hapus warung (Khusus Admin)',
  security: secured,
  request: { params: idParamSchema },
  responses: {
    200: { description: 'Warung terhapus', content: { 'application/json': { schema: stallDetailResponse } } },
    ...unauthorizedResponse,
    ...forbiddenResponse,
    404: { description: 'Warung tidak ditemukan', content: { 'application/json': { schema: errorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/stalls/{id}/reviews',
  summary: 'Tambah review warung (Semua role yang login)',
  security: secured,
  request: {
    params: idParamSchema,
    body: {
      description: 'Data review',
      content: { 'application/json': { schema: reviewInput } },
    },
  },
  responses: {
    201: { description: 'Review berhasil dibuat', content: { 'application/json': { schema: reviewDetailResponse } } },
    400: { description: 'Input tidak valid', content: { 'application/json': { schema: errorSchema } } },
    ...unauthorizedResponse,
    404: { description: 'Warung tidak ditemukan', content: { 'application/json': { schema: errorSchema } } },
    409: { description: 'Sudah pernah memberi review untuk warung ini', content: { 'application/json': { schema: errorSchema } } },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Review Kantin API - Tugas 3',
    version: '1.0.0',
    description: 'Dokumentasi OpenAPI 3.0 untuk Validasi, Error Handling, dan Autentikasi JWT.',
  },
  servers: [{ url: 'http://localhost:3000' }],
});
