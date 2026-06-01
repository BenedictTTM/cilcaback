import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IMailProvider } from './mail-provider.interface';

@Injectable()
export class NodemailerProvider implements IMailProvider {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(NodemailerProvider.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: parseInt(this.configService.get<string>('SMTP_PORT') ?? '587', 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      logger: true,
      debug: true,
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    try {
      const fromEmail = this.configService.get<string>('FROM_EMAIL');
      const info = await this.transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
      this.logger.debug(`SMTP Response: ${info.response}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw new Error(`Failed to send email to ${to}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection successful');
      return true;
    } catch (error) {
      this.logger.error('SMTP connection failed:', error);
      return false;
    }
  }
}
