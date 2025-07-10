import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Payment } from '../../payment/entities/payment.entity';

interface IPaymentIssuesReasonCreationAttr {
  paymentId: number;
  description: string;
}

@Table({ tableName: 'payment_issues_reason' })
export class PaymentIssuesReason extends Model<
  PaymentIssuesReason,
  IPaymentIssuesReasonCreationAttr
> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
  @ApiProperty({
    example: 1,
    description: '🧾 ID of the payment this issue is related to',
  })
  @ForeignKey(() => Payment)
  @Column({ type: DataType.INTEGER })
  declare paymentId: number;

  @BelongsTo(() => Payment, 'paymentId') //
  declare payment: Payment;

  @ApiProperty({
    example: 'Customer reported duplicate charge on their card',
    description: '📝 Description of the payment issue or reason',
  })
  @Column({ type: DataType.STRING })
  declare description: string;
}
