import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '../user.repository';
import { loadConfiguration, DatabaseModule } from '@microservices-app/backend-new';
import { NewUser } from '@microservices-app/types-new';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [loadConfiguration],
        }),
        DatabaseModule,
      ],
      providers: [UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  it('should create a user', async () => {
    const newUser: NewUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const user = await repository.create(newUser);
    expect(user).toBeDefined();
    expect(user.email).toBe(newUser.email);
  });

  // Add more tests...
});
