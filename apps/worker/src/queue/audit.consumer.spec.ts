import { Test, type TestingModule } from '@nestjs/testing';
import { AuditConsumer } from './audit.consumer';
import { LedgerService } from '../ledger/ledger.service';
import type { Job } from 'bullmq';

// Mock cryptographic operations to prevent loading ESM dependencies in Jest
jest.mock('@prooflog/crypto', () => ({
  GENESIS_HASH: 'genesis_mock_hash_value',
  computeHash: jest.fn(() => 'computed_mock_hash_value'),
}));

describe('AuditConsumer', () => {
  let consumer: AuditConsumer;
  let ledgerService: LedgerService;

  const mockLedgerService = {
    appendLog: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditConsumer,
        {
          provide: LedgerService,
          useValue: mockLedgerService,
        },
      ],
    }).compile();

    consumer = module.get<AuditConsumer>(AuditConsumer);
    ledgerService = module.get<LedgerService>(LedgerService);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  describe('process()', () => {
    const mockJob = {
      id: 'job_123',
      data: {
        organisationId: 'org_123',
        body: {
          action: 'user.login',
          actor: { id: 'usr_1' },
        },
      },
    } as unknown as Job;

    it('should delegate queue job processing to LedgerService', async () => {
      mockLedgerService.appendLog.mockResolvedValueOnce({
        sequence: 12,
        hash: 'computed_hash_val_abc',
      });

      const result = await consumer.process(mockJob);

      expect(result).toEqual({
        sequence: 12,
        hash: 'computed_hash_val_abc',
      });
      expect(ledgerService.appendLog).toHaveBeenCalledWith('org_123', {
        action: 'user.login',
        actor: { id: 'usr_1' },
      });
      expect(ledgerService.appendLog).toHaveBeenCalledTimes(1);
    });

    it('should bubble up processing errors thrown by LedgerService', async () => {
      const mockError = new Error('Database down');
      mockLedgerService.appendLog.mockRejectedValueOnce(mockError);

      await expect(consumer.process(mockJob)).rejects.toThrow('Database down');
      expect(ledgerService.appendLog).toHaveBeenCalledTimes(1);
    });
  });
});
