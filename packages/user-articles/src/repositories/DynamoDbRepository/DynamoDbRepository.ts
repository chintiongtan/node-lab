import * as dynamoose from 'dynamoose';
import { config } from '../../config';
import { ModelType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';

export const dbUserSchema = new dynamoose.Schema(
  {
    pk: {
      hashKey: true,
      map: 'Login',
      type: String,
    },
    sk: {
      default: 'ROOT',
      rangeKey: true,
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
);

export const dbUserSessionSchema = new dynamoose.Schema(
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
);

export const UserModel = dynamoose.model(
  'User',
  [dbUserSchema, dbUserSessionSchema],
  {
    create: config.environment === 'local',
    update: config.environment === 'local',
    waitForActive: config.environment === 'local',
  },
);

export class DynamoDbRepository {
  model: ModelType<AnyItem>;

  constructor(model: ModelType<AnyItem>) {
    this.model = model;
  }
}
