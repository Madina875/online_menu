import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsIn,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: '25000',
    description: 'Total amount paid (as a string, in soʻm, cents, etc.)',
  })
  
  @IsNotEmpty({ message: 'Payment amount is required' })
  @IsNumberString(
    { no_symbols: true },
    { message: 'Payment amount must be a numeric string' },
  )
  payment_amount: string;

  @ApiProperty({
    example: 'cash',
    enum: ['cash', 'card', 'click', 'transfer'],
    description: 'Method of payment',
  })
  @IsNotEmpty({ message: 'Payment method is required' })
  @IsIn(['cash', 'card', 'click', 'transfer'], {
    message: 'Payment method must be one of: cash, card, click, transfer',
  })
  payment_method: 'cash' | 'card' | 'click' | 'transfer';

  @ApiProperty({
    example: 'paid',
    enum: ['pending', 'paid', 'failed'],
    description: 'Status of the payment',
  })
  @IsNotEmpty({ message: 'Payment status is required' })
  @IsIn(['pending', 'paid', 'failed'], {
    message: 'Payment status must be one of: pending, paid, failed',
  })
  payment_status: 'pending' | 'paid' | 'failed';

  @ApiProperty({
    example: '2025-07-05T14:30:00Z',
    description: 'Date and time when payment was made (ISO format)',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'payed_at must be a valid ISO 8601 date string' },
  )
  payed_at?: string;
}
