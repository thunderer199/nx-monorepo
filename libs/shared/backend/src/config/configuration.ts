import { environmentSchema } from '@microservices-app/shared/types';
import { ConfigFactory } from '@nestjs/config';

export const loadConfiguration: ConfigFactory = () => {
  const config = {
    nodeEnv: process.env['NODE_ENV'] || 'development',
    database: {
      url: process.env['DATABASE_URL'],
      schemaName: process.env['NODE_ENV'] === 'test' 
        ? process.env['TEST_DATABASE_SCHEMA'] 
        : process.env['DATABASE_SCHEMA'] || 'public',  // Default to 'public' schema
      poolMin: process.env['DATABASE_POOL_MIN'],
      poolMax: process.env['DATABASE_POOL_MAX'],
    },
    apiGateway: {
      port: process.env['API_GATEWAY_PORT'],
      host: process.env['API_GATEWAY_HOST'],
      timeout: process.env['SERVICE_TIMEOUT'],
    },
    userService: {
      port: process.env['USER_SERVICE_PORT'],
      host: process.env['USER_SERVICE_HOST'],
      timeout: process.env['SERVICE_TIMEOUT'],
    },
  };

  const result = environmentSchema.safeParse(config);

  if (!result.success) {
    console.error('❌ Invalid environment configuration');
    console.error(result.error.format());
    throw new Error('Invalid environment configuration');
  }

  return result.data;
};
