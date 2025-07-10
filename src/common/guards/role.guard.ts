import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
  mixin,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

// Factory function to create a role guard with allowed roles
export function RoleGuard(allowedRoles: string[] | 'all') {
  @Injectable()
  class MixinRoleGuard implements CanActivate {
    static ALL_ROLES = [
      'admin',
      'customer',
      'manager',
      'stuff',
      'delivery',
      'superadmin',
    ];
    constructor(public readonly jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new ForbiddenException('No authorization header');
      }
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new ForbiddenException('Invalid authorization header');
      }
      const possibleSecrets = [
        process.env.ACCESS_TOKEN_KEYSuperadmin,
        process.env.ACCESS_TOKEN_KEYAdmin,
        process.env.ACCESS_TOKEN_KEYManager,
        process.env.ACCESS_TOKEN_KEYStuff,
        process.env.ACCESS_TOKEN_KEYDelivery,
        process.env.ACCESS_TOKEN_KEYCustomer,
        process.env.ACCESS_TOKEN_KEYUser,
      ];

      let decoded: any = null;
      for (const secret of possibleSecrets) {
        try {
          decoded = this.jwtService.verify(token, { secret });
          break;
        } catch (e) {
          // try next
        }
      }
      if (!decoded) {
        throw new ForbiddenException('Invalid or expired token');
      }
      req.user = decoded;
      const rolesToCheck =
        allowedRoles === 'all' ? MixinRoleGuard.ALL_ROLES : allowedRoles;
      const userRoles = Array.isArray(decoded.role)
        ? decoded.role
        : [decoded.role];
      if (!userRoles.some((role: string) => rolesToCheck.includes(role))) {
        throw new ForbiddenException(
          'You do not have permission for this resource',
        );
      }
      return true;
    }
  }
  return mixin(MixinRoleGuard);
}
