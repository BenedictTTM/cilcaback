import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { RenderService } from './render.service';
import { ResendProvider } from './providers/resend.provider';

@Module({
  providers: [
    MailService,
    RenderService,
    {
      provide: 'IMailProvider',
      useClass: ResendProvider,
    },
  ],
  exports: [MailService, RenderService],
})
export class MailModule {}
