import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private formatMessage(
    level: string,
    colorCode: string,
    message: any,
    context?: string,
  ) {
    const timestamp = new Date().toISOString();
    // Cyan color for context labels
    const formattedContext = context ? `[\x1b[36m${context}\x1b[0m] ` : '';
    // Tag colored by level type
    const levelTag = `${colorCode}[${level}]\x1b[0m`;
    // Gray prefix for metadata
    const prefix = `\x1b[90m[ProofLog]\x1b[0m`;
    const grayTime = `\x1b[90m${timestamp}\x1b[0m`;

    const messageString =
      typeof message === 'object'
        ? JSON.stringify(message, null, 2)
        : message;

    return `${prefix} ${levelTag} ${grayTime} ${formattedContext}${messageString}`;
  }

  log(message: any, context?: string) {
    console.log(this.formatMessage('INFO', '\x1b[32m', message, context)); // Green
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatMessage('ERROR', '\x1b[31m\x1b[1m', message, context)); // Bold Red
    if (trace) {
      console.error(`\x1b[31mStack Trace:\n${trace}\x1b[0m`);
    }
  }

  warn(message: any, context?: string) {
    console.warn(this.formatMessage('WARN', '\x1b[33m', message, context)); // Yellow
  }

  debug(message: any, context?: string) {
    console.log(this.formatMessage('DEBUG', '\x1b[35m', message, context)); // Magenta
  }

  verbose(message: any, context?: string) {
    console.log(this.formatMessage('VERBOSE', '\x1b[34m', message, context)); // Blue
  }
}
