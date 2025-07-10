import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Manager } from './entities/manager.entity';
import { Restaurant } from '../restaturant/entities/restaturant.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(Manager) private readonly managerModel: typeof Manager,
  ) {}

  create(createManagerDto: CreateManagerDto) {
    return this.managerModel.create(createManagerDto);
  }

  findAll(filters: any = {}) {
    filters = filters || {};
    const { restaurantId, name } = filters;
    const where: any = {};
    if (name) where.name = name;
    const include: any = {
      model: Restaurant,
      attributes: ['name', 'location'],
    };
    if (restaurantId) include.where = { id: restaurantId };
    return this.managerModel.findAll({
      where,
      include,
    });
  }

  async findOne(id: number) {
    const manager = await this.managerModel.findByPk(id);
    if (!manager) {
      throw new NotFoundException(`manager with id ${id} not found`);
    }
    return manager;
  }

  async update(id: number, updateManagerDto: UpdateManagerDto) {
    const [affectedCount, affectedRows] = await this.managerModel.update(
      updateManagerDto,
      { where: { id }, returning: true },
    );
    if (affectedCount === 0) {
      throw new NotFoundException(`Manager with id ${id} not found`);
    }
  }

  async remove(id: number) {
    const deletedCount = await this.managerModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`manager with id ${id} not found`);
    }
    return { message: 'manager deleted successfully' };
  }
}
