import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MealCategory } from './entities/meal_category.entity';
import { CreateMealCategoryDto } from './dto/create-meal_category.dto';
import { UpdateMealCategoryDto } from './dto/update-meal_category.dto';
import { Image } from '../image/entities/image.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order_items/entities/order_item.entity';

@Injectable()
export class MealCategoryService {
  constructor(
    @InjectModel(MealCategory)
    private readonly mealCategoryModel: typeof MealCategory,
  ) {}

  async create(createMealCategoryDto: CreateMealCategoryDto) {
    return await this.mealCategoryModel.create(createMealCategoryDto);
  }

  async findAll() {
    return await this.mealCategoryModel.findAll({
      include: [
        {
          model: Image,
          attributes: ['image_url'],
        },
        {
          model: Order,
          through: {
            attributes: ['orderId', 'meal_categoryId'],
          },
          attributes: ['id', 'order_status'],
        },
      ],
    });
  }

  async findOne(id: number) {
    const category = await this.mealCategoryModel.findByPk(id, {
      include: {
        model: Image,
        attributes: ['image_url'],
      },
    });

    if (!category) {
      throw new NotFoundException(`Meal category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateMealCategoryDto: UpdateMealCategoryDto) {
    const [updatedCount, updatedRows] = await this.mealCategoryModel.update(
      updateMealCategoryDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (updatedCount === 0) {
      throw new NotFoundException(`Meal category with ID ${id} not found`);
    }

    return updatedRows[0];
  }

  async remove(id: number) {
    const category = await this.mealCategoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException(`Meal category with ID ${id} not found`);
    }

    await category.destroy();
    return { message: `Meal category with ID ${id} deleted successfully.` };
  }
}
