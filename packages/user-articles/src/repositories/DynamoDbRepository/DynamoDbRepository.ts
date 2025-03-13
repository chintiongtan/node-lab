import * as dynamoose from 'dynamoose';
import { config } from '../../config';
import { ModelType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';
import { ArticleModel } from '../../models/article';
import { UserModel } from '../../models/user';
import { UserSessionModel } from '../../models/userSession';

new dynamoose.Table('UserArticle', [ArticleModel, UserModel, UserSessionModel]);

export class DynamoDbRepository {
  model: ModelType<AnyItem>;

  constructor(model: ModelType<AnyItem>) {
    this.model = model;

    if (config.dbEndpointUrl) {
      dynamoose.aws.ddb.local(config.dbEndpointUrl);
    }
  }
}
