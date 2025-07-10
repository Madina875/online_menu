import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Restaurant } from '../../restaturant/entities/restaturant.entity';

interface IManagerCreationAttr {
  full_name: string;
}

@Table({ tableName: 'manager' })
export class Manager extends Model<Manager, IManagerCreationAttr> {
  @ApiProperty({ example: 1, description: 'Current ID of the manager' })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;
  @ApiProperty({
    example: 'Alex Jell',
    description: 'Full name of the manager',
  })
  @Column({ type: DataType.STRING })
  declare full_name: string;

  @HasMany(() => Restaurant)
  declare restaurant: Restaurant[];
}
