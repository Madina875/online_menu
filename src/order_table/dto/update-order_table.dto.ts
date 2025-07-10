import { PartialType } from '@nestjs/swagger';
import { CreateOrderTableDto } from './create-order_table.dto';

export class UpdateOrderTableDto extends PartialType(CreateOrderTableDto) {}
