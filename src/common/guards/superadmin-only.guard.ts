import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class SuperadminOnlyGuard implements CanActivate {
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

    // Try superadmin secret first, then fallback to others
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
    let usedSecret = '';

    for (const secret of possibleSecrets) {
      if (!secret) continue; // Skip undefined secrets
      try {
        decoded = this.jwtService.verify(token, { secret });
        usedSecret = secret;
        break;
      } catch (e) {
        // Try next secret
      }
    }

    if (!decoded) {
      throw new ForbiddenException('Invalid or expired token');
    }

    req.user = decoded;

    // Only superadmin can access
    if (decoded.role !== 'superadmin') {
      throw new ForbiddenException('Superadmin access required');
    }

    console.log(
      'Superadmin access granted. Used secret:',
      usedSecret ? 'Found' : 'Not found',
    );
    return true;
  }
}
