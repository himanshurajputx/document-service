import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from '@shared/logger/logging.interceptor';
import { AllExceptionsFilter } from '@shared/exceptions/all-exceptions.filter';
import { AppLogger } from '@shared/logger/logger.service';
import * as path from 'path';
import * as express from 'express';
import { json, urlencoded } from 'express';
import { CompanyCheckGuard } from '@shared/guards/company-check.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000'], // ✅ specify allowed origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });
  const logger = app.get(AppLogger);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  //  const moduleRef = app.select(AppModule);
  // const guard = moduleRef.get(CompanyCheckGuard);
  // app.useGlobalGuards(guard);

  // 🔐 1. Helmet — basic HTTP header hardening
  app.use(helmet());

  // 🧯 2. Compression — reduce response size
  app.use(compression());

  // 🧹 4. Global Validation — sanitize & validate all incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unrecognized properties
      forbidNonWhitelisted: true, // rejects extra properties
      transform: true, // auto-transform types
    }),
  );

  // 🌐 5. Global Prefix — helps versioning & isolation
  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // ✅ 6. Enable shutdown hooks — graceful shutdowns for Docker/K8s
  app.enableShutdownHooks();

  // 🧱 7. Security headers for file uploads (optional)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // ✅ Serve the uploads folder publicly (cross-platform)
  const projectRoot = path.resolve(__dirname, '../../');
  const uploadsPath = path.resolve(projectRoot, '../uploads');
  app.use('/uploads', express.static(uploadsPath));
  // 🚀 Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Server running securely on http://localhost:${port}`);
}

bootstrap();
