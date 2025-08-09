import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    const maxAttempts = Number(process.env.PRISMA_CONNECT_ATTEMPTS || 10);
    const baseDelayMs = Number(process.env.PRISMA_CONNECT_BASE_DELAY_MS || 500);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        return;
      } catch (error) {
        const isLastAttempt = attempt === maxAttempts;
        // Log the error but do not crash the process immediately, so the app can bind and healthcheck can pass
        // Next routes using Prisma will still surface errors until connection succeeds
        // Exponential backoff with jitter
        const backoff = baseDelayMs * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * 200);
        const waitMs = Math.min(backoff + jitter, 10_000);
        // eslint-disable-next-line no-console
        console.error(`[Prisma] Connection attempt ${attempt}/${maxAttempts} failed. Retrying in ${waitMs}ms...`, error);
        if (isLastAttempt) {
          // eslint-disable-next-line no-console
          console.error('[Prisma] Failed to connect after maximum attempts. The API will start, but DB-backed routes may fail until connectivity is restored.');
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}


