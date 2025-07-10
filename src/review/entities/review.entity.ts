import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface IReviewCreationAttr {
  rating: number;
  comment: string;
  orderId: number;
}

@Table({ tableName: 'review' })
export class Review extends Model<Review, IReviewCreationAttr> {
  @ApiProperty({ example: 1, description: 'Unique ID of the review' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 5, description: 'Rating between 1 and 5 stars ⭐' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare rating: number;

  @ApiProperty({
    example: 'Amazing delivery and delicious food!',
    description: 'Comment written by the user 💬',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare comment: string;

  @ApiProperty({ example: 1, description: 'ID of the reviewed order 🧾' })
  //   @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare orderId: number;

  //   @BelongsTo(() => Order)
  //   order: Order;
}
