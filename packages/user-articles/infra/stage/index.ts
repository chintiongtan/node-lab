import { StackProps } from 'aws-cdk-lib';
import { TStage } from '../types/stage';
import stagingProps from './staging';

const stage: Partial<Record<TStage, StackProps>> = {
  staging: stagingProps,
};

export default stage;
