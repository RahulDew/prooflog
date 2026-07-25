import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  // Boots NestJS as a headless background container (no web/port listening)
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });

  // Assign the custom coloring logger as the global logger
  app.useLogger(app.get(LoggerService));

  // Ensures database connections and queue sockets are closed gracefully when the container stops
  app.enableShutdownHooks();

  const logger = app.get(LoggerService);
  logger.log('ProofLog background queue worker initialized successfully.', 'Bootstrap');
}
bootstrap();
