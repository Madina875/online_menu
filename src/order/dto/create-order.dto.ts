import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString, IsEnum, Min } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderMethod {
  ONLINE = 'online',
  IN_PERSON = 'in-person',
  PHONE = 'phone',
}

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'Customer ID who placed the order' })
  @IsNumber()
  customerId: number;

  @ApiProperty({ example: 3, description: 'Table ID (if dining in)' })
  @IsNumber()
  tableId: number;

  @ApiProperty({ example: 3, description: 'Payment ID (if dining in)' })
  @IsNumber()
  paymentId: number;

  @ApiProperty({
    example: OrderStatus.PENDING,
    enum: OrderStatus,
    description: 'Status of the order',
  })
  @IsEnum(OrderStatus)
  order_status: OrderStatus;

  @ApiProperty({
    example: OrderMethod.ONLINE,
    enum: OrderMethod,
    description: 'Method of order (online, in-person, phone)',
  })
  @IsEnum(OrderMethod)
  order_method: OrderMethod;

  @ApiProperty({
    example: '2025-07-06T13:45:00Z',
    description: 'Date and time of the order (ISO format)',
  })
  @IsDateString()
  order_date: string;

  @ApiProperty({
    example: 2,
    description: 'Number of people for the table',
  })
  @IsNumber()
  @Min(1)
  people_count: number;

  @ApiProperty({
    example: 5,
    description: 'ID of the staff handling the order',
  })
  @IsNumber()
  stuffId: number;

  @ApiProperty({
    example: 10,
    description: 'ID of the delivery entry (if delivery order)',
  })
  @IsNumber()
  deliveryId: number;
}
