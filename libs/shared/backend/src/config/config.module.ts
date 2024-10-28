import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { loadConfiguration } from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [loadConfiguration],
      cache: true,
      isGlobal: true,
      expandVariables: true,
    }),
  ],
})
export class ConfigModule {}
