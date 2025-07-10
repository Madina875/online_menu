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
import { StuffService } from './stuff.service';
import { CreateStuffDto } from './dto/create-stuff.dto';
import { UpdateStuffDto } from './dto/update-stuff.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Stuff } from './entities/stuff.entity';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { IsActiveGuard } from '../common/guards/is-active.guard';
import { AdminManagementGuard } from '../common/guards/admin-management.guard';

@Controller('stuff')
@ApiTags('Stuff 👨‍🍳')
export class StuffController {
  constructor(private readonly stuffService: StuffService) {}

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Post()
  @ApiOperation({ summary: 'Create a staff member (Admin + Superadmin)' })
  @ApiResponse({
    status: 201,
    description: 'Staff member created',
    type: Stuff,
  })
  create(@Body() createStuffDto: CreateStuffDto) {
    return this.stuffService.create(createStuffDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Get()
  @ApiOperation({ summary: 'Get all staff members (Admin + Superadmin)' })
  @ApiResponse({
    status: 200,
    description: 'List of staff members',
    type: [Stuff],
  })
  findAll() {
    return this.stuffService.findAll();
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get staff member by ID (Admin + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Staff member found',
    type: Stuff,
  })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stuffService.findOne(id);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update staff member by ID (Admin + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Staff member updated',
    type: Stuff,
  })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStuffDto: UpdateStuffDto,
  ) {
    return this.stuffService.update(id, updateStuffDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove a staff member (Admin + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Staff member deleted' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stuffService.remove(id);
  }
}
