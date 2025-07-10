import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateStuffDto {
  @ApiProperty({
    example: 'Alice Lin',
    description: 'Full name of the staff member',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '+998901112233',
    description: 'Phone number in international format',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsPhoneNumber('UZ', {
    message: 'Phone number must be valid (e.g., +99890...)',
  })
  phone_number: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the restaurant the staff belongs to',
  })
  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;
}
