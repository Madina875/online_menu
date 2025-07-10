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
} from '@nestjs/common';
import { RestaturantService } from './restaturant.service';
import { UpdateRestaturantDto } from './dto/update-restaturant.dto';
import { CreateRestaurantDto } from './dto/create-restaturant.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Restaurant } from './entities/restaturant.entity';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { IsActiveGuard } from '../common/guards/is-active.guard';
import { AdminManagementGuard } from '../common/guards/admin-management.guard';

@Controller('restaurant')
@ApiTags('Restaurant 🛎️')
export class RestaturantController {
  constructor(private readonly restaturantService: RestaturantService) {}

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Post()
  @ApiOperation({ summary: 'Creating a restaurant (Admin + Superadmin)' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant created',
    type: Restaurant,
  })
  create(@Body() createRestaturantDto: CreateRestaurantDto) {
    return this.restaturantService.create(createRestaturantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants (Public)' })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants',
    type: [Restaurant],
  })
  findAll() {
    return this.restaturantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID (Public)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Restaurant found',
    type: Restaurant,
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.restaturantService.findOne(+id);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant by ID (Admin + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated',
    type: Restaurant,
  })
  @ApiResponse({ status: 404, description: 'restaurant not found' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateRestaturantDto: UpdateRestaturantDto,
  ) {
    return this.restaturantService.update(+id, updateRestaturantDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove restaurant (Admin + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Restaurant deleted' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.restaturantService.remove(+id);
  }
}
