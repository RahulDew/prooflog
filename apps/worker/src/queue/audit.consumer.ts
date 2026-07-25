import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { LedgerService } from '../ledger/ledger.service';

@Processor('audit-logs')
@Injectable()
export class AuditConsumer extends WorkerHost {
  private readonly logger = new Logger(AuditConsumer.name);

  constructor(private readonly ledgerService: LedgerService) {
    super();
  }

  /**
   * Delegates the enqueued job to LedgerService for verification and database insertion.
   */
  async process(job: Job<any, any, string>): Promise<any> {
    const { organisationId, body } = job.data;
    this.logger.log(
      `Processing queue job "${job.id}" for organisation "${organisationId}"`,
    );

    try {
      const result = await this.ledgerService.appendLog(organisationId, body);
      return result;
    } catch (error) {
      this.logger.error(`Queue job "${job.id}" processing exception:`, error);
      throw error;
    }
  }
}
