import { z } from 'zod';

const environmentSchema = z.enum(['local', 'production', 'test']);

type TEnvironment = z.infer<typeof environmentSchema>;

type TAppConfig = {
  dbEndpointUrl?: string;
  environment: TEnvironment;
};

const parseEnv = <T>(key: string, defaultValue?: T) =>
  process.env[key] ?? defaultValue;

const common = {
  dbEndpointUrl: parseEnv('DB_ENDPOINT_URL', ''),
};
const configs: Record<TEnvironment, () => Omit<TAppConfig, 'environment'>> = {
  local: () => ({
    ...common,
  }),
  production: () => ({
    ...common,
  }),
  test: () => ({
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
