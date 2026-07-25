// Main class
export { ProofLog } from "./client";

// Error classes
export {
  ProofLogError,
  TimeoutError,
  NetworkError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  ServerError,
} from "./errors";

// Types — developer ke TypeScript projects mein kaam aayenge
export type {
  ProofLogConfig,
  IngestOptions,
  IngestResult,
  VerifyResult,
} from "./types";
