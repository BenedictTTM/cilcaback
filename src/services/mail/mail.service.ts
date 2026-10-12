import { Injectable, Inject, Logger } from '@nestjs/common';
import { IMailProvider } from './providers/mail-provider.interface';
import { RenderService } from './render.service';
import { SendMailOptions } from './types/mail.types';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject('IMailProvider') private readonly mailProvider: IMailProvider,
    private readonly renderService: RenderService,
  ) {}

  /**
   * Dynamically renders and sends an email.
   */
  async sendMail(options: SendMailOptions): Promise<void> {
    const { to, subject, template, data } = options;
    
    try {
      this.logger.log(`Rendering template ${template} for ${to}`);
      const html = await this.renderService.renderTemplate(template, data);

      const finalSubject = subject || this.getDefaultSubject(template);
      
      this.logger.log(`Sending email intended for ${to} via mail provider`);
      await this.mailProvider.send(to, finalSubject, html);
    } catch (error) {
      this.logger.error(`Failed to execute sendMail process for ${to}:`, error);
      throw error; // Re-throw to inform caller
    }
  }

  async testConnection(): Promise<boolean> {
    if (this.mailProvider.testConnection) {
      return this.mailProvider.testConnection();
    }
    return true; // Assume true if testConnection is not implemented
  }

  private getDefaultSubject(template: string): string {
    const subjects: Record<string, string> = {
      VerifyEmail: 'Verify your email address',
      OrderConfirmation: 'Your order confirmation',
      CartAdded: 'Items added to your cart',
      ResetPassword: 'Password Reset Request',
      OrderStatusUpdate: 'Update on your order status',
    };
    return subjects[template] || 'Notification from Our Service';
  }
}
