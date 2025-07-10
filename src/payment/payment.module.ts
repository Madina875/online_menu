import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Payment } from "./entities/payment.entity";
import { JwtModule } from "@nestjs/jwt";
import { OrderItem } from "../order_items/entities/order_item.entity";
import { MealCategory } from "../meal_category/entities/meal_category.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, OrderItem, MealCategory]),
    JwtModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
