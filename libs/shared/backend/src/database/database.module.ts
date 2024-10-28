import { Module, Global } from '@nestjs/common';
import { DatabaseConfig } from './database.config';

@Global()
@Module({
  providers: [DatabaseConfig],
  exports: [DatabaseConfig],
})
export class DatabaseModule {}
