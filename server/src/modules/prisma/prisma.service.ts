import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    const maxAttempts = Number(process.env.PRISMA_CONNECT_ATTEMPTS || 10);
    const baseDelayMs = Number(process.env.PRISMA_CONNECT_BASE_DELAY_MS || 500);

    // Do not block app startup; attempt connection in background
    (async () => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await this.$connect();
          // eslint-disable-next-line no-console
          console.log('[Prisma] Connected successfully');
          return;
        } catch (error) {
          const isLastAttempt = attempt === maxAttempts;
          const backoff = baseDelayMs * Math.pow(2, attempt - 1);
          const jitter = Math.floor(Math.random() * 200);
          const waitMs = Math.min(backoff + jitter, 10_000);
          // eslint-disable-next-line no-console
          console.error(`[Prisma] Connection attempt ${attempt}/${maxAttempts} failed. Retrying in ${waitMs}ms...`, error);
          if (isLastAttempt) {
            // eslint-disable-next-line no-console
            console.error('[Prisma] Failed to connect after maximum attempts. The API started, but DB-backed routes may fail until connectivity is restored.');
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, waitMs));
        }
      }
    })();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}


