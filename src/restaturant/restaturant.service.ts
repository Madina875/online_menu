import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRestaturantDto } from './dto/update-restaturant.dto';
import { CreateRestaurantDto } from './dto/create-restaturant.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant } from './entities/restaturant.entity';
import { Stuff } from '../stuff/entities/stuff.entity';

@Injectable()
export class RestaturantService {
  constructor(
    @InjectModel(Restaurant)
    private readonly restaurantModel: typeof Restaurant,
  ) {}
  create(createRestaturantDto: CreateRestaurantDto) {
    return this.restaurantModel.create(createRestaturantDto);
  }

  findAll() {
    return this.restaurantModel.findAll({
      include: {
        model: Stuff,
        attributes: ['name'],
      },
    });
  }

  async findOne(id: number) {
    const restaurant = await this.restaurantModel.findByPk(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  async update(id: number, updateRestaturantDto: UpdateRestaturantDto) {
    const [affectedCount, affectedRows] = await this.restaurantModel.update(
      updateRestaturantDto,
      {
        where: { id },
        returning: true,
      },
    );
    if (affectedCount === 0) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return affectedRows[0];
  }

  async remove(id: number) {
    const deletedCount = await this.restaurantModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return { message: `restaurant with id ${id} deleted successfully` };
  }
}
