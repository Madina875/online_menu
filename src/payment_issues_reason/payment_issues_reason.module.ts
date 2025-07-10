import { Module } from '@nestjs/common';
import { PaymentIssuesReasonService } from './payment_issues_reason.service';
import { PaymentIssuesReasonController } from './payment_issues_reason.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentIssuesReason } from './entities/payment_issues_reason.entity';

@Module({
  imports: [SequelizeModule.forFeature([PaymentIssuesReason, Payment])],
  controllers: [PaymentIssuesReasonController],
  providers: [PaymentIssuesReasonService],
})
export class PaymentIssuesReasonModule {}
