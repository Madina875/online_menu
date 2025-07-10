import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review) private readonly reviewModel: typeof Review,
  ) {}
  create(createReviewDto: CreateReviewDto) {
    return this.reviewModel.create(createReviewDto);
  }

  findAll() {
    return this.reviewModel.findAll();
  }

  async findOne(id: number) {
    const review = await this.reviewModel.findByPk(id);
    if (!review) {
      throw new NotFoundException(`review with id ${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const [affectedCount, affectedRows] = await this.reviewModel.update(
      updateReviewDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`review with id ${id} not found`);
    }
    return affectedRows[0];
  }

  async remove(id: number) {
    const deletedCount = await this.reviewModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`review with id ${id} not found`);
    }
    return { message: `review with id ${id} deleted successfully` };
  }
}
