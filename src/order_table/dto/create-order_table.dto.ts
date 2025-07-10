import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateOrderTableDto {
  @ApiProperty({
    example: '112m',
    description: 'Table identifier (e.g., 112m or A5)',
  })
  @IsNotEmpty({ message: 'Table number is required' })
  @IsString({ message: 'Table number must be a string' })
  number: string;

  @ApiProperty({
    example: true,
    description: 'Whether the table is near a window',
  })
  @IsNotEmpty({ message: 'is_window is required' })
  @IsBoolean({ message: 'is_window must be a boolean' })
  is_window: boolean;
}
