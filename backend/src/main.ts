import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const SqliteStore = require('better-sqlite3-session-store')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.use(cookieParser());

  const dbPath = process.env.DATABASE_URL || './data/app.db';
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);

  app.use(
    session({
      store: new SqliteStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 900000,
        },
      }),
      secret: process.env.SESSION_SECRET || 'insecure-secret-for-demo',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Vulnerable Task Platform API')
    .setDescription(
      '⚠️ INTENTIONALLY VULNERABLE API for educational purposes.\n\n' +
        'This API contains documented security vulnerabilities:\n' +
        '- SQL Injection in login endpoint\n' +
        '- And more vulnerabilities coming in Phase 3+\n\n' +
        '🚫 DO NOT use in production or with real data.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '⚠️ Vulnerable API Docs',
    customCss: '.swagger-ui .topbar { background-color: #dc2626; }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger API docs: http://localhost:${port}/api/docs`);
}
bootstrap();
