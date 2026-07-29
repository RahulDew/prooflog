import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { ConfigService } from '@nestjs/config';

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */

// 1. Empty class token: prevents JavaScript inheritance crashes in mocked unit tests
export abstract class DrizzleConnection {}

// 2. TypeScript interface: merges with class to provide Drizzle compile-time type autocomplete
export interface DrizzleConnection extends NeonHttpDatabase<any> {}

export const databaseProviders = [
  {
    provide: DrizzleConnection,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const databaseUrl = configService.get<string>('DATABASE_URL');
      if (!databaseUrl) {
        throw new Error(
          'DATABASE_URL is missing in environment configuration.',
        );
      }

      const sql = neon(databaseUrl);

      return drizzle(sql);
    },
  },
];
