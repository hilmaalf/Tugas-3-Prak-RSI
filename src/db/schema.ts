import {
  mssqlTable,
  int,
  bit,
  nvarchar,
  decimal,
  datetime2,
} from 'drizzle-orm/mssql-core';

export const users = mssqlTable('USERS', {
  id: int('id').primaryKey().identity(),
  name: nvarchar('name', { length: 100 }).notNull(),
  email: nvarchar('email', { length: 150 }).notNull().unique(),
  passwordHash: nvarchar('password_hash', { length: 255 }).notNull(),
  role: nvarchar('role', { length: 20, enum: ['admin', 'owner', 'customer'] }).notNull(),
  createdAt: datetime2('created_at'),
});

export const stalls = mssqlTable('STALLS', {
  id: int('id').primaryKey().identity(),
  ownerId: int('owner_id').notNull().references(() => users.id),
  name: nvarchar('name', { length: 100 }).notNull(),
  category: nvarchar('category', { length: 50 }),
  location: nvarchar('location', { length: 100 }),
  description: nvarchar('description', { length: 'max' }),
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }).notNull(),
  reviewCount: int('review_count').notNull(),
  createdAt: datetime2('created_at'),
});

export const menuItems = mssqlTable('MENU_ITEMS', {
  id: int('id').primaryKey().identity(),
  stallId: int('stall_id').notNull().references(() => stalls.id),
  name: nvarchar('name', { length: 100 }).notNull(),
  price: int('price').notNull(),
  isAvailable: bit('is_available').notNull(),
});

export const reviews = mssqlTable('REVIEWS', {
  id: int('id').primaryKey().identity(),
  stallId: int('stall_id').notNull().references(() => stalls.id),
  userId: int('user_id').notNull().references(() => users.id),
  rating: int('rating').notNull(),
  comment: nvarchar('comment', { length: 'max' }),
  likeCount: int('like_count').notNull(),
  createdAt: datetime2('created_at'),
  updatedAt: datetime2('updated_at'),
});

export const likes = mssqlTable('LIKES', {
  id: int('id').primaryKey().identity(),
  reviewId: int('review_id').notNull().references(() => reviews.id),
  userId: int('user_id').notNull().references(() => users.id),
  createdAt: datetime2('created_at'),
});

export const flags = mssqlTable('FLAGS', {
  id: int('id').primaryKey().identity(),
  reviewId: int('review_id').notNull().references(() => reviews.id),
  reportedBy: int('reported_by').notNull().references(() => users.id),
  reason: nvarchar('reason', { length: 255 }),
  status: nvarchar('status', { length: 20, enum: ['pending', 'resolved', 'dismissed'] }).notNull(),
  createdAt: datetime2('created_at'),
});

export const auditLogs = mssqlTable('AUDIT_LOGS', {
  id: int('id').primaryKey().identity(),
  userId: int('user_id').notNull().references(() => users.id),
  action: nvarchar('action', { length: 50 }).notNull(),
  targetTable: nvarchar('target_table', { length: 50 }).notNull(),
  targetId: int('target_id').notNull(),
  metadata: nvarchar('metadata', { length: 'max' }),
  createdAt: datetime2('created_at'),
});
