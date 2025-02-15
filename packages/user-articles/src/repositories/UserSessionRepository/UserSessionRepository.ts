import { TCreateUserSessionRequest } from '../../types/api';
import { TUserSession } from '../../types/userSession';

export default class UserSessionRepository {
  private static instance: UserSessionRepository;

  private records: Array<TUserSession>;

  private constructor() {
    this.records = [];
  }

  public static getInstance(): UserSessionRepository {
    if (!UserSessionRepository.instance) {
      UserSessionRepository.instance = new UserSessionRepository();
    }

    return UserSessionRepository.instance;
  }

  public create(input: TCreateUserSessionRequest['body']): void {
    this.records.push({
      CreatedAt: '',
      Token: input.token,
      UpdatedAt: '',
      UserId: input.user_id,
    });
  }

  public getUserSessionByToken(token: string): TUserSession | undefined {
    return this.records.find((record) => record.Token === token);
  }

  public deleteUserSessionByToken(token: string): void {
    const index = this.records.findIndex((record) => record.Token === token);

    this.records.splice(index, 1);
  }
}
