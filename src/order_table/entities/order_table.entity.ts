import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from '../../order/entities/order.entity';

interface IOrderTableCreationAttr {
  number: string;
  is_window: boolean;
}

@Table({ tableName: 'order_table' })
export class OrderTable extends Model<OrderTable, IOrderTableCreationAttr> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
  @ApiProperty({
    example: '112m',
    description: 'Table identifier (e.g., 112m or A5)',
  })
  @Column({ type: DataType.STRING })
  declare number: string;

  @ApiProperty({
    example: true,
    description: 'Whether the table is near a window',
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare is_window: boolean;

  
    @HasMany(() => Order)
    declare order: Order[];
}
