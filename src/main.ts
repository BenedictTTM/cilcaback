import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FileSizeExceptionFilter } from './common/filters/file-size-exception.filter';

import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Raw body for webhook signature verification
  app.use(
    json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString('utf8');
      },
    }),
  );

  const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      // For local development, be permissive or add common origins
      if (
        allowedOrigins.some(allowed => origin.startsWith(allowed)) ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1')
      ) {
        callback(null, true);
      } else {
        console.warn(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-paystack-signature', 'idempotency-key'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    disableErrorMessages: false,
    validateCustomDecorators: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    skipMissingProperties: false,
    skipNullProperties: false,
    skipUndefinedProperties: false,
  }));

  // Global filter to present friendlier file upload validation messages
  app.useGlobalFilters(new FileSizeExceptionFilter());

  const port = process.env.PORT || 3001;
  console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});
