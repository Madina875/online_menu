import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtSelfGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = String(req.user.id);
    const paramId = String(req.params.id);
    const role = req.user.role;

    // Superadmin can access everything
    if (role === 'superadmin') {
      return true;
    }

    // Admin and customer can only access their own resources
    if ((role === 'admin' || role === 'customer') && userId === paramId) {
      return true;
    }

    throw new ForbiddenException({
      message:
        'Ruxsat etilmagan foydalanuvchi (self-access only for admin or customer) ❌👾',
    });
  }
}
