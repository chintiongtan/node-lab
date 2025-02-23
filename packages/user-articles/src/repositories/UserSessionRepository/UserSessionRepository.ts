import { UserSessionModel } from '../../models/userSession';
import { userSessionSchema } from '../../schemas/userSession';
import { TCreateUserSessionRequest } from '../../types/api';
import { TUserSession } from '../../types/userSession';
import { DynamoDbRepository } from '../DynamoDbRepository';

export default class UserSessionRepository extends DynamoDbRepository {
  private static instance: UserSessionRepository;

  static getInstance(): UserSessionRepository {
    if (!UserSessionRepository.instance) {
      UserSessionRepository.instance = new UserSessionRepository(
        UserSessionModel,
      );
    }

    return UserSessionRepository.instance;
  }

  public async create(input: TCreateUserSessionRequest['body']): Promise<void> {
    await this.model.create({
      Login: input.user.Login,
      sk: `SESSION#${input.token}`,
      Token: input.token,
      UserId: input.user.UserId,
    });
  }

  public async getUserSessionByToken(
    token: string,
  ): Promise<TUserSession | undefined> {
    const result = await this.model
      .query({ Token: token })
      .using('TokenGlobalIndex')
      .exec();

    if (!result.length) {
      return undefined;
    }

    const { data } = userSessionSchema.safeParse(result[0]);

    return data;
  }

  public async deleteUserSessionByToken(token: string): Promise<void> {
    const userSession = await this.getUserSessionByToken(token);

    if (!userSession) {
      return;
    }

    await this.model.delete({
      Login: userSession.Login,
      sk: `SESSION#${userSession.Token}`,
    });
  }
}
