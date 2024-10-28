import { User, NewUser } from './schema';

export interface BaseRepository<T, K> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: K): Promise<T>;
  update(id: string, data: Partial<K>): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface UserRepository extends BaseRepository<User, NewUser> {
  findByEmail(email: string): Promise<User | null>;
  softDelete(id: string): Promise<void>;
  findAllActive(): Promise<User[]>;
}
