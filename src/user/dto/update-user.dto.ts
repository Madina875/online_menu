import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsBoolean,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Alex Johnson',
    description: 'Full name of the user',
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  full_name?: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number in international format',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsPhoneNumber('UZ', {
    message: 'Phone number must be valid (e.g., +998901234567)',
  })
  phone_number?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the user is active',
  })
  @IsNotEmpty({ message: 'is_active is required' })
  @IsBoolean({ message: 'is_active must be a boolean' })
  is_active?: boolean;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'User password (minimum 6 characters)',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}
