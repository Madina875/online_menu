import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Payment } from "./entities/payment.entity";
import { PaymentIssuesReason } from "../payment_issues_reason/entities/payment_issues_reason.entity";
import { OrderItem } from "../order_items/entities/order_item.entity";
import { MealCategory } from "../meal_category/entities/meal_category.entity";

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private readonly paymentModel: typeof Payment,
    @InjectModel(OrderItem) private readonly orderItemModel: typeof OrderItem,
    @InjectModel(MealCategory)
    private readonly mealCategoryModel: typeof MealCategory
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentModel.create(createPaymentDto);
  }

  findAll() {
    return this.paymentModel.findAll({
      include: {
        model: PaymentIssuesReason,
        attributes: ["description"],
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
      { where: { id }, returning: true }
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
    return { message: "Payment deleted successfully" };
  }

  async calculateTotalForOrder(orderId: number): Promise<number> {
    const orderItems = await this.orderItemModel.findAll({
      where: { orderId },
      include: [{ model: MealCategory }],
    });
    let total = 0;
    for (const item of orderItems) {
      const price = Number(item.mealCategory?.payment || 0);
      total += price * item.quantity;
    }
    return total;
  }

  async findOverallAmount(orderId: number) {
    const total = await this.calculateTotalForOrder(orderId);
    return { orderId, total };
  }
}
