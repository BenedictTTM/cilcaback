import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class KeepAliveService implements OnModuleInit {
  private readonly logger = new Logger(KeepAliveService.name);
  private serverUrl: string;

  constructor(private readonly prisma: PrismaService) { }

  onModuleInit() {
    const port = process.env.PORT || 3001;

    this.serverUrl =
      process.env.RENDER_EXTERNAL_URL ||
      process.env.SERVER_URL ||
      `http://localhost:${port}`;

    if (process.env.DISABLE_KEEPALIVE === 'true') {
      this.logger.log('KeepAlive is DISABLED via environment variable to conserve free server hours.');
      return;
    }

    this.logger.log(
      `KeepAlive initialised — DB ping every 30 min, HTTP self-ping every 20 min (${this.serverUrl})`,
    );
  }

  @Cron('*/30 * * * *') // every 30 minutes
  async pingDatabase() {
    if (process.env.DISABLE_KEEPALIVE === 'true') return;
    if (process.env.NODE_ENV === 'production') return; // ← skip in prod

    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const ms = Date.now() - start;
      this.logger.debug(`DB keepalive OK (${ms}ms)`);
    } catch (error) {
      this.logger.warn(`DB keepalive failed: ${error.message}`);
      try {
        await this.prisma.$connect();
        this.logger.log('DB reconnected after keepalive failure');
      } catch (reconnectError) {
        this.logger.error(`DB reconnect failed: ${reconnectError.message}`);
      }
    }
  }


  @Cron('*/20 * * * *') // every 20 minutes
  async selfPing() {
    if (process.env.DISABLE_KEEPALIVE === 'true') return;
    try {
      const start = Date.now();
      const url = `${this.serverUrl}/health`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10_000), // 10 s timeout
      });
      const ms = Date.now() - start;
      this.logger.debug(
        `Self-ping OK — ${res.status} (${ms}ms)`,
      );
    } catch (error) {
      this.logger.warn(`Self-ping failed: ${error.message}`);
    }
  }
}
