import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import {
  DeliveryStatus,
  VehicleType,
} from '../../delivery/dto/create-delivery.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../order/entities/order.entity';

export interface IDeliveryCreationAttr {
  status: DeliveryStatus;
  deliver_name: string;
  deliver_type: VehicleType;
  vehicle_number: string;
  delivered_at: string;
}

@Table({ tableName: 'delivery' })
export class Delivery extends Model<Delivery, IDeliveryCreationAttr> {
  @ApiProperty({ example: 1, description: 'Current ID of the delivery record' })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ApiProperty({
    example: DeliveryStatus.DELIVERED,
    enum: DeliveryStatus,
    description: 'Current status of the delivery',
  })
  @Column({
    type: DataType.ENUM(...Object.values(DeliveryStatus)),
    allowNull: false,
  })
  declare status: DeliveryStatus;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the delivery person',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare deliver_name: string;

  @ApiProperty({
    example: VehicleType.CAR,
    enum: VehicleType,
    description: 'Type of vehicle used for delivery',
  })
  @Column({
    type: DataType.ENUM(...Object.values(VehicleType)),
    allowNull: false,
  })
  declare deliver_type: VehicleType;

  @ApiProperty({
    example: 'AB123CD',
    description: 'Vehicle number plate',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare vehicle_number: string;

  @ApiProperty({
    example: '2025-07-05T14:30:00Z',
    description: 'Date and time when the delivery was completed',
  })
  @Column({
    type: DataType.STRING,
    defaultValue: String(new Date()),
  })
  declare delivered_at: string;

  @HasMany(() => Order)
  declare order: Order[];
}
