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
    console.log('[SERVER] Railway Health Check Path:', process.env.RAILWAY_HEALTHCHECK_PATH || '/health');
    
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(helmet());
    app.use(cors());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Get the Express instance
    const server = app.getHttpAdapter().getInstance();
    
    // Register health check IMMEDIATELY after getting the server instance
    console.log('[SERVER] Registering health check routes...');
    
    // Simple health check that responds immediately (for Railway)
    server.get('/health', (req: express.Request, res: express.Response) => {
      console.log('[HEALTH] Health check requested - responding immediately');
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.status(200).send('OK');
    });

    // Detailed health check endpoint
    server.get('/health/detailed', (req: express.Request, res: express.Response) => {
      const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
      console.log(`[HEALTH] Detailed health check requested from: ${clientIP}, User-Agent: ${req.headers['user-agent']}`);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 4000,
        railway: true
      });
    });

    // Root health check as fallback
    server.get('/', (req: express.Request, res: express.Response) => {
      const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
      console.log(`[HEALTH] Root health check requested from: ${clientIP}, User-Agent: ${req.headers['user-agent']}`);
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.status(200).json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        railway: true
      });
    });

    console.log('[SERVER] ✅ Health check routes registered at /health (simple), /health/detailed, and /');

    // Serve SPA static assets
    const clientDir = join(__dirname, '../../web/dist');
    server.use(express.static(clientDir));

    // SPA fallback: send index.html for non-API routes so refresh works
    server.get(/^(?!\/api).*/, (_req: any, res: any) => {
      res.sendFile(join(clientDir, 'index.html'));
    });

    const port = process.env.PORT || 4000;
    
    // Start listening
    console.log(`[SERVER] 🚀 Starting to listen on port ${port}...`);
    await app.listen(port, '0.0.0.0');
    
    console.log(`[SERVER] ✅ API listening on http://localhost:${port}`);
    console.log(`[SERVER] ✅ Health check available at http://localhost:${port}/health`);
    console.log(`[SERVER] ✅ Root health check available at http://localhost:${port}/`);
    console.log(`[SERVER] ✅ Railway health check should work now`);
    
    // Test health check immediately after startup
    setTimeout(() => {
      console.log('[SERVER] 🔍 Testing health check endpoint...');
      fetch(`http://localhost:${port}/health`)
        .then(response => {
          console.log(`[SERVER] ✅ Health check test response status: ${response.status}`);
          return response.text();
        })
        .then(text => console.log('[SERVER] ✅ Health check test successful:', text))
        .catch(err => console.error('[SERVER] ❌ Health check test failed:', err));
    }, 2000);
    
  } catch (error) {
    console.error('[SERVER] ❌ Failed to start server:', error);
    if (error instanceof Error) {
      console.error('[SERVER] ❌ Error stack:', error.stack);
    }
    process.exit(1);
  }
}

bootstrap();


