import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Stuff } from '../stuff/entities/stuff.entity';
import { OrderTable } from '../order_table/entities/order_table.entity';
import { User } from '../user/entities/user.entity';
import { Payment } from '../payment/entities/payment.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      Delivery,
      Stuff,
      OrderTable,
      User,
      Payment,
    ]),
    JwtModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
