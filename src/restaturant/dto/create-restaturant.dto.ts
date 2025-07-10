import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Sushi Empire',
    description: 'The name of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Tashkent City',
    description: 'General location or region of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: '45A Amir Temur Avenue, Tashkent',
    description: 'Full address of the restaurant',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 101,
    description: 'ID of the assigned restaurant manager',
  })
  @IsNumber()
  managerId: number;
}
