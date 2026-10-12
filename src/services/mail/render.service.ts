import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/render';
import React from 'react';
import VerifyEmail from '../../emails/VerifyEmail';
import OrderConfirmation from '../../emails/OrderConfirmation';
import CartAdded from '../../emails/CartAdded';
import ResetPassword from '../../emails/ResetPassword';
import NewsletterTemplate from '../../emails/NewsletterTemplate';
import OrderStatusUpdate from '../../emails/OrderStatusUpdate';

@Injectable()
export class RenderService {
  private readonly logger = new Logger(RenderService.name);

  // Map of template names to React components
  private templates: Record<string, React.FC<any>> = {
    VerifyEmail,
    OrderConfirmation,
    CartAdded,
    ResetPassword,
    NewsletterTemplate,
    OrderStatusUpdate,
  };

  /**
   * Render a React component template to an HTML string
   */
  async renderTemplate(templateName: string, data: any): Promise<string> {
    const Component = this.templates[templateName];
    if (!Component) {
      this.logger.error(`Template not found: ${templateName}`);
      throw new Error(`Template not found: ${templateName}`);
    }

    try {
      const html = await render(React.createElement(Component, data));
      return html;
    } catch (error) {
      this.logger.error(`Error rendering template ${templateName}:`, error);
      throw new Error(`Failed to render template ${templateName}`);
    }
  }
}
