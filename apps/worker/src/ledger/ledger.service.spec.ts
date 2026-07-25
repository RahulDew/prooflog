import { Test, type TestingModule } from '@nestjs/testing';
import { LedgerService } from './ledger.service';
import { DrizzleConnection } from '../database/database.provider';

// Mock drizzle and database query helpers
const mockSelect = jest.fn();
const mockFrom = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockInsert = jest.fn();
const mockValues = jest.fn();

jest.mock('@neondatabase/serverless', () => ({
  neon: jest.fn(() => () => {}),
}));

jest.mock('drizzle-orm/neon-http', () => ({
  drizzle: jest.fn(() => ({
    select: mockSelect.mockReturnValue({
      from: mockFrom.mockReturnValue({
        where: mockWhere.mockReturnValue({
          orderBy: mockOrderBy.mockReturnValue({
            limit: mockLimit,
          }),
          limit: mockLimit,
        }),
        limit: mockLimit,
      }),
    }),
    insert: mockInsert.mockReturnValue({
      values: mockValues,
    }),
  })),
}));

// Mock cryptographic operations to keep tests isolated from ESM noble hashes
jest.mock('@prooflog/crypto', () => ({
  GENESIS_HASH: 'genesis_mock_hash_value',
  computeHash: jest.fn(() => 'computed_mock_hash_value'),
}));

describe('LedgerService', () => {
  let service: LedgerService;

  const mockDbClient = {
    select: mockSelect.mockReturnValue({
      from: mockFrom.mockReturnValue({
        where: mockWhere.mockReturnValue({
          orderBy: mockOrderBy.mockReturnValue({
            limit: mockLimit,
          }),
          limit: mockLimit,
        }),
        limit: mockLimit,
      }),
    }),
    insert: mockInsert.mockReturnValue({
      values: mockValues,
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LedgerService,
        {
          provide: DrizzleConnection,
          useValue: mockDbClient,
        },
      ],
    }).compile();

    service = module.get<LedgerService>(LedgerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('appendLog()', () => {
    const mockBody = {
      action: 'user.login',
      actor: { id: 'usr_1' },
      target: { id: 'proj_99' },
      metadata: { ip: '127.0.0.1' },
      idempotencyKey: 'idem_unique_key',
    };

    it('should process a first-ever log entry (Genesis block)', async () => {
      // 1st call: Idempotency check -> not a duplicate
      mockLimit.mockResolvedValueOnce([]);
      // 2nd call: Resolving current head -> ledger is empty
      mockLimit.mockResolvedValueOnce([]);
      mockValues.mockResolvedValueOnce({ inserted: true });

      const result = await service.appendLog('org_123', mockBody);

      expect(result.sequence).toBe(1);
      expect(result.hash).toBe('computed_mock_hash_value');
      expect(mockInsert).toHaveBeenCalledTimes(1);
      expect(mockValues).toHaveBeenCalledWith(
        expect.objectContaining({
          sequence: 1,
          previousHash: 'genesis_mock_hash_value',
        }),
      );
    });

    it('should correctly chain sequence and hash when logs already exist', async () => {
      mockLimit.mockResolvedValueOnce([]); // Idempotency check -> not a duplicate
      mockLimit.mockResolvedValueOnce([
        {
          sequence: 15,
          hash: 'previous_hash_xyz',
        },
      ]); // Existing head resolved
      mockValues.mockResolvedValueOnce({ inserted: true });

      const result = await service.appendLog('org_123', mockBody);

      expect(result.sequence).toBe(16);
      expect(mockInsert).toHaveBeenCalledTimes(1);
      expect(mockValues).toHaveBeenCalledWith(
        expect.objectContaining({
          sequence: 16,
          previousHash: 'previous_hash_xyz',
        }),
      );
    });

    it('should skip computation and return cached values for duplicate idempotency key', async () => {
      // Idempotency check returns existing entry (duplicate)
      mockLimit.mockResolvedValueOnce([
        {
          sequence: 42,
          hash: 'duplicate_cached_hash_value',
        },
      ]);

      const result = await service.appendLog('org_123', mockBody);

      expect(result.sequence).toBe(42);
      expect(result.hash).toBe('duplicate_cached_hash_value');
      expect(mockInsert).not.toHaveBeenCalled(); // DB insert bypassed
    });

    it('should retry sequence calculation on unique constraint violation (database collision)', async () => {
      mockLimit.mockResolvedValueOnce([]); // Idempotency check -> not a duplicate

      // First resolution: returns sequence 5
      mockLimit.mockResolvedValueOnce([
        {
          sequence: 5,
          hash: 'previous_hash_123',
        },
      ]);

      // First insert attempt throws unique constraint violation (another worker wrote in parallel)
      const uniqueError = new Error('Unique constraint error');
      (uniqueError as any).code = '23505';
      mockInsert.mockImplementationOnce(() => {
        throw uniqueError;
      });

      // Second attempt: resolves new head sequence 6
      mockLimit.mockResolvedValueOnce([
        {
          sequence: 6,
          hash: 'new_concurrent_hash_value',
        },
      ]);
      mockValues.mockResolvedValueOnce({ inserted: true });

      const result = await service.appendLog('org_123', mockBody);

      expect(result.sequence).toBe(7);
      expect(mockInsert).toHaveBeenCalledTimes(2); // Two insert attempts made
    });
  });
});
