import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../../restaturant/entities/restaturant.entity';
import { Image } from '../../image/entities/image.entity';
import { Order } from '../../order/entities/order.entity';
import { OrderItem } from '../../order_items/entities/order_item.entity';

interface IMealCategoryCreationattr {
  type: string;
  name: string;
  restaurantId: number;
  payment: string;
}

@Table({ tableName: 'meal_category' })
export class MealCategory extends Model<
  MealCategory,
  IMealCategoryCreationattr
> {
  @ApiProperty({ example: 1, description: '🔑 Unique ID of the meal category' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    example: 'main_course',
    description: '📦 Type of the category (e.g., appetizer, dessert)',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: string;

  @ApiProperty({
    example: 'Pasta Specials',
    description: '🍽️ Display name of the category',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @ApiProperty({
    example: '25000',
    description: 'Total amount paid as a string (in soʻm, cents, etc.)',
  })
  @Column({
    type: DataType.STRING,
  })
  declare payment: string;

  @ApiProperty({
    example: 101,
    description: '🏨 ID of the restaurant this category belongs to',
  })
  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare restaurantId: number;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;

  @HasMany(() => Image)
  declare image: Image[];

  @BelongsToMany(() => Order, () => OrderItem)
  order: Order[];
}
