import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
const cors = require('cors');
import express from 'express';
import { join } from 'path';

async function bootstrap() {
  try {
    console.log('[SERVER] Starting NestJS application...');
    console.log('[SERVER] Environment:', process.env.NODE_ENV || 'development');
    console.log('[SERVER] Port:', process.env.PORT || 4000);
    
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(helmet());
    app.use(cors());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Serve SPA static assets
    const clientDir = join(__dirname, '../../web/dist');
    const server = app.getHttpAdapter().getInstance();
    
    // Health check endpoint on Express instance - register BEFORE other middleware
    server.get('/health', (req: express.Request, res: express.Response) => {
      console.log('[HEALTH] Health check requested from:', req.ip || req.connection.remoteAddress);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 4000
      });
    });

    // Also add a root health check for Railway
    server.get('/', (req: express.Request, res: express.Response) => {
      console.log('[HEALTH] Root health check requested');
      res.status(200).json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
      });
    });

    console.log('[SERVER] Health check routes registered at /health and /');
    server.use(express.static(clientDir));

    // SPA fallback: send index.html for non-API routes so refresh works
    server.get(/^(?!\/api).*/, (_req: any, res: any) => {
      res.sendFile(join(clientDir, 'index.html'));
    });

    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`[SERVER] ✅ API listening on http://localhost:${port}`);
    console.log(`[SERVER] ✅ Health check available at http://localhost:${port}/health`);
    console.log(`[SERVER] ✅ Root health check available at http://localhost:${port}/`);
    
    // Test health check immediately after startup
    setTimeout(() => {
      console.log('[SERVER] 🔍 Testing health check endpoint...');
      fetch(`http://localhost:${port}/health`)
        .then(response => response.json())
        .then(data => console.log('[SERVER] ✅ Health check test successful:', data))
        .catch(err => console.error('[SERVER] ❌ Health check test failed:', err));
    }, 1000);
    
  } catch (error) {
    console.error('[SERVER] ❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();


