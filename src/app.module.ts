import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { ManagerModule } from './manager/manager.module';
import { DeliveryModule } from './delivery/delivery.module';
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';
import { RoleModule } from './role/role.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { Delivery } from './delivery/entities/delivery.entity';
// import { AdminModule } from './admin/admin.module';
// import { Admin } from './admin/entities/admin.entity';
import { User } from './user/entities/user.entity';
import { Manager } from './manager/entities/manager.entity';
import { Payment } from './payment/entities/payment.entity';
import { Role } from './role/entities/role.entity';
import { OrderTableModule } from './order_table/order_table.module';
import { OrderTable } from './order_table/entities/order_table.entity';
import { Image } from './image/entities/image.entity';
import { RestaturantModule } from './restaturant/restaturant.module';
import { Restaurant } from './restaturant/entities/restaturant.entity';
import { StuffModule } from './stuff/stuff.module';
import { Stuff } from './stuff/entities/stuff.entity';
import { PaymentIssuesReasonModule } from './payment_issues_reason/payment_issues_reason.module';
import { PaymentIssuesReason } from './payment_issues_reason/entities/payment_issues_reason.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review.entity';
import { MealCategoryModule } from './meal_category/meal_category.module';
import { MealCategory } from './meal_category/entities/meal_category.entity';
import { ImageProxyModule } from './image-proxy/image-proxy.module';
import { UserRole } from './user/entities/user-role.entity';
import { OrderModule } from './order/order.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order_items/entities/order_item.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'), //for pictures
    }),

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [
        Delivery,
        User,
        Manager,
        Payment,
        Role,
        OrderTable,
        Image,
        Restaurant,
        Stuff,
        PaymentIssuesReason,
        Review,
        MealCategory,
        UserRole, //many to many without table creating
        Order,
        OrderItem,
      ],
      autoLoadModels: true,
      logging: true,
      sync: { alter: true },
    }),

    PaymentModule,
    ManagerModule,
    DeliveryModule,
    UserModule,
    ImageModule,
    RoleModule,
    MailModule,
    OrderTableModule,
    RestaturantModule,
    StuffModule,
    PaymentIssuesReasonModule,
    ReviewModule,
    MealCategoryModule,
    ImageProxyModule,
    OrderModule,
    OrderItemsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
