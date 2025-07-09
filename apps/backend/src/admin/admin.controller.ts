import { Controller, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get('pending-users')
  async getPendingUsers() {
    return this.adminService.getPendingUsers();
  }

  @Patch('users/:id/approve')
  async approveUser(@Param('id') id: string) {
    return this.adminService.approveUser(Number(id));
  }

  @Patch('users/:id/reject')
  async rejectUser(@Param('id') id: string) {
    return this.adminService.rejectUser(Number(id));
  }


} 