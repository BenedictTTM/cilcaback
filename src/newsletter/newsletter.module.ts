import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
// Remove PrismaModule since the users repo might not export it or have it defined globally.
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../services/mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterModule {}
