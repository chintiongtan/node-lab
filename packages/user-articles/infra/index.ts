#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TStage } from './types/stage';
import { stageSchema } from './schemas/stage';
import StageProps from './stage';
import { AppStorageStack } from './stacks/appStorageStack';

let stage: TStage;

const app = new cdk.App();

try {
  stage = stageSchema.parse(app.node.tryGetContext('stage'));
} catch {
  stage = 'staging';
}

const props = StageProps[stage];

new AppStorageStack(app, 'UserArticlesAppStorageStack', props);
