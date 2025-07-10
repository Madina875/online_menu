import { Module } from '@nestjs/common';
import { MealCategoryService } from './meal_category.service';
import { MealCategoryController } from './meal_category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MealCategory } from './entities/meal_category.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([MealCategory]), JwtModule],
  controllers: [MealCategoryController],
  providers: [MealCategoryService],
})
export class MealCategoryModule {}
