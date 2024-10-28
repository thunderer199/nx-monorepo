import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './libs/shared/types-new/src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
  strict: true,
  schemaFilter: process.env.DATABASE_SCHEMA || 'public', // Specify schema for migrations
} satisfies Config;
