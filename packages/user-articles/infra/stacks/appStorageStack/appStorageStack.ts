import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export type TAppStorageStackProps = cdk.StackProps;

export class AppStorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: TAppStorageStackProps = {}) {
    super(scope, id, props);

    const { tags = {} } = props;

    Object.keys(tags).forEach((key) => {
      cdk.Tags.of(scope).add(key, tags[key] ?? '');
    });

    const table = this.createDdb();

    new cdk.CfnOutput(this, 'ArnUserArticleTable', {
      value: table.tableArn,
    });
  }

  private createDdb(): cdk.aws_dynamodb.Table {
    const table = new cdk.aws_dynamodb.Table(this, 'UserArticle', {
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'pk',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      sortKey: {
        name: 'sk',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      tableName: 'UserArticle',
    });

    table.addGlobalSecondaryIndex({
      indexName: 'TokenGlobalIndex',
      partitionKey: {
        name: 'Token',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      projectionType: cdk.aws_dynamodb.ProjectionType.ALL,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'VisibilityGlobalIndex',
      partitionKey: {
        name: 'Visiblity',
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      projectionType: cdk.aws_dynamodb.ProjectionType.ALL,
    });

    return table;
  }
}
