import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { LedgerModule } from '../ledger/ledger.module';
import { AuditConsumer } from './audit.consumer';

@Module({
  imports: [
    LedgerModule,
    BullModule.registerQueue({
      name: 'audit-logs',
    }),
  ],
  providers: [AuditConsumer],
})
export class QueueModule {}
