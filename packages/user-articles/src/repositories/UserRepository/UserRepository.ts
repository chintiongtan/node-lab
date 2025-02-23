import { UserModel } from '../../models/user';
import { userSchema } from '../../schemas/user';
import { TCreateUserRequest } from '../../types/api';
import { TUser } from '../../types/user';
import { DynamoDbRepository } from '../DynamoDbRepository';

export default class UserRepository extends DynamoDbRepository {
  private static instance: UserRepository;

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(UserModel);
    }

    return UserRepository.instance;
  }

  public async create(input: TCreateUserRequest['body']): Promise<void> {
    const { login: Login, password: Password, user_id: UserId } = input;

    await this.model.create({
      Login,
      Password,
      UserId,
    });
  }

  public async getUserByLogin(login: string): Promise<TUser | undefined> {
    const result = await this.model.query({ Login: login, sk: 'ROOT' }).exec();

    if (!result.length) {
      return undefined;
    }

    const { data } = userSchema.safeParse(result[0]);

    return data;
  }
}
