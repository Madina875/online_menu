import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from '../../role/entities/role.entity';

interface IUserRoleCreationAttr {
  userId: number;
  roleId: number;
}

//just created a model:
@Table({ tableName: 'user_role' })
export class UserRole extends Model<UserRole, IUserRoleCreationAttr> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.NUMBER,
  })
  declare userId: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.NUMBER,
  })
  declare roleId: number;
}
