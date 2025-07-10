import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderTableService } from './order_table.service';
import { CreateOrderTableDto } from './dto/create-order_table.dto';
import { UpdateOrderTableDto } from './dto/update-order_table.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderTable } from './entities/order_table.entity';

@Controller('order-table')
@ApiTags('Ordered_table 🥄')
export class OrderTableController {
  constructor(private readonly orderTableService: OrderTableService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order table' })
  @ApiResponse({
    status: 201,
    description: 'Table ordered created',
    type: OrderTable,
  })
  create(@Body() createOrderTableDto: CreateOrderTableDto) {
    return this.orderTableService.create(createOrderTableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ordered tables' })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: [OrderTable],
  })
  findAll() {
    return this.orderTableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get the ordered table by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'order found', type: OrderTable })
  @ApiResponse({ status: 404, description: 'Order not found' })
  //ParseIntPipe -gets id as a number
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.orderTableService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update the ordered table' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Table order updated',
    type: OrderTable,
  })
  @ApiResponse({ status: 404, description: 'Ordered table not found' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateOrderTableDto: UpdateOrderTableDto,
  ) {
    return this.orderTableService.update(+id, updateOrderTableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the ordered table' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Ordered table deleted' })
  @ApiResponse({ status: 404, description: 'Ordered table not found' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.orderTableService.remove(+id);
  }
}
