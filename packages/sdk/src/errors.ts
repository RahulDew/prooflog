/**
 * Base error class for all ProofLog SDK exceptions.
 */
export class ProofLogError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when a request takes longer than the configured timeout limit.
 */
export class TimeoutError extends ProofLogError {
  constructor(message = "Request timed out") {
    super(message);
  }
}

/**
 * Thrown when a network-level disconnection or network error occurs.
 */
export class NetworkError extends ProofLogError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when the server returns 401 Unauthorized (invalid/expired API key).
 */
export class AuthenticationError extends ProofLogError {
  constructor(message: string) {
    super(message, 401);
  }
}

/**
 * Thrown when the server returns 400 Bad Request (payload validation failed).
 */
export class ValidationError extends ProofLogError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * Thrown when the server returns 429 Too Many Requests (rate limits).
 */
export class RateLimitError extends ProofLogError {
  constructor(message: string) {
    super(message, 429);
  }
}

/**
 * Thrown when the server returns a 5xx Internal Server Error.
 */
export class ServerError extends ProofLogError {
  constructor(message: string, statusCode = 500) {
    super(message, statusCode);
  }
}
