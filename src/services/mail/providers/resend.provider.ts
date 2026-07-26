import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IMailProvider } from './mail-provider.interface';

@Injectable()
export class ResendProvider implements IMailProvider, OnModuleInit {
  private readonly logger = new Logger(ResendProvider.name);
  private resend: Resend;
  private fromEmail: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.getOrThrow<string>('EMAIL_FROM');
    this.resend = new Resend(apiKey);
    this.logger.log(`ResendProvider initialised (from: "${this.fromEmail}")`);
  }

  async send(to: string, subject: string, html: string): Promise<void> {
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
      this.logger.warn('Resend API key appears invalid');
    }
    return valid;
  }
}
