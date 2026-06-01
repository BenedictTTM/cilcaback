import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaModule } from '../prisma/prisma.module';

import { MailModule } from '../services/mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule { }
