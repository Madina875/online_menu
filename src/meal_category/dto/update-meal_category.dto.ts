import { PartialType } from '@nestjs/swagger';
import { CreateMealCategoryDto } from './create-meal_category.dto';

export class UpdateMealCategoryDto extends PartialType(CreateMealCategoryDto) {}
