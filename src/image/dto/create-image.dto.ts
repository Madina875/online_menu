import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the meal this image is associated with',
  })
  @IsNotEmpty({ message: 'mealId is required' })
  @IsInt({ message: 'mealId must be an integer' })
  mealId: number;

  @ApiProperty({
    example: 'kjhgfdsdfghnm,mnbvfdvb',
    description: 'image url',
  })
  @IsNotEmpty({ message: 'image_url is required' })
  @IsString({ message: 'image_url must be an string' })
  image_url: string;
}
