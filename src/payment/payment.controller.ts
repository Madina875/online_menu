import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Payment } from "./entities/payment.entity";
import { AuthGuard } from "../common/guards/jwt-auth.guard";
import { IsActiveGuard } from "../common/guards/is-active.guard";
import { AdminManagementGuard } from "../common/guards/admin-management.guard";
import { RoleGuard } from "../common/guards/role.guard";

@Controller("payment")
@ApiTags("Payment 🪙")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(
    AuthGuard,
    IsActiveGuard,
    RoleGuard(["customer", "admin", "superadmin"])
  )
  @Post()
  @ApiOperation({
    summary: "Create a new payment (Customer + Admin + Superadmin)",
  })
  @ApiResponse({ status: 201, description: "Payment created", type: Payment })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  ///////////////////////////////////////here is the logic for calculating overall amount of the order by meals payment/////////////////////////////////////////////////////////////
  @Get("calculate-total/:orderId")
  async getOrderTotal(@Param("orderId", ParseIntPipe) orderId: number) {
    return this.paymentService.findOverallAmount(orderId);
  }
  ///////////////////////////////////////////////////////////////////////

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Get()
  @ApiOperation({ summary: "Get all payments (Admin + Superadmin)" })
  @ApiResponse({
    status: 200,
    description: "List of payments",
    type: [Payment],
  })
  findAll() {
    return this.paymentService.findAll();
  }

  @UseGuards(
    AuthGuard,
    IsActiveGuard,
    RoleGuard(["admin", "manager", "customer", "superadmin"])
  )
  @Get(":id")
  @ApiOperation({
    summary: "Get a payment by ID (Admin + Manager + Customer + Superadmin)",
  })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Payment found", type: Payment })
  @ApiResponse({ status: 404, description: "Payment not found" })
  findOne(@Param("id", ParseIntPipe) id: string) {
    return this.paymentService.findOne(+id);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Update a payment (Admin + Superadmin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Payment updated", type: Payment })
  @ApiResponse({ status: 404, description: "Payment not found" })
  update(
    @Param("id", ParseIntPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Delete a payment (Admin + Superadmin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Payment deleted" })
  @ApiResponse({ status: 404, description: "Payment not found" })
  remove(@Param("id", ParseIntPipe) id: string) {
    return this.paymentService.remove(+id);
  }
}
