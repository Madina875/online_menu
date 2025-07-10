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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { IsActiveGuard } from '../common/guards/is-active.guard';
import { SuperadminOnlyGuard } from '../common/guards/superadmin-only.guard';
import { AdminManagementGuard } from '../common/guards/admin-management.guard';

@Controller('role')
@ApiTags('Role 🎭')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AuthGuard, IsActiveGuard, SuperadminOnlyGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new role (Superadmin only)' })
  @ApiResponse({ status: 201, description: 'Role created', type: Role })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Get()
  @ApiOperation({ summary: 'Get all roles (Admin + Superadmin)' })
  @ApiResponse({
    status: 200,
    description: 'List of roles',
    type: [Role],
  })
  findAll() {
    return this.roleService.findAll();
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Get('role/:role')
  @ApiOperation({ summary: 'Get role by name (Admin + Superadmin)' })
  async getRoleByParam(@Param('role') value: string) {
    return this.roleService.findRoleByParam(value);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID (Admin + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Role found', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.roleService.findOne(+id);
  }

  @UseGuards(AuthGuard, IsActiveGuard, SuperadminOnlyGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update role by ID (Superadmin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Role updated', type: Role })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, SuperadminOnlyGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove role by ID (Superadmin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Role deleted' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.roleService.remove(+id);
  }
}
