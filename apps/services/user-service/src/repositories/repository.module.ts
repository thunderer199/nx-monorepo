import { Module } from '@nestjs/common';
import { DatabaseModule } from '@microservices-app/shared/backend';
import { UserRepositoryImpl } from './user.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
  ],
  exports: ['UserRepository'],
})
export class RepositoryModule {}
