import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './entities/payment.entity';
import { PaymentIssuesReason } from '../payment_issues_reason/entities/payment_issues_reason.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private readonly paymentModel: typeof Payment,
  ) {}
  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentModel.create(createPaymentDto);
  }

  findAll() {
    return this.paymentModel.findAll({
      include: {
        model: PaymentIssuesReason,
        attributes: ['description'],
      },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentModel.findByPk(id);
    if (!payment) {
      throw new NotFoundException(`payment with id ${id} not found`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const [affectedCount, affectedRows] = await this.paymentModel.update(
      updatePaymentDto,
      { where: { id }, returning: true },
    );
    if (affectedCount === 0) {
      throw new NotFoundException(`payment with id ${id} not found`);
    }
    return affectedRows[0];
  }

  async remove(id: number) {
    const deletedCount = await this.paymentModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return { message: 'Payment deleted successfully' };
  }
}
