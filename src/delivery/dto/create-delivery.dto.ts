import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDateString,
  Length,
} from 'class-validator';

export enum DeliveryStatus {
  PENDING = 'pending', // Order received but not processed
  PACKING = 'packing', // Being packed
  SHIPPED = 'shipped', // Sent out for delivery
  IN_TRANSIT = 'in_transit', // On the way
  DELIVERED = 'delivered', // Successfully delivered
  CANCELED = 'cancelled', // Canceled by user or system
  RETURNED = 'returned', // Returned by customer
}

export enum VehicleType {
  BICYCLE = 'bicycle', // For small, local deliveries
  MOTORBIKE = 'motorbike', // Fast delivery
  CAR = 'car', // Standard delivery
  VAN = 'van', // Larger deliveries
  TRUCK = 'truck', // Bulk or long-distance
  DRONE = 'drone', // Tech-driven small package
  FOOT = 'foot', // Courier walking
}

export class CreateDeliveryDto {
  @ApiProperty({
    example: DeliveryStatus.DELIVERED,
    enum: DeliveryStatus,
    description: 'Current status of the delivery',
  })
  @IsEnum(DeliveryStatus, {
    message: 'Status must be a valid DeliveryStatus enum value',
  })
  status: DeliveryStatus;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the delivery person',
  })
  @IsNotEmpty({ message: 'Deliver name is required' })
  @IsString({ message: 'Deliver name must be a string' })
  @Length(2, 50, {
    message: 'Deliver name must be between 2 and 50 characters',
  })
  deliver_name: string;

  @ApiProperty({
    example: VehicleType.CAR,
    enum: VehicleType,
    description: 'Type of vehicle used for delivery',
  })
  @IsEnum(VehicleType, {
    message: 'Deliver type must be a valid VehicleType enum value',
  })
  deliver_type: VehicleType;

  @ApiProperty({
    example: 'AB123CD',
    description: 'Vehicle number plate',
  })
  @IsNotEmpty({ message: 'Vehicle number is required' })
  @IsString({ message: 'Vehicle number must be a string' })
  @Length(4, 20, {
    message: 'Vehicle number must be between 4 and 20 characters',
  })
  vehicle_number: string;

  @ApiProperty({
    example: '2025-07-05T14:30:00Z',
    description: 'Date and time the item was delivered (ISO 8601 format)',
  })
  @IsNotEmpty({ message: 'Delivered date is required' })
  @IsDateString(
    {},
    { message: 'Delivered date must be a valid ISO date string' },
  )
  delivered_at: string;
}
