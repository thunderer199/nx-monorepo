import { Injectable } from '@nestjs/common';
import { DatabaseConfig } from '@microservices-app/shared/backend';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, isNull, and } from 'drizzle-orm';
import { 
  User, 
  NewUser,
  users 
} from '@microservices-app/shared/types';
import { NotFoundError } from '@microservices-app/shared/types';

@Injectable()
export class UserRepository {
  private db: NodePgDatabase;

  constructor(private readonly dbConfig: DatabaseConfig) {
    this.db = dbConfig.createConnection();
  }

  async findById(id: string): Promise<User | null> {
    const results = await this.db
      .select()
      .from(users)
      .where(and(
        eq(users.id, id),
        isNull(users.deletedAt)
      ))
      .limit(1);
    
    return results[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await this.db
      .select()
      .from(users)
      .where(and(
        eq(users.email, email),
        isNull(users.deletedAt)
      ))
      .limit(1);
    
    return results[0] || null;
  }

  async findAll(): Promise<User[]> {
    return this.db
      .select()
      .from(users)
      .where(isNull(users.deletedAt));
  }

  async create(data: NewUser): Promise<User> {
    const results = await this.db
      .insert(users)
      .values(data)
      .returning();
    
    return results[0];
  }

  async update(id: string, data: Partial<NewUser>): Promise<User> {
    const results = await this.db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(and(
        eq(users.id, id),
        isNull(users.deletedAt)
      ))
      .returning();

    const result = results[0];
    if (!result) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return result;
  }

  async softDelete(id: string): Promise<void> {
    const results = await this.db
      .update(users)
      .set({ 
        deletedAt: new Date(),
        updatedAt: new Date()
      })
      .where(and(
        eq(users.id, id),
        isNull(users.deletedAt)
      ))
      .returning();

    if (!results[0]) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
  }

  async hardDelete(id: string): Promise<void> {
    const results = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!results[0]) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
  }
}
