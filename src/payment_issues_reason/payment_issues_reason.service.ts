import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaymentIssuesReason } from './entities/payment_issues_reason.entity';
import { CreatePaymentIssuesReasonDto } from './dto/create-payment_issues_reason.dto';
import { UpdatePaymentIssuesReasonDto } from './dto/update-payment_issues_reason.dto';

@Injectable()
export class PaymentIssuesReasonService {
  constructor(
    @InjectModel(PaymentIssuesReason)
    private readonly paymentIssModel: typeof PaymentIssuesReason,
  ) {}

  async create(createDto: CreatePaymentIssuesReasonDto) {
    return await this.paymentIssModel.create(createDto);
  }

  async findAll() {
    return await this.paymentIssModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const issue = await this.paymentIssModel.findByPk(id);
    if (!issue) {
      throw new NotFoundException(`Payment issue with ID ${id} not found`);
    }
    return issue;
  }

  async update(id: number, updateDto: UpdatePaymentIssuesReasonDto) {
    const [affectedCount, updatedRows] = await this.paymentIssModel.update(
      updateDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Payment issue with ID ${id} not found`);
    }

    return updatedRows[0];
  }

  async remove(id: number) {
    const issue = await this.paymentIssModel.findByPk(id);
    if (!issue) {
      throw new NotFoundException(`Payment issue with ID ${id} not found`);
    }

    await issue.destroy();
    return { message: `Payment issue with ID ${id} has been deleted.` };
  }
}
