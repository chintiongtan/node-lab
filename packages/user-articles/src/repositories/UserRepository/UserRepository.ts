import { CreateUserInput, User } from '../../types/user';

export default class UserRepository {
  private static instance: UserRepository;

  private records: Array<User>;

  private constructor() {
    this.records = [];
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }

    return UserRepository.instance;
  }

  public create(input: CreateUserInput): void {
    this.records.push({
      user_id: input.user_id,
      login: input.login,
      password: input.password,
    });
  }

  public getUserByLogin(login: string): User | undefined {
    return this.records.find((record) => record.login === login);
  }
}
