import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleService.findRoleByParam(createUserDto.role);
    if (!role) {
      throw new NotFoundException('Bunday role yoq');
    }
    // Hash password here
    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    const activation_link = uuidv4();

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      activation_link,
    });
    await user.$set('role', [role.id]);
    await user.save();
    return user;
  }

  findAll(filters: any = {}) {
    filters = filters || {};
    const { role, is_active, email, name, fromDate, toDate } = filters;
    const where: any = {};
    if (is_active !== undefined) where.is_active = is_active;
    if (email) where.email = email;
    if (name) where.full_name = name;
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt['$gte'] = new Date(fromDate);
      if (toDate) where.createdAt['$lte'] = new Date(toDate);
    }
    const include: any = [
      {
        model: Role,
        attributes: ['role'],
        through: { attributes: ['userId', 'roleId'] },
        ...(role ? { where: { role } } : {}),
      },
    ];
    return this.userModel.findAll({ where, include });
  }

  findUserByEmail(email: string) {
    return this.userModel.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ['id', 'role'],
          through: { attributes: [] },
        },
      ],
      raw: false, // Ensure we get the full model instance with associations
    });
  }
  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    //affectedRows - [{}]  | affectedCount - 1 (qator)
    const [affectedCount, affectedRows] = await this.userModel.update(
      updateUserDto,
      { where: { id }, returning: true },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return affectedRows[0];
  }

  async getUserBYEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
      include: {
        model: Role,
        attributes: ['id', 'role'],
        through: { attributes: [] },
      },
    });
    return user?.dataValues;
  }

  async remove(id: number) {
    const deletedCount = await this.userModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User deleted successfully' };
  }
}
