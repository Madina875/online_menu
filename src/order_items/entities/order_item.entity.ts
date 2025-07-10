import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { MealCategory } from '../../meal_category/entities/meal_category.entity';
import { Order } from '../../order/entities/order.entity';

interface IOrderItemCreationAttr {
  orderId: number;
  meal_categoryId: number;
  quantity: number;
}

@Table({ tableName: 'order_items' })
export class OrderItem extends Model<OrderItem, IOrderItemCreationAttr> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the order item',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 2, description: 'ID of the meal category' })
  @ForeignKey(() => MealCategory)
  @Column({ type: DataType.INTEGER })
  declare meal_categoryId: number;

  @BelongsTo(() => MealCategory)
  declare mealCategory: MealCategory;

  @ApiProperty({ example: 5, description: 'ID of the related order' })
  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  declare orderId: number;

  @BelongsTo(() => Order)
  declare order: Order;

  @ApiProperty({ example: 3, description: 'Quantity of meals in the order' })
  @Column({ type: DataType.INTEGER })
  declare quantity: number;
}
