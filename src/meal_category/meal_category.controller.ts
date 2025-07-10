import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MealCategoryService } from './meal_category.service';
import { CreateMealCategoryDto } from './dto/create-meal_category.dto';
import { UpdateMealCategoryDto } from './dto/update-meal_category.dto';
import { MealCategory } from './entities/meal_category.entity';

@Controller('meal_category')
@ApiTags('Meals 🍴🥩')
export class MealCategoryController {
  constructor(private readonly mealCategoryService: MealCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a meal category' })
  @ApiResponse({
    status: 201,
    description: 'Meal category created successfully',
    type: MealCategory,
  })
  create(@Body() createMealCategoryDto: CreateMealCategoryDto) {
    return this.mealCategoryService.create(createMealCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all meal categories with images' })
  @ApiResponse({
    status: 200,
    description: 'List of all meal categories',
    type: [MealCategory],
  })
  findAll() {
    return this.mealCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meal category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Meal category found',
    type: MealCategory,
  })
  @ApiResponse({ status: 404, description: 'Meal category not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mealCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a meal category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Meal category updated successfully',
    type: MealCategory,
  })
  @ApiResponse({ status: 404, description: 'Meal category not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealCategoryDto: UpdateMealCategoryDto,
  ) {
    return this.mealCategoryService.update(id, updateMealCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meal category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Meal category deleted' })
  @ApiResponse({ status: 404, description: 'Meal category not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mealCategoryService.remove(id);
  }
}
