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
} from "@nestjs/common";
import { ManagerService } from "./manager.service";
import { CreateManagerDto } from "./dto/create-manager.dto";
import { UpdateManagerDto } from "./dto/update-manager.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Manager } from "./entities/manager.entity";
import { AuthGuard } from "../common/guards/jwt-auth.guard";
import { IsActiveGuard } from "../common/guards/is-active.guard";
import { AdminManagementGuard } from "../common/guards/admin-management.guard";
import { SuperadminOnlyGuard } from "../common/guards/superadmin-only.guard";

@ApiTags("Manager 🧑🏻‍💼")
@Controller("manager")
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @UseGuards(AuthGuard, IsActiveGuard, AdminManagementGuard)
  @Post()
  @ApiOperation({ summary: "Create a new manager" })
  @ApiResponse({ status: 201, description: "Manager created", type: Manager })
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managerService.create(createManagerDto);
  }

  @UseGuards(
    AuthGuard,
    IsActiveGuard,
    SuperadminOnlyGuard,
    AdminManagementGuard
  )
  @Get()
  @ApiOperation({ summary: "List of managers (Admin + Superadmin)" })
  @ApiResponse({
    status: 200,
    description: "List of managers",
    type: [Manager],
  })
  findAll(
    @Query("restaurantId") restaurantId?: number,
    @Query("name") name?: string
  ) {
    const filters = { restaurantId, name };
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key]
    );
    return Object.keys(filters).length
      ? this.managerService.findAll(filters)
      : this.managerService.findAll();
  }

  @UseGuards(AuthGuard, IsActiveGuard, SuperadminOnlyGuard)
  @Get(":id")
  @ApiOperation({ summary: "Get manager by ID (Self-access + Superadmin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "manager found", type: Manager })
  @ApiResponse({ status: 404, description: "Manager not found" })
  findOne(@Param("id", ParseIntPipe) id: string) {
    return this.managerService.findOne(+id);
  }

  @UseGuards(AuthGuard, IsActiveGuard, SuperadminOnlyGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Update manager BY ID (Self-access + Superadmin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Manager updated", type: Manager })
  @ApiResponse({ status: 404, description: "manager not found" })
  update(
    @Param("id", ParseIntPipe) id: string,
    @Body() updateManagerDto: UpdateManagerDto
  ) {
    return this.managerService.update(+id, updateManagerDto);
  }

  @UseGuards(
    AuthGuard,
    IsActiveGuard,
    SuperadminOnlyGuard,
    AdminManagementGuard
  )
  @Delete(":id")
  @ApiOperation({ summary: "Remove manager by ID (Admin + Superadmin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Manager deleted" })
  @ApiResponse({ status: 404, description: "Manager not found" })
  remove(@Param("id", ParseIntPipe) id: string) {
    return this.managerService.remove(+id);
  }
}
