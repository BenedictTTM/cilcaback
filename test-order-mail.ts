import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MailService } from './src/services/mail/mail.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);
  
  try {
    await mailService.sendMail({
      to: 'palomakut1@gmail.com',
      template: 'OrderConfirmation',
      data: {
        orderId: 'TEST-123',
        name: 'Test Customer',
        total: 'GHS 100.00',
        items: [{name: 'Test Item', quantity: 1, price: 'GHS 100.00'}]
      }
    });
    console.log('Sending Test OrderConfirmation succeeded');
  } catch (err) {
    console.error('Test failed:', err);
  }
  await app.close();
}
bootstrap();