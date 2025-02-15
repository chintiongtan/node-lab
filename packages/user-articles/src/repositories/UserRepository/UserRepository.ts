import { config } from '../../config';
import { userSchema } from '../../schemas/request/user';
import { CreateUserInput, TUser } from '../../types/user';
import * as dynamoose from 'dynamoose';

const User = dynamoose.model(
  'UserArticle',
  new dynamoose.Schema(
    {
      pk: {
        map: 'Login',
        type: String,
      },
      Password: String,
      UserId: String,
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

export default class UserRepository {
  private static instance: UserRepository;

  constructor() {
    if (config.dbEndpointUrl) {
      dynamoose.aws.ddb.local(config.dbEndpointUrl);
    }
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }

    return UserRepository.instance;
  }

  public async create(input: CreateUserInput): Promise<void> {
    const { login: Login, password: Password, user_id: UserId } = input;

    await User.create({
      Login,
      Password,
      UserId,
    });
  }

  public async getUserByLogin(login: string): Promise<TUser | undefined> {
    const result = await User.query({ Login: login }).exec();

    if (!result.length) {
      return undefined;
    }

    const { data } = userSchema.safeParse(result[0]);

    return data;
  }
}
