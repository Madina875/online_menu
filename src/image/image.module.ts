import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './entities/image.entity';
import { MealCategory } from '../meal_category/entities/meal_category.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Image, MealCategory]), JwtModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
