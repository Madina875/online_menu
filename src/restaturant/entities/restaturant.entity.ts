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
import { Manager } from '../../manager/entities/manager.entity';
import { Stuff } from '../../stuff/entities/stuff.entity';
import { MealCategory } from '../../meal_category/entities/meal_category.entity';

interface IRestaturantCreationAttr {
  name: string;
  location: string;
  address: string;
  managerId: number;
}

@Table({ tableName: 'restaurant' })
export class Restaurant extends Model<Restaurant, IRestaturantCreationAttr> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
  @ApiProperty({
    example: 'Sushi Empire',
    description: 'The name of the restaurant',
  })
  @Column({ type: DataType.STRING })
  declare name: string;

  @ApiProperty({
    example: 'Tashkent City',
    description: 'General location or region of the restaurant',
  })
  @Column({ type: DataType.STRING })
  declare location: string;

  @ApiProperty({
    example: '45A Amir Temur Avenue, Tashkent',
    description: 'Full address of the restaurant',
  })
  @Column({ type: DataType.STRING })
  declare address: string;

  @ApiProperty({
    example: 101,
    description: 'ID of the assigned restaurant manager',
  })
  @ForeignKey(() => Manager) //
  @Column({ type: DataType.INTEGER })
  declare managerId: number;

  @BelongsTo(() => Manager, 'managerId') //
  declare manager: Manager;

  @HasMany(() => Stuff)
  declare stuff: Stuff[];

  @HasMany(() => MealCategory)
  declare meal_category: MealCategory[];
}
