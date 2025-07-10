import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Stuff } from '../../stuff/entities/stuff.entity';
import { Delivery } from '../../delivery/entities/delivery.entity';
import { User } from '../../user/entities/user.entity';
import { OrderTable } from '../../order_table/entities/order_table.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { MealCategory } from '../../meal_category/entities/meal_category.entity';
import { OrderItem } from '../../order_items/entities/order_item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderMethod {
  ONLINE = 'online',
  IN_PERSON = 'in-person',
  PHONE = 'phone',
}

interface IOrderCreationattr {
  customerId: number;
  tableId: number;
  paymentId: number;
  order_status: string;
  order_method: string;
  order_date: string;
  people_count: number;
  stuffId: number;
  deliveryId: number;
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order, IOrderCreationattr> {
  @ApiProperty({ example: 1, description: 'Unique order ID' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare customerId: number;

  @ApiProperty({ example: 1, description: 'Payment ID' })
  @ForeignKey(() => Payment)
  @Column({ type: DataType.INTEGER })
  declare paymentId: number;

  @BelongsTo(() => User)
  declare customer: User;

  @BelongsTo(() => Payment)
  declare payment: Payment;

  @ApiProperty({ example: 2, description: 'Table ID' })
  @ForeignKey(() => OrderTable)
  @Column({ type: DataType.INTEGER })
  declare tableId: number;

  @BelongsTo(() => OrderTable)
  declare table: OrderTable;

  @ApiProperty({
    example: 'pending',
    enum: OrderStatus,
    description: 'Order status',
  })
  @Column({ type: DataType.ENUM('pending', 'completed', 'cancelled') })
  declare order_status: OrderStatus;

  @ApiProperty({
    example: 'online',
    enum: OrderMethod,
    description: 'Order method',
  })
  @Column({ type: DataType.ENUM('online', 'in-person', 'phone') })
  declare order_method: OrderMethod;

  @ApiProperty({
    example: '2025-07-06T13:45:00Z',
    description: 'Date and time of the order',
  })
  @Column({ type: DataType.STRING, defaultValue: new Date() })
  declare order_date: string;

  @ApiProperty({ example: 3, description: 'Number of people' })
  @Column({ type: DataType.INTEGER })
  declare people_count: number;

  @ApiProperty({
    example: 4,
    description: 'Staff member who handled the order',
  })
  @ForeignKey(() => Stuff)
  @Column({ type: DataType.INTEGER })
  declare stuffId: number;

  @BelongsTo(() => Stuff)
  declare stuff: Stuff;

  @ApiProperty({ example: 7, description: 'Delivery ID (if applicable)' })
  @ForeignKey(() => Delivery)
  @Column({ type: DataType.INTEGER })
  declare deliveryId: number;

  @BelongsTo(() => Delivery)
  declare delivery: Delivery;

  @BelongsToMany(() => MealCategory, () => OrderItem)
  meal_category: MealCategory[];
}
