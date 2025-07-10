import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderTableDto } from './dto/create-order_table.dto';
import { UpdateOrderTableDto } from './dto/update-order_table.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderTable } from './entities/order_table.entity';

@Injectable()
export class OrderTableService {
  constructor(
    @InjectModel(OrderTable) private readonly tableModel: typeof OrderTable,
  ) {}
  create(createOrderTableDto: CreateOrderTableDto) {
    return this.tableModel.create(createOrderTableDto);
  }

  findAll() {
    return this.tableModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const table = await this.tableModel.findByPk(id);
    if (!table) {
      throw new NotFoundException(`table with id ${id} not found`);
    }
    return table;
  }

  async update(id: number, updateOrderTableDto: UpdateOrderTableDto) {
    const [affectedCount, affectedRows] = await this.tableModel.update(
      updateOrderTableDto,
      { where: { id }, returning: true },
    );
    if (affectedCount === 0) {
      throw new NotFoundException(`table with id ${id} not found`);
    }
    return affectedRows[0];
  }

  async remove(id: number) {
    const deletedCount = await this.tableModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`table with id ${id} not found`);
    }
    return { message: `table with id ${id} deleted successfully` };
  }
}
