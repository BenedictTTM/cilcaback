import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IMailProvider } from './mail-provider.interface';

@Injectable()
export class ResendProvider implements IMailProvider, OnModuleInit {
  private readonly logger = new Logger(ResendProvider.name);
  private resend: Resend | null = null;
  private fromEmail: string = 'noreply@example.com';

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'noreply@example.com';

    if (!apiKey) {
      this.logger.warn(
        '⚠️ RESEND_API_KEY is not configured in .env. Email sending will be skipped until an API key is provided.',
      );
      return;
    }

    this.resend = new Resend(apiKey);
    this.logger.log(`ResendProvider initialised (from: "${this.fromEmail}")`);
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `Email sending skipped (RESEND_API_KEY not configured). Recipient: ${to}, Subject: "${subject}"`,
      );
      return;
    }

    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Resend rejected email to ${to}: ${JSON.stringify(error)}`);
      throw new Error(`Failed to send email to ${to}: ${error.message}`);
    }

    this.logger.log(`Email sent successfully to ${to}. Resend ID: ${data?.id}`);
  }

  /**
   * Resend has no explicit connection-verify step; we validate the API key
   * is present and well-formed (starts with "re_") as a lightweight health check.
   */
  async testConnection(): Promise<boolean> {
    const apiKey = this.configService.get<string>('RESEND_API_KEY') ?? '';
    const valid = apiKey.startsWith('re_') && apiKey.length > 10;
    if (valid) {
      this.logger.log('Resend API key check passed');
    } else {
      this.logger.warn('Resend API key appears invalid or not configured');
    }
    return valid;
  }
}
