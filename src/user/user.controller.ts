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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { RoleGuard } from 'src/common/guards/role.guard';
import { JwtSelfGuard } from '../common/guards/jwt-admin-self.guard';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IsActiveGuard } from '../common/guards/is-active.guard';
import { AdminManagementGuard } from '../common/guards/admin-management.guard';
import { SuperadminOnlyGuard } from '../common/guards/superadmin-only.guard';

@ApiTags('User 👧🏻/👦🏻')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard, IsActiveGuard, SuperadminOnlyGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user (Superadmin only)' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin + Superadmin)' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [User],
  })
  findAll(
    @Query('role') role?: string,
    @Query('is_active') is_active?: boolean,
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const filters = { role, is_active, email, name, fromDate, toDate };
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key],
    );
    return Object.keys(filters).length
      ? this.userService.findAll(filters)
      : this.userService.findAll();
  }

  @UseGuards(AuthGuard, IsActiveGuard, JwtSelfGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get a user record by ID (Self-access + Superadmin)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Post('email')
  @ApiOperation({ summary: 'Find user by email (Admin + Superadmin)' })
  findUserByEmail(@Body('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @UseGuards(AuthGuard, IsActiveGuard, JwtSelfGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user (Self-access + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user (Admin + Superadmin)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(+id);
  }
}
