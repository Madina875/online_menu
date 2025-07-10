import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIssuesReasonDto {
  @ApiProperty({
    example: 1,
    description: '🧾 ID of the payment this issue is related to',
  })
  @IsNumber()
  @IsNotEmpty()
  paymentId: number;

  @ApiProperty({
    example: 'Customer reported duplicate charge on their card',
    description: '📝 Description of the payment issue or reason',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
