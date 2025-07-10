import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Restaurant } from '../../restaturant/entities/restaturant.entity';
import { Order } from '../../order/entities/order.entity';

interface IStuffCreationAttr {
  name: string;
  phone_number: string;
  restaurantId: number;
}

@Table({ tableName: 'stuff' })
export class Stuff extends Model<Stuff, IStuffCreationAttr> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
  @ApiProperty({
    example: 'Alice Lin',
    description: 'Full name of the staff member',
  })
  @Column({ type: DataType.STRING })
  declare name: string;

  @ApiProperty({
    example: '+998901112233',
    description: 'Phone number in international format',
  })
  @Column({ type: DataType.STRING })
  declare phone_number: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the restaurant the staff belongs to',
  })
  @ForeignKey(() => Restaurant)
  @Column({ type: DataType.INTEGER })
  declare restaurantId: number;

  @BelongsTo(() => Restaurant, 'restaurantId')
  declare restaurant: Restaurant;

  
    @HasMany(() => Order)
    declare order: Order[];
}
