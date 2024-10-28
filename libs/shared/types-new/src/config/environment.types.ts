export interface DatabaseConfig {
  url: string;
  schemaName: string;  // Changed from 'schema' to 'schemaName' for clarity
  poolMin: number;
  poolMax: number;
}

export interface ServiceConfig {
  port: number;
  host: string;
  timeout: number;
}

export interface EnvironmentConfig {
  nodeEnv: 'development' | 'test' | 'production';
  database: DatabaseConfig;
  apiGateway: ServiceConfig;
  userService: ServiceConfig;
}
