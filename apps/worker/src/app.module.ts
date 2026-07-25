import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { LedgerModule } from './ledger/ledger.module';
import { QueueModule } from './queue/queue.module';
import { LoggerModule } from './logger/logger.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Import modular subdivisions
    ConfigModule,
    DatabaseModule,
    LedgerModule,
    QueueModule,
    LoggerModule,

    // Connect BullMQ globally using validated env context
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        if (!redisUrl) {
          throw new Error('REDIS_URL is missing in environment configuration.');
        }
        return {
          connection: {
            url: redisUrl,
          },
        };
      },
    }),
  ],
})
export class AppModule {}
