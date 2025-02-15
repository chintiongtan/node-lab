import { config } from '../../config';
import { userSessionSchema } from '../../schemas/userSession';
import { TCreateUserSessionRequest } from '../../types/api';
import { TUserSession } from '../../types/userSession';
import * as dynamoose from 'dynamoose';

const UserSession = dynamoose.model(
  'UserArticle',
  new dynamoose.Schema(
    {
      pk: {
        hashKey: true,
        map: 'Login',
        type: String,
      },
      sk: {
        rangeKey: true,
        type: String,
      },
      Token: {
        index: true,
        type: String,
      },
    },
    {
      timestamps: {
        createdAt: {
          CreatedAt: {
            type: {
              value: String,
              settings: {
                storage: 'iso',
              },
            },
          },
        },
        updatedAt: {
          UpdatedAt: {
            type: {
              value: String,
              settings: {
                storage: 'iso',
              },
            },
          },
        },
      },
    },
  ),
  {
    create: config.environment === 'local',
    waitForActive: config.environment === 'local',
  },
);

export default class UserSessionRepository {
  private static instance: UserSessionRepository;

  private constructor() {
    if (config.dbEndpointUrl) {
      dynamoose.aws.ddb.local(config.dbEndpointUrl);
    }
  }

  public static getInstance(): UserSessionRepository {
    if (!UserSessionRepository.instance) {
      UserSessionRepository.instance = new UserSessionRepository();
    }

    return UserSessionRepository.instance;
  }

  public async create(input: TCreateUserSessionRequest['body']): Promise<void> {
    await UserSession.create({
      Login: input.login,
      sk: `SESSION#${input.token}`,
      Token: input.token,
    });
  }

  public async getUserSessionByToken(
    token: string,
  ): Promise<TUserSession | undefined> {
    const result = await UserSession.query({ Token: token })
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

    await UserSession.delete({
      Login: userSession.Login,
      sk: `SESSION#${userSession.Token}`,
    });
  }
}
