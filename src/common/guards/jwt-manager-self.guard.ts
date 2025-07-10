import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtManagerSelfGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const currentUserId = req.user.id;
    const managerId = req.params.id;
    const role = req.user.role;

    if (role === 'superadmin') {
      return true;
    }

    // Manager can only access their own resources
    // For now, we'll assume the manager ID should match the user ID
    // You may need to adjust this based on your actual data structure
    if (role === 'manager' && String(currentUserId) === String(managerId)) {
      return true;
    }

    throw new ForbiddenException({
      message: 'Ruxsat etilmagan foydalanuvchi (manager self-access only) ❌👾',
    });
  }
}
