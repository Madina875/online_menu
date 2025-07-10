import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentIssuesReason } from '../../payment_issues_reason/entities/payment_issues_reason.entity';
import { Order } from '../../order/entities/order.entity';

export interface IPaymentCreationAttr {
  payment_amount: string;
  payment_method: 'cash' | 'card' | 'click' | 'transfer';
  payment_status: 'pending' | 'paid' | 'failed';
  payed_at?: string;
}

@Table({ tableName: 'payment' })
export class Payment extends Model<Payment, IPaymentCreationAttr> {
  @ApiProperty({ example: 1, description: 'Unique ID of the payment record' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ApiProperty({
    example: '25000',
    description: 'Total amount paid as a string (in soʻm, cents, etc.)',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare payment_amount: string;

  @ApiProperty({
    example: 'cash',
    enum: ['cash', 'card', 'click', 'transfer'],
    description: 'Method of payment',
  })
  @Column({
    type: DataType.ENUM('cash', 'card', 'click', 'transfer'),
    allowNull: false,
  })
  declare payment_method: 'cash' | 'card' | 'click' | 'transfer';

  @ApiProperty({
    example: 'paid',
    enum: ['pending', 'paid', 'failed'],
    description: 'Current status of the payment',
  })
  @Column({
    type: DataType.ENUM('pending', 'paid', 'failed'),
    allowNull: false,
  })
  declare payment_status: 'pending' | 'paid' | 'failed';

  @ApiProperty({
    example: '2025-07-05T14:30:00Z',
    description: 'Date and time the payment was made',
  })
  @Column({
    type: DataType.STRING,
    defaultValue: new Date(),
  })
  declare payed_at: string;

  @HasMany(() => PaymentIssuesReason)
  declare payment_issues_reason: PaymentIssuesReason[];

  @HasMany(() => Order)
  declare order: Order[];
}
