import * as dynamoose from 'dynamoose';
import { config } from '../config';

export const UserModel = dynamoose.model(
  'User',
  new dynamoose.Schema(
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
  ),
  {
    create: config.environment === 'local',
    update: config.environment === 'local',
    waitForActive: config.environment === 'local',
  },
);
