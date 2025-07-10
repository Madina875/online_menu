import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role) private readonly roleModel: typeof Role) {}
  create(createRoleDto: CreateRoleDto) {
    return this.roleModel.create(createRoleDto);
  }

  findAll() {
    return this.roleModel.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'full_name', 'phone_number', 'email'],
          through: { attributes: ['userId', 'roleId'] },
        },
      ],
    });
  }

  async findRoleByParam(role: string) {
    return this.roleModel.findOne({ where: { role: role } });
  }

  async findOne(id: number) {
    const role = await this.roleModel.findByPk(id);
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const [affectedCount, affectedRows] = await this.roleModel.update(
      updateRoleDto,
      { where: { id }, returning: true },
    );
    if (affectedCount === 0) {
      throw new NotFoundException(`role with id ${id} not found`);
    }
    return affectedRows[0];
  }

  async remove(id: number) {
    const deletedCount = await this.roleModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`role with id ${id} not found`);
    }
    return { message: `role with id ${id} deleted successfully` };
  }
}
