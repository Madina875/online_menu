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
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { IsActiveGuard } from '../common/guards/is-active.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { AdminManagementGuard } from '../common/guards/admin-management.guard';

@ApiTags('Orders 📦')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard, IsActiveGuard, RoleGuard(['customer', 'manager']))
  @Post()
  @ApiOperation({ summary: 'Create new order (Customer only)' })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
    type: Order,
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @UseGuards(
    AuthGuard,
    IsActiveGuard,
    // AdminManagementGuard,
    RoleGuard(['manager']),
  )
  @Get()
  @ApiOperation({ summary: 'Get all orders (Admin + Superadmin)' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: [Order],
  })
  findAll(
    @Query('customerId') customerId?: number,
    @Query('order_status') order_status?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('deliveryStatus') deliveryStatus?: string,
    @Query('order_number') orderNumber?: string,
    @Query('customerName') customerName?: string,
    @Query('people_count') people_count?: number,
  ) {
    const filters = {
      customerId,
      order_status,
      fromDate,
      toDate,
      deliveryStatus,
      orderNumber,
      customerName,
      people_count,
    };
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key],
    );
    return Object.keys(filters).length
      ? this.orderService.findAll(filters)
      : this.orderService.findAll();
  }

  @UseGuards(
    AuthGuard,
    IsActiveGuard,
    RoleGuard(['admin', 'manager', 'customer', 'superadmin']),
  )
  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID (Admin + Manager + Customer + Superadmin)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Order found', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @UseGuards(
    AuthGuard,
    IsActiveGuard,
    RoleGuard(['admin', 'manager', 'superadmin']),
  )
  @Patch(':id')
  @ApiOperation({
    summary: 'Update order by ID (Admin + Manager + Superadmin)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Order updated', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete order by ID (Admin + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Order deleted' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
