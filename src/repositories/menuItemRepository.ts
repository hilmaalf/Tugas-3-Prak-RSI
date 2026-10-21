import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';

export interface CreateMenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export class MenuItemRepository {
  // JOIN ke STALLS supaya response ikut menampilkan nama warung.
  async findAllWithStall() {
    const db = await getDb();
    return db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
        stallName: stalls.name,
      })
      .from(menuItems)
      .leftJoin(stalls, eq(menuItems.stallId, stalls.id));
  }

  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId));
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return rows[0];
  }

  async create(input: CreateMenuItemInput) {
    const db = await getDb();
    const rows = await db
      .insert(menuItems)
      .output()
      .values({
        stallId: input.stallId,
        name: input.name,
        price: input.price,
        isAvailable: input.isAvailable ?? true,
      });
    return rows[0];
  }

  async update(id: number, input: Partial<CreateMenuItemInput>) {
    const db = await getDb();
    const rows = await db
      .update(menuItems)
      .set({
        ...(input.stallId !== undefined ? { stallId: input.stallId } : {}),
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.isAvailable !== undefined ? { isAvailable: input.isAvailable } : {}),
      })
      .where(eq(menuItems.id, id))
      .output();
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(menuItems).where(eq(menuItems.id, id)).output();
    return rows[0];
  }
}
