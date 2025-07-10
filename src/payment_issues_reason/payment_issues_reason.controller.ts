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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentIssuesReasonService } from './payment_issues_reason.service';
import { CreatePaymentIssuesReasonDto } from './dto/create-payment_issues_reason.dto';
import { UpdatePaymentIssuesReasonDto } from './dto/update-payment_issues_reason.dto';
import { PaymentIssuesReason } from './entities/payment_issues_reason.entity';

@Controller('payment-issues-reason')
@ApiTags('Payment Issues 💳⚠️')
export class PaymentIssuesReasonController {
  constructor(
    private readonly paymentIssuesReasonService: PaymentIssuesReasonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment issue reason' })
  @ApiResponse({
    status: 201,
    description: 'Issue reason successfully created',
    type: PaymentIssuesReason,
  })
  create(@Body() createDto: CreatePaymentIssuesReasonDto) {
    return this.paymentIssuesReasonService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment issue reasons' })
  @ApiResponse({
    status: 200,
    description: 'List of all payment issue reasons',
    type: [PaymentIssuesReason],
  })
  findAll() {
    return this.paymentIssuesReasonService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single payment issue reason by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Payment issue reason found',
    type: PaymentIssuesReason,
  })
  @ApiResponse({ status: 404, description: 'Issue reason not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentIssuesReasonService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment issue reason by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Issue reason updated successfully',
    type: PaymentIssuesReason,
  })
  @ApiResponse({ status: 404, description: 'Issue reason not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePaymentIssuesReasonDto,
  ) {
    return this.paymentIssuesReasonService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment issue reason by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Issue reason deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Issue reason not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentIssuesReasonService.remove(id);
  }
}
