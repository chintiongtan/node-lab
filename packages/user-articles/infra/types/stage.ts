import { z } from 'zod';
import { TAppStorageStackProps } from '../stacks/app-storage-stack';
import { stageSchema } from '../schemas/stage';

export type TStackProps = TAppStorageStackProps;

export type TStage = z.infer<typeof stageSchema>;
