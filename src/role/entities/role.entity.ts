import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/entities/user-role.entity';

interface IRoleCreationAttr {
  role: string;
}

@Table({ tableName: 'role' })
export class Role extends Model<Role, IRoleCreationAttr> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ApiProperty({
    example: 'customer',
    description: 'role of the person for the restaurnat',
  })
  @Column({ type: DataType.STRING })
  declare role: string;

  //many to many without table
  @BelongsToMany(() => User, () => UserRole)
  user: User[];
}
