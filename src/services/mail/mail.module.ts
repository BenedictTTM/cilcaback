import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { RenderService } from './render.service';
import { NodemailerProvider } from './providers/nodemailer.provider';

@Module({
  providers: [
    MailService,
    RenderService,
    {
      provide: 'IMailProvider',
      useClass: NodemailerProvider,
    },
  ],
  exports: [MailService, RenderService],
})
export class MailModule {}
