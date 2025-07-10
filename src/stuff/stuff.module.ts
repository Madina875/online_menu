import { Module } from '@nestjs/common';
import { StuffService } from './stuff.service';
import { StuffController } from './stuff.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Stuff } from './entities/stuff.entity';
import { Restaurant } from '../restaturant/entities/restaturant.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Stuff, Restaurant]), JwtModule],
  controllers: [StuffController],
  providers: [StuffService],
})
export class StuffModule {}
