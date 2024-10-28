import { z } from 'zod';

const serviceConfigSchema = z.object({
  port: z.coerce.number().positive(),
  host: z.string().min(1),
  timeout: z.coerce.number().positive(),
});

const databaseConfigSchema = z.object({
  url: z.string().url(),
  schema: z.string().min(1),
  poolMin: z.coerce.number().min(0),
  poolMax: z.coerce.number().positive(),
});

export const environmentSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']),
  database: databaseConfigSchema,
  apiGateway: serviceConfigSchema,
  userService: serviceConfigSchema,
});
