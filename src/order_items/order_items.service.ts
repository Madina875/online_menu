import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from './entities/order_item.entity';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { MealCategory } from '../meal_category/entities/meal_category.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectModel(OrderItem)
    private readonly orderItemModel: typeof OrderItem,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemModel.create(createOrderItemDto);
  }
  async findAll() {
    return await this.orderItemModel.findAll({
      include: [
        {
          model: MealCategory,
          attributes: ['id', 'name', 'type'],
        },
        {
          model: Order,
          attributes: ['id', 'order_status', 'order_date'],
        },
      ],
    });
  }
  async findOne(id: number) {
    const item = await this.orderItemModel.findByPk(id, {
      include: { all: true },
    });
    if (!item) {
      throw new NotFoundException(`Order item with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const [affectedCount, [updatedItem]] = await this.orderItemModel.update(
      updateOrderItemDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (!affectedCount) {
      throw new NotFoundException(`Order item with id ${id} not found`);
    }

    return updatedItem;
  }

  async remove(id: number) {
    const item = await this.orderItemModel.findByPk(id);
    if (!item) {
      throw new NotFoundException(`Order item with id ${id} not found`);
    }

    await item.destroy();
    return { message: 'Order item deleted successfully' };
  }
}
