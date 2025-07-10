import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateManagerDto {
  @ApiProperty({
    example: 'Alex Johnson',
    description: 'Full name of the manager',
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @Length(2, 50, { message: 'Full name must be between 2 and 50 characters' })
  full_name: string;
}
