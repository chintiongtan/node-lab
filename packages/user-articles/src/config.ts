import { z } from 'zod';

const environmentSchema = z.enum(['local', 'production']);

type TEnvironment = z.infer<typeof environmentSchema>;

type TAppConfig = {
  dbEndpointUrl?: string;
  environment: TEnvironment;
};

const parseEnv = (key: string, defaultValue?: string) =>
  process.env[key] ?? defaultValue;

const common = {
  dbEndpointUrl: parseEnv('DB_ENDPOINT_URL'),
};
const configs: Record<TEnvironment, () => Omit<TAppConfig, 'environment'>> = {
  local: () => ({
    ...common,
  }),
  production: () => ({
    ...common,
  }),
};
const { data: environment = 'local' } = environmentSchema.safeParse(
  process.env.ENVIRONMENT,
);

export const config: TAppConfig = {
  ...configs[environment](),
  environment,
};
