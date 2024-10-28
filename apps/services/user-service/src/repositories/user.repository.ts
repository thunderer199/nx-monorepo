import { Injectable } from '@nestjs/common';
import { DatabaseConfig } from '@microservices-app/shared/backend';
import { 
  User, 
  NewUser, 
  UserRepository,
  users 
} from '@microservices-app/shared/types';
import { BaseRepositoryImpl } from '@microservices-app/shared/backend';
import { eq, isNull } from 'drizzle-orm';

@Injectable()
export class UserRepositoryImpl 
  extends BaseRepositoryImpl<User, NewUser> 
  implements UserRepository 
{
  constructor(private readonly dbConfig: DatabaseConfig) {
    super(dbConfig.createConnection(), users);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result[0] || null;
  }

  async softDelete(id: string): Promise<void> {
    await this.update(id, { deletedAt: new Date() });
  }

  async findAllActive(): Promise<User[]> {
    return this.db
      .select()
      .from(users)
      .where(isNull(users.deletedAt));
  }

  // Override findAll to exclude soft-deleted records
  async findAll(): Promise<User[]> {
    return this.findAllActive();
  }

  // Override findById to exclude soft-deleted records
  async findById(id: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .where(isNull(users.deletedAt))
      .limit(1);
    
    return result[0] || null;
  }
}
