import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStuffDto } from './dto/create-stuff.dto';
import { UpdateStuffDto } from './dto/update-stuff.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Stuff } from './entities/stuff.entity';

@Injectable()
export class StuffService {
  constructor(@InjectModel(Stuff) private readonly stuffModel: typeof Stuff) {}
  create(createStuffDto: CreateStuffDto) {
    return this.stuffModel.create(createStuffDto);
  }

  findAll() {
    return this.stuffModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const stuff = await this.stuffModel.findByPk(id);
    if (!stuff) {
      throw new NotFoundException(`stuff with id ${id} not found`);
    }
    return stuff;
  }

  async update(id: number, updateStuffDto: UpdateStuffDto) {
    const [affectedCount, affectedRows] = await this.stuffModel.update(
      updateStuffDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`stuff with id ${id} not found`);
    }
    return affectedRows[0];
  }

  async remove(id: number) {
    const deletedCount = await this.stuffModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`stuff with id ${id} not found`);
    }
    return { message: `stuff with id ${id} deleted successfully` };
  }
}
