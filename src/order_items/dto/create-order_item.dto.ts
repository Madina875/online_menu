import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the meal category',
  })
  @IsInt()
  @IsPositive()
  meal_categoryId: number;

  @ApiProperty({
    example: 5,
    description: 'ID of the related order',
  })
  @IsInt()
  @IsPositive()
  orderId: number;

  @ApiProperty({
    example: 3,
    description: 'Quantity of items in the order',
  })
  @IsInt()
  @IsPositive()
  quantity: number;
}
