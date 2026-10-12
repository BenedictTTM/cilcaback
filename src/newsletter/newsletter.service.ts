import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../services/mail/mail.service';
import { RenderService } from '../services/mail/render.service';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private renderService: RenderService,
  ) {}

  async subscribeToNewsletter(email: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.isSubscribed) {
        return this.prisma.newsletterSubscriber.update({
          where: { email },
          data: { isSubscribed: true },
        });
      }
      throw new ConflictException('Email is already subscribed to the newsletter');
    }

    return this.prisma.newsletterSubscriber.create({
      data: { email },
    });
  }

  async getCampaigns() {
    return this.prisma.newsletterCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDraft(data: { title: string; subject: string; content: any; createdBy?: number }) {
    return this.prisma.newsletterCampaign.create({
      data: {
        title: data.title,
        subject: data.subject,
        content: data.content,
        status: 'draft',
        createdBy: data.createdBy,
      },
    });
  }

  async updateCampaign(id: number, data: { title?: string; subject?: string; content?: any }) {
    return this.prisma.newsletterCampaign.update({
      where: { id },
      data,
    });
  }

  async previewHtml(id: number): Promise<string> {
    const campaign = await this.prisma.newsletterCampaign.findUnique({
      where: { id },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    return this.renderService.renderTemplate('NewsletterTemplate', {
      content: campaign.content,
      subject: campaign.subject,
    });
  }

  async sendCampaign(id: number): Promise<any> {
    const campaign = await this.prisma.newsletterCampaign.findUnique({
      where: { id },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    // Cast Prisma JsonValue to any to avoid type mismatch at runtime
    const content = campaign.content as any;
    if (!content || !Array.isArray(content.blocks)) {
      throw new Error('Campaign content is invalid or has no blocks.');
    }

    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { isSubscribed: true },
    });

    if (subscribers.length === 0) {
      return { message: 'No subscribers to send to.' };
    }

    // Render HTML once for all subscribers
    const html = await this.renderService.renderTemplate('NewsletterTemplate', {
      content,
      subject: campaign.subject,
    });

    // Send emails in a loop with simple retry logic
    let successCount = 0;
    let failureCount = 0;

    for (const sub of subscribers) {
      let attempts = 0;
      let sent = false;
      while (attempts < 3 && !sent) {
        try {
          await this.mailService.sendMail({
            to: sub.email,
            subject: campaign.subject,
            template: 'NewsletterTemplate',
            data: {
              content,
              subject: campaign.subject,
            },
          });

          sent = true;
          successCount++;
        } catch (error) {
          attempts++;
          this.logger.error(`Attempt ${attempts} failed for ${sub.email}`, error);
          if (attempts === 3) failureCount++;
          // Wait 1 second before retry
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      // Delay between each user to prevent rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Update campaign status
    await this.prisma.newsletterCampaign.update({
      where: { id },
      data: { status: 'sent' },
    });

    return {
      message: 'Campaign sent process completed.',
      successCount,
      failureCount,
    };
  }
}
