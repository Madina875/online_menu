import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './entities/image.entity';
import { MealCategory } from '../meal_category/entities/meal_category.entity';

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image) private readonly imageModel: typeof Image) {}
  create(createImageDto: CreateImageDto) {
    return this.imageModel.create(createImageDto);
  }

  findAll() {
    return this.imageModel.findAll({
      include: { model: MealCategory, attributes: ['type', 'name'] },
    });
  }

  async findOne(id: number) {
    const image = await this.imageModel.findByPk(id);
    if (!image) {
      throw new NotFoundException(`image with id ${id} not found`);
    }
    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const [affectedCount, affectedRows] = await this.imageModel.update(
      updateImageDto,
      {
        where: { id },
        returning: true,
      },
    );
    if (affectedCount === 0) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }
    return affectedRows[0];
  }

  async remove(id: number) {
    const deletedCount = await this.imageModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`image with id ${id} not found`);
    }
    return { message: `image with id ${id} deleted successfully` };
  }
}
