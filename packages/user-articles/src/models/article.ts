import * as dynamoose from 'dynamoose';
import { config } from '../config';

export const ArticleModel = dynamoose.model(
  'Article',
  new dynamoose.Schema({
    pk: {
      hashKey: true,
      map: 'Login',
      type: String,
    },
    sk: {
      rangeKey: true,
      type: String,
    },
    ArticleId: String,
    Content: String,
    Title: String,
    UserId: String,
    Visibility: String,
  }),
  {
    create: config.environment === 'local',
    update: config.environment === 'local',
    waitForActive: config.environment === 'local',
  },
);
