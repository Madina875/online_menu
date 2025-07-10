import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery) private readonly deliveryModel: typeof Delivery,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    return await this.deliveryModel.create(createDeliveryDto);
  }

  async findAll() {
    return await this.deliveryModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const delivery = await this.deliveryModel.findByPk(id);
    if (!delivery) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
    return delivery;
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    //affectedRows - [{}]  | affectedCount - 1 (qator)
    const [affectedCount, affectedRows] = await this.deliveryModel.update(
      updateDeliveryDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: number) {
    const deletedCount = await this.deliveryModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`Delivery with id ${id} not found`);
    }
    return { message: 'Delivery deleted successfully' };
  }
}
