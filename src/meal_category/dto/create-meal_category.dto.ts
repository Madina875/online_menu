import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsNumberString } from 'class-validator';

export class CreateMealCategoryDto {
  @ApiProperty({
    example: 'main_course',
    description:
      '📦 Type of the meal category (e.g., appetizer, dessert, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: 'Pasta Specials',
    description: '🍽️ Name of the meal category to be displayed',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 101,
    description: '🏨 ID of the restaurant this category belongs to',
  })
  @IsInt()
  restaurantId: number;

  @ApiProperty({
    example: '25000',
    description: 'Total amount paid (as a string, in soʻm, cents, etc.)',
  })
  @IsNotEmpty({ message: 'Payment amount is required' })
  @IsNumberString(
    { no_symbols: true },
    { message: 'Payment amount must be a numeric string' },
  )
  payment: string;
}
