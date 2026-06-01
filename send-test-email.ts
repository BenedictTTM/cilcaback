import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { NodemailerProvider } from './src/services/mail/providers/nodemailer.provider';

async function bootstrap() {
  console.log('Bootstrapping application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Get our nodemailer provider
  const mailProvider = app.get(NodemailerProvider);
  
  console.log('Sending test email to palomakut1@gmail.com...');
  try {
    await mailProvider.send(
      'palomakut1@gmail.com',
      'Test Email from Optimum',
      '<h1>Hello!</h1><p>This is a test email to verify Nodemailer configuration. If you see this, emails are working correctly!</p>'
    );
    console.log('Email sending process completed without throwing errors.');
  } catch (err) {
    console.error('Error sending email:', err);
  }
  
  await app.close();
  console.log('Done.');
}

bootstrap();