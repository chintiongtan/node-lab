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
  }
}
