import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
const cors = require('cors');
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Serve SPA static assets
  const clientDir = join(__dirname, '../../web/dist');
  const server = app.getHttpAdapter().getInstance();
  server.get('/health', (_req: any, res: any) => res.status(200).json({ status: 'ok' }));
  server.use(express.static(clientDir));

  // SPA fallback: send index.html for non-API routes so refresh works
  server.get(/^(?!\/api).*/, (_req: any, res: any) => {
    res.sendFile(join(clientDir, 'index.html'));
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();


