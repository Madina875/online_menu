import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaturant.dto';
export class UpdateRestaturantDto extends PartialType(CreateRestaurantDto) {}
