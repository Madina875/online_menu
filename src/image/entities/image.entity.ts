import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { MealCategory } from '../../meal_category/entities/meal_category.entity';

interface IImageCreationAttr {
  mealId: number;
  image_url: string;
}

@Table({ tableName: 'image' })
export class Image extends Model<Image, IImageCreationAttr> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ApiProperty({
    example: 'ytrdefgbhnbgfdfgv',
    description: 'image of the meal',
  })
  @Column({ type: DataType.STRING })
  declare image_url: string;

  @ForeignKey(() => MealCategory)
  @ApiProperty({
    example: 1,
    description: 'ID of the meal this image is associated with',
  })
  @Column({ type: DataType.INTEGER })
  declare mealId: number;

  @BelongsTo(() => MealCategory, 'mealId') //
  declare meal_category: MealCategory;
}
