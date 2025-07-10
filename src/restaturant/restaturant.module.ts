import { Module } from '@nestjs/common';
import { RestaturantService } from './restaturant.service';
import { RestaturantController } from './restaturant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './entities/restaturant.entity';
import { Manager } from '../manager/entities/manager.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Restaurant, Manager]),JwtModule], //
  controllers: [RestaturantController],
  providers: [RestaturantService],
})
export class RestaturantModule {}
