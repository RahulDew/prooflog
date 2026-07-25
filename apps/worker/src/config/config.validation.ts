import { type AppConfig } from './config.interface';

export function validateConfig(
  env: Record<string, string | undefined>,
): AppConfig {
  const databaseUrl = env.DATABASE_URL;
  const redisUrl = env.REDIS_URL;

  const errors: string[] = [];

  if (!databaseUrl) {
    errors.push('DATABASE_URL is required but was not provided.');
  }

  if (!redisUrl) {
    errors.push('REDIS_URL is required but was not provided.');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }

  return {
    databaseUrl: databaseUrl!,
    redisUrl: redisUrl!,
  };
}
