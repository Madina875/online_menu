import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { Stuff } from '../stuff/entities/stuff.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { User } from '../user/entities/user.entity';
import { OrderTable } from '../order_table/entities/order_table.entity';
import { Payment } from '../payment/entities/payment.entity';
import { MealCategory } from '../meal_category/entities/meal_category.entity';
import { Op } from 'sequelize';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = await this.orderModel.create(createOrderDto);
    return order;
  }

  async findAll(filters: any = {}) {
    filters = filters || {};
    const {
      customerId,
      order_status,
      fromDate,
      toDate,
      deliveryStatus,
      orderNumber,
      customerName,
      people_count,
    } = filters;
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (order_status) where.order_status = order_status;
    if (fromDate || toDate) {
      where.order_date = {};
      if (fromDate) where.order_date[Op.gte] = new Date(fromDate);
      if (toDate) where.order_date[Op.lte] = new Date(toDate);
    }
    if (orderNumber) where.order_number = orderNumber;
    if (people_count) where.people_count = people_count;
    const include = [
      {
        model: User,
        attributes: ['id', 'full_name', 'is_active', 'phone_number', 'email'],
        ...(customerName ? { where: { full_name: customerName } } : {}),
      },
      { model: OrderTable, attributes: ['id', 'number', 'is_window'] },
      {
        model: Payment,
        attributes: [
          'id',
          'payment_amount',
          'payment_method',
          'payment_status',
        ],
      },
      { model: Stuff, attributes: ['id', 'name'] },
      {
        model: Delivery,
        attributes: [
          'id',
          'status',
          'deliver_name',
          'vehicle_number',
          'deliver_type',
        ],
        ...(deliveryStatus ? { where: { status: deliveryStatus } } : {}),
      },
      {
        model: MealCategory,
        through: {
          attributes: ['orderId', 'meal_categoryId'],
        },
        attributes: ['id', 'type', 'name'],
      },
    ];
    const attributes = [
      'id',
      'customerId',
      'order_status',
      'order_method',
      'order_date',
      'people_count',
      'tableId',
      'paymentId',
      'stuffId',
      'deliveryId',
    ];
    return this.orderModel.findAll({ where, include, attributes });
  }

  async findOne(id: number) {
    const order = await this.orderModel.findByPk(id, {
      include: [
        { model: User },
        { model: OrderTable },
        { model: Payment },
        { model: Stuff },
        { model: Delivery },
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const [affectedRows, updatedOrders] = await this.orderModel.update(
      updateOrderDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedRows === 0) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return updatedOrders[0];
  }

  async remove(id: number) {
    const order = await this.orderModel.findByPk(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    await order.destroy();
    return { message: `Order with id ${id} deleted successfully` };
  }
}
