import { ApiProperty } from '@nestjs/swagger';
import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from '../../role/entities/role.entity';
import { UserRole } from './user-role.entity';
import { Order } from '../../order/entities/order.entity';

interface IUserCreationAttr {
  full_name: string;
  is_active: boolean;
  phone_number: string;
  email: string;
  password: string;
  activation_link: string;
  refresh_token: string | null;
}

@Table({ tableName: 'user' })
export class User extends Model<User, IUserCreationAttr> {
  @ApiProperty({ example: 1, description: 'Current ID of the user' })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ApiProperty({
    example: 'Stiven Bob',
    description: 'Full name of the user',
  })
  @Column({ type: DataType.STRING })
  declare full_name: string;

  @ApiProperty({
    example: true,
    description: 'Current status of the user is_active',
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare is_active: boolean;

  @ApiProperty({
    example: '+998901112233',
    description: 'Phone number in international format',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone_number: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @ApiProperty({
    example: 'StrongUse1!',
    description: 'User password (at least 6 characters)',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  //many to many without table
  @BelongsToMany(() => Role, () => UserRole)
  role: Role[];

  @HasMany(() => Order)
  declare order: Order[];

  @Column({
    type: DataType.STRING,
    defaultValue: DataType.UUIDV4,
  })
  declare activation_link: string;

  @Column({
    type: DataType.STRING,
  })
  declare refresh_token: string | null;
}
