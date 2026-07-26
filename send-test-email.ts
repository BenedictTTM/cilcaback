import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MailService } from './src/services/mail/mail.service';

async function bootstrap() {
  console.log('Bootstrapping application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const mailService = app.get(MailService);
  
  console.log('Sending test email...');
  try {
    await mailService.sendMail({
      to: 'palomakut1@gmail.com',
      template: 'VerifyEmail',
      data: {
        name: 'Test User',
        verifyUrl: 'https://www.cilcahair.com/verify-email?token=test',
      },
    });
    console.log('Email sending process completed without throwing errors.');
  } catch (err) {
    console.error('Error sending email:', err);
  }
  
  await app.close();
  console.log('Done.');
}

bootstrap();