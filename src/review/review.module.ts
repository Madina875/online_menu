import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { Restaurant } from '../restaturant/entities/restaturant.entity';

@Module({
  imports: [SequelizeModule.forFeature([Review, Restaurant])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
