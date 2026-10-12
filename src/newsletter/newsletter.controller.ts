import { Controller, Post, Body, Put, Param, Get, Header, BadRequestException, ConflictException } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    try {
      return await this.newsletterService.subscribeToNewsletter(email);
    } catch (e: any) {
      if (e instanceof BadRequestException || e instanceof ConflictException) throw e;
      throw new BadRequestException('Prisma Error: ' + e.message);
    }
  }

  @Post('create')
  async createDraft(@Body() body: { title: string; subject: string; content: any; createdBy?: number }) {
    return this.newsletterService.createDraft(body);
  }

  @Get()
  async getCampaigns() {
    return this.newsletterService.getCampaigns();
  }

  @Put(':id')
  async updateCampaign(
    @Param('id') id: string,
    @Body() body: { title?: string; subject?: string; content?: any },
  ) {
    return this.newsletterService.updateCampaign(Number(id), body);
  }

  @Get(':id/preview')
  @Header('Content-Type', 'text/html')
  async previewHtml(@Param('id') id: string) {
    return this.newsletterService.previewHtml(Number(id));
  }

  @Post(':id/send')
  async sendCampaign(@Param('id') id: string) {
    return this.newsletterService.sendCampaign(Number(id));
  }
}
