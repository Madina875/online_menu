import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: '⭐ Rating given by the user (1 to 5)',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'The food was amazing and arrived on time!',
    description: '💬 User comment or review about the order',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    example: 42,
    description: '🧾 ID of the order being reviewed',
  })
  @IsInt()
  orderId: number;
}
