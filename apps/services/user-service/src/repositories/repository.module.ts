import { Module } from '@nestjs/common';
import { DatabaseModule } from '@microservices-app/backend-new';
import { UserRepository } from './user.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
