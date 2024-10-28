import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { EnvironmentConfig } from '@microservices-app/shared/types';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService<EnvironmentConfig>) {}

  async createConnection(): Promise<NodePgDatabase> {
    const dbConfig = this.configService.get('database', { infer: true });
    
    const pool = new Pool({
      connectionString: dbConfig?.url,
      min: dbConfig?.poolMin,
      max: dbConfig?.poolMax,
    });

    // Set the search_path for the connection
    await pool.query(`SET search_path TO "${dbConfig?.schemaName}"`);

    const db = drizzle(pool);

    // Run migrations in development/test environments
    if (process.env['NODE_ENV'] !== 'production') {
      try {
        await migrate(db, { 
          migrationsFolder: 'drizzle',
          migrationsSchema: dbConfig?.schemaName, // Specify schema for migrations table
        });
        console.log('✅ Migrations applied successfully');
      } catch (error) {
        console.error('❌ Error applying migrations:', error);
        throw error;
      }
    }

    return db;
  }

  // Helper method to ensure schema exists
  async ensureSchema() {
    const dbConfig = this.configService.get('database', { infer: true });
    const pool = new Pool({ connectionString: dbConfig?.url });

    try {
      await pool.query(`
        CREATE SCHEMA IF NOT EXISTS "${dbConfig?.schemaName}";
      `);
      console.log(`✅ Schema "${dbConfig?.schemaName}" ensured`);
    } catch (error) {
      console.error('❌ Error ensuring schema:', error);
      throw error;
    } finally {
      await pool.end();
    }
  }
}
