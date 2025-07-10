import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class IsActiveGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
        // next secrets
      }
    }

    if (!decoded) {
      throw new ForbiddenException('Invalid or expired token');
    }

    req.user = decoded;
    if (decoded.is_active !== true) {
      throw new ForbiddenException('User is not active');
    }
    return true;
  }
}
